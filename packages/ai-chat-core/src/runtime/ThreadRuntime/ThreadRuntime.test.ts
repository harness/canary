/**
 * Tests for the close-stream HITL fix: ThreadRuntime.sendSystemEvent
 * must await an in-flight run instead of silently swallowing the
 * "A run is already in progress" error.
 *
 * Before the fix: sendSystemEvent called during a run was a no-op —
 * the caller's catch block dropped the thrown error on the floor and
 * the system event stream never fired. This caused elicitation card
 * clicks to vanish during the ~50-300 ms tail of the previous run.
 *
 * After the fix: sendSystemEvent awaits waitForIdle() on the core,
 * which resolves when the previous run's finally block drains its
 * waiter list.
 */

import { StreamAdapter, StreamChunk, StreamRequest, SystemEvent } from '../../types/adapters'
import { ThreadRuntime } from './ThreadRuntime'
import { ThreadRuntimeCore } from './ThreadRuntimeCore'

// -----------------------------------------------------------------------------
// Controllable stream adapter: tests advance each run's iteration manually
// via a gate Promise, so we can reliably assert ordering without relying on
// timers.
// -----------------------------------------------------------------------------
interface Run {
  systemEvent?: SystemEvent
  release: () => void
  released: Promise<void>
}

function makeControllableAdapter() {
  const runs: Run[] = []

  const adapter: StreamAdapter = {
    async *stream(request: StreamRequest): AsyncIterable<StreamChunk> {
      let release: () => void = () => {}
      const released = new Promise<void>(resolve => {
        release = resolve
      })

      const run: Run = {
        systemEvent: request.systemEvent,
        release,
        released
      }
      runs.push(run)

      // Block until the test explicitly releases this run.
      await released

      // Emit a single metadata event so the run actually produces
      // something observable in the core's message list.
      yield {
        event: { type: 'metadata', conversationId: 'conv-test' }
      }
    }
  }

  return { adapter, runs }
}

describe('ThreadRuntime.sendSystemEvent race against in-flight run', () => {
  it('dispatches immediately when nothing is running', async () => {
    const { adapter, runs } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    const runtime = new ThreadRuntime(core)

    const event: SystemEvent = {
      event_type: 'action_completed',
      capability_id: 'cap-1'
    }

    const sendPromise = runtime.sendSystemEvent(event)

    // Give the microtask queue a tick so the run starts and registers
    // in our runs[] array.
    await Promise.resolve()
    await Promise.resolve()

    expect(runs).toHaveLength(1)
    expect(runs[0].systemEvent).toBe(event)

    // Release the run and let sendSystemEvent resolve.
    runs[0].release()
    await sendPromise

    expect(core.isRunning).toBe(false)
  })

  it('waits for an in-flight run to finish before dispatching', async () => {
    const { adapter, runs } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    const runtime = new ThreadRuntime(core)

    // Kick off run #1.
    const firstEvent: SystemEvent = {
      event_type: 'action_completed',
      capability_id: 'cap-first'
    }
    const firstPromise = runtime.sendSystemEvent(firstEvent)
    await Promise.resolve()
    await Promise.resolve()
    expect(runs).toHaveLength(1)
    expect(core.isRunning).toBe(true)

    // Fire run #2 while #1 is still active. Prior to the fix this
    // call's caught error would have silently dropped the event and
    // runs[] would stay at length 1.
    const secondEvent: SystemEvent = {
      event_type: 'action_completed',
      capability_id: 'cap-second'
    }
    const secondPromise = runtime.sendSystemEvent(secondEvent)
    await Promise.resolve()
    await Promise.resolve()

    // Still only one run started — the second is parked on
    // waitForIdle() inside sendSystemEvent.
    expect(runs).toHaveLength(1)

    // Release run #1. Its finally block drains waiters, which lets
    // the second dispatch proceed.
    runs[0].release()
    await firstPromise

    // Now the second dispatch starts and registers run #2.
    await Promise.resolve()
    await Promise.resolve()
    expect(runs).toHaveLength(2)
    expect(runs[1].systemEvent).toBe(secondEvent)

    // Finish it off.
    runs[1].release()
    await secondPromise
    expect(core.isRunning).toBe(false)
  })

  it('does not drop the event on a second dispatch (regression for silent-swallow bug)', async () => {
    const { adapter, runs } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    const runtime = new ThreadRuntime(core)

    const first: SystemEvent = { event_type: 'action_completed', capability_id: 'a' }
    const second: SystemEvent = { event_type: 'action_completed', capability_id: 'b' }

    const p1 = runtime.sendSystemEvent(first)
    await Promise.resolve()
    await Promise.resolve()

    // Second dispatch during #1 still in flight — regression point.
    const p2 = runtime.sendSystemEvent(second)

    // Drain microtasks repeatedly to give a bug the chance to surface
    // as a stuck pending promise.
    for (let i = 0; i < 5; i++) await Promise.resolve()

    // Event #2 must still be pending and waiting, not silently
    // resolved and discarded.
    expect(runs).toHaveLength(1)

    runs[0].release()
    await p1
    await Promise.resolve()
    await Promise.resolve()
    expect(runs).toHaveLength(2)
    expect(runs[1].systemEvent).toBe(second)
    runs[1].release()
    await p2
  })
})

describe('ThreadRuntimeCore.waitForIdle', () => {
  it('resolves immediately when not running', async () => {
    const { adapter } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    await expect(core.waitForIdle()).resolves.toBeUndefined()
  })

  it('resolves after the in-flight run finishes', async () => {
    const { adapter, runs } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    const runtime = new ThreadRuntime(core)

    const runPromise = runtime.sendSystemEvent({
      event_type: 'action_completed',
      capability_id: 'waitable'
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(core.isRunning).toBe(true)

    let idleResolved = false
    const idlePromise = core.waitForIdle().then(() => {
      idleResolved = true
    })

    // Pump a few microtasks — idle must NOT have resolved yet.
    for (let i = 0; i < 3; i++) await Promise.resolve()
    expect(idleResolved).toBe(false)

    runs[0].release()
    await runPromise
    await idlePromise
    expect(idleResolved).toBe(true)
    expect(core.isRunning).toBe(false)
  })
})
