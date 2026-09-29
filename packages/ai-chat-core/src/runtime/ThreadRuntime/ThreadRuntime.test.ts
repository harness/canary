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

      const aborted = new Promise<never>((_, reject) => {
        const signal = request.signal
        if (!signal) return
        const onAbort = () => {
          const err = new Error('Aborted')
          err.name = 'AbortError'
          reject(err)
        }
        if (signal.aborted) {
          onAbort()
          return
        }
        signal.addEventListener('abort', onAbort, { once: true })
      })

      await Promise.race([released, aborted])

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

describe('ThreadRuntime background tasks', () => {
  it('reports isRunning while a background task is active and clears when stopped', () => {
    const { adapter } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    const runtime = new ThreadRuntime(core)

    expect(runtime.isRunning).toBe(false)

    const taskId = runtime.startBackgroundTask()
    expect(runtime.isRunning).toBe(true)
    expect(core.isRunning).toBe(true)

    runtime.stopBackgroundTask(taskId)
    expect(runtime.isRunning).toBe(false)
    expect(core.isRunning).toBe(false)
  })

  it('stays running until the last background task is stopped', () => {
    const { adapter } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })

    const a = core.startBackgroundTask()
    const b = core.startBackgroundTask()
    expect(core.isRunning).toBe(true)

    core.stopBackgroundTask(a)
    expect(core.isRunning).toBe(true)

    core.stopBackgroundTask(b)
    expect(core.isRunning).toBe(false)
  })

  it('notifies subscribers when a task starts and stops', () => {
    const { adapter } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })

    let notifications = 0
    core.subscribe(() => {
      notifications++
    })

    const id = core.startBackgroundTask()
    expect(notifications).toBe(1)

    core.stopBackgroundTask(id)
    expect(notifications).toBe(2)
  })

  it('stopBackgroundTask is a no-op for an unknown id', () => {
    const { adapter } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })

    let notifications = 0
    core.subscribe(() => {
      notifications++
    })

    core.stopBackgroundTask('does-not-exist')
    expect(notifications).toBe(0)
    expect(core.isRunning).toBe(false)
  })

  it('cancelRun cancels background tasks and invokes their onCancel callbacks', async () => {
    const { adapter } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    const runtime = new ThreadRuntime(core)

    const onCancel = jest.fn()
    runtime.startBackgroundTask({ onCancel })
    expect(runtime.isRunning).toBe(true)

    runtime.cancelRun()
    await Promise.resolve()

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(runtime.isRunning).toBe(false)
  })

  it('cancelRun aborts an in-flight run and cancels background tasks together', async () => {
    const { adapter, runs } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    const runtime = new ThreadRuntime(core)

    const runPromise = runtime.sendSystemEvent({
      event_type: 'action_completed',
      capability_id: 'cap-run'
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(runs).toHaveLength(1)

    const onCancel = jest.fn()
    runtime.startBackgroundTask({ onCancel })

    runtime.cancelRun()
    await Promise.resolve()
    runs[0].release()
    await runPromise

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(core.isRunning).toBe(false)
  })

  it('awaits streamAdapter.cancel before aborting, keeping isRunning true meanwhile', async () => {
    let releaseCancel!: () => void
    const cancelCalled = jest.fn()
    const { adapter, runs } = makeControllableAdapter()
    adapter.cancel = async (conversationId: string) => {
      cancelCalled(conversationId)
      await new Promise<void>(resolve => {
        releaseCancel = resolve
      })
    }

    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    core.setConversationId('conv-cancel')
    const runtime = new ThreadRuntime(core)

    const runPromise = runtime.sendSystemEvent({
      event_type: 'action_completed',
      capability_id: 'cap-run'
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(runs).toHaveLength(1)

    runtime.cancelRun()
    await Promise.resolve()

    expect(cancelCalled).toHaveBeenCalledWith('conv-cancel')
    expect(core.isRunning).toBe(true)

    releaseCancel()
    await Promise.resolve()
    await Promise.resolve()
    runs[0].release()
    await runPromise

    expect(core.isRunning).toBe(false)
  })

  it('does not abort a follow-on run that started while server cancel was in flight', async () => {
    let releaseCancel!: () => void
    const { adapter, runs } = makeControllableAdapter()
    adapter.cancel = async () => {
      await new Promise<void>(resolve => {
        releaseCancel = resolve
      })
    }

    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    core.setConversationId('conv-cancel')
    const runtime = new ThreadRuntime(core)

    const firstRun = runtime.sendSystemEvent({
      event_type: 'action_completed',
      capability_id: 'cap-first'
    })
    await Promise.resolve()
    await Promise.resolve()

    runtime.cancelRun()
    await Promise.resolve()

    // Server cancel ended the original stream without a local abort.
    runs[0].release()
    await firstRun

    const secondRun = runtime.sendSystemEvent({
      event_type: 'action_completed',
      capability_id: 'cap-second'
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(runs).toHaveLength(2)
    expect(core.isRunning).toBe(true)

    releaseCancel()
    await Promise.resolve()
    await Promise.resolve()

    expect(core.isRunning).toBe(true)
    runs[1].release()
    await secondRun
    expect(core.isRunning).toBe(false)
  })

  it('still aborts when streamAdapter.cancel rejects', async () => {
    const { adapter, runs } = makeControllableAdapter()
    adapter.cancel = async () => {
      throw new Error('cancel failed')
    }

    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    core.setConversationId('conv-cancel')
    const runtime = new ThreadRuntime(core)

    const runPromise = runtime.sendSystemEvent({
      event_type: 'action_completed',
      capability_id: 'cap-run'
    })
    await Promise.resolve()
    await Promise.resolve()

    runtime.cancelRun()
    await Promise.resolve()
    await Promise.resolve()
    runs[0].release()
    await runPromise

    expect(core.isRunning).toBe(false)
  })

  it('skips streamAdapter.cancel for temporary conversation ids', async () => {
    const cancelCalled = jest.fn()
    const { adapter } = makeControllableAdapter()
    adapter.cancel = cancelCalled

    const core = new ThreadRuntimeCore({ streamAdapter: adapter })
    core.setConversationId('temp-123')
    const runtime = new ThreadRuntime(core)

    runtime.startBackgroundTask()
    runtime.cancelRun()
    await Promise.resolve()

    expect(cancelCalled).not.toHaveBeenCalled()
    expect(runtime.isRunning).toBe(false)
  })

  it('waitForIdle is not blocked by background tasks (only by stream runs)', async () => {
    const { adapter } = makeControllableAdapter()
    const core = new ThreadRuntimeCore({ streamAdapter: adapter })

    core.startBackgroundTask()
    // Background tasks make isRunning true but should not park waitForIdle,
    // which exists to serialize stream-run dispatch.
    await expect(core.waitForIdle()).resolves.toBeUndefined()
  })
})
