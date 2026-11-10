import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createLoadingBarController, loadingBar } from '../loading-bar-controller'
import { useLoadingBar, useLoadingBarController, useLoadingBarTask, withLoadingBar } from '../use-loading-bar'

const SHOW_DELAY = 120
const KEY_ONE = 'one'
const KEY_TWO = 'two'

// @testing-library/react for React 17 has no renderHook.
function renderHook<T, P = undefined>(hook: (props: P) => T, { initialProps }: { initialProps?: P } = {}) {
  const result = { current: undefined as unknown as T }
  const Probe = ({ hookProps }: { hookProps: P }) => {
    result.current = hook(hookProps)
    return null
  }
  const view = render(<Probe hookProps={initialProps as P} />)
  return {
    result,
    unmount: view.unmount,
    rerender: (props?: P) => view.rerender(<Probe hookProps={props as P} />)
  }
}
const make = () => createLoadingBarController({ showDelay: SHOW_DELAY, minVisibleTime: 0, random: () => 0.5 })

describe('useLoadingBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the current snapshot and follows updates', () => {
    const bar = make()
    const { result } = renderHook(() => useLoadingBar(bar))
    expect(result.current).toEqual({ visible: false, progress: 0 })
    act(() => {
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
    })
    expect(result.current).toEqual({ visible: true, progress: 0.08 })
  })

  it('picks up state that changed before the subscription was set up', () => {
    const bar = make()
    bar.start('a')
    vi.advanceTimersByTime(SHOW_DELAY)
    const { result } = renderHook(() => useLoadingBar(bar))
    expect(result.current.visible).toBe(true)
  })

  it('unsubscribes on unmount', () => {
    const bar = make()
    const unsubscribe = vi.fn()
    vi.spyOn(bar, 'subscribe').mockReturnValue(unsubscribe)
    const { unmount } = renderHook(() => useLoadingBar(bar))
    unmount()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('resubscribes when the controller changes', () => {
    const a = make()
    const b = make()
    const { result, rerender } = renderHook(({ c }) => useLoadingBar(c), { initialProps: { c: a } })
    b.start('x')
    vi.advanceTimersByTime(SHOW_DELAY)
    rerender({ c: b })
    expect(result.current.visible).toBe(true)
  })

  it('uses the shared controller by default', () => {
    const { result } = renderHook(() => useLoadingBar())
    expect(result.current).toBe(loadingBar.getSnapshot())
  })
})

describe('useLoadingBarTask', () => {
  const setup = (bar = make()) => {
    const start = vi.spyOn(bar, 'start')
    const done = vi.spyOn(bar, 'done')
    const Task = ({ active, k = 'task' }: { active: boolean; k?: string }) => {
      useLoadingBarTask(active, k, bar)
      return null
    }
    return { bar, start, done, Task }
  }

  it('does nothing while inactive', () => {
    const { start, Task } = setup()
    render(<Task active={false} />)
    expect(start).not.toHaveBeenCalled()
  })

  it('starts when active, finishes when it turns inactive', () => {
    const { start, done, Task } = setup()
    const { rerender } = render(<Task active={false} />)
    rerender(<Task active />)
    expect(start).toHaveBeenCalledWith('task')
    expect(done).not.toHaveBeenCalled()
    rerender(<Task active={false} />)
    expect(done).toHaveBeenCalledWith('task')
  })

  it('starts immediately when mounted active and finishes on unmount', () => {
    const { start, done, Task } = setup()
    const { unmount } = render(<Task active />)
    expect(start).toHaveBeenCalledTimes(1)
    unmount()
    expect(done).toHaveBeenCalledWith('task')
  })

  it('does not start twice across re-renders with the same inputs', () => {
    const { start, Task } = setup()
    const { rerender } = render(<Task active />)
    rerender(<Task active />)
    rerender(<Task active />)
    expect(start).toHaveBeenCalledTimes(1)
  })

  it('moves the work to the new key when the key changes', () => {
    const { start, done, Task } = setup()
    const { rerender } = render(<Task active k={KEY_ONE} />)
    rerender(<Task active k={KEY_TWO} />)
    expect(done).toHaveBeenCalledWith(KEY_ONE)
    expect(start).toHaveBeenLastCalledWith(KEY_TWO)
  })

  it('works without a key', () => {
    const bar = make()
    const done = vi.spyOn(bar, 'done')
    const Task = () => {
      useLoadingBarTask(true, undefined, bar)
      return null
    }
    const { unmount } = render(<Task />)
    unmount()
    expect(done).toHaveBeenCalledTimes(1)
    expect(done.mock.calls[0][0]).toMatch(/^__anonymous_/)
  })

  it('keeps the bar running until every task component has finished', () => {
    vi.useFakeTimers()
    const bar = make()
    const A = () => {
      useLoadingBarTask(true, 'a', bar)
      return null
    }
    const B = () => {
      useLoadingBarTask(true, 'b', bar)
      return null
    }
    const a = render(<A />)
    const b = render(<B />)
    vi.advanceTimersByTime(SHOW_DELAY)
    a.unmount()
    expect(bar.getSnapshot().progress).toBeLessThan(1)
    b.unmount()
    expect(bar.getSnapshot().progress).toBe(1)
    vi.useRealTimers()
  })
})

describe('withLoadingBar', () => {
  const spy = () => {
    const bar = make()
    return { bar, start: vi.spyOn(bar, 'start'), done: vi.spyOn(bar, 'done') }
  }

  it('runs for the lifetime of a promise and returns its value', async () => {
    const { bar, start, done } = spy()
    await expect(withLoadingBar(Promise.resolve(42), 'ok', bar)).resolves.toBe(42)
    expect(start).toHaveBeenCalledWith('ok')
    expect(done).toHaveBeenCalledWith('ok')
  })

  it('accepts a function returning a promise and invokes it after starting', async () => {
    const { bar, start } = spy()
    const order: string[] = []
    start.mockImplementation(key => {
      order.push('start')
      return key ?? ''
    })
    const result = await withLoadingBar(
      () => {
        order.push('task')
        return Promise.resolve('value')
      },
      'fn',
      bar
    )
    expect(result).toBe('value')
    expect(order).toEqual(['start', 'task'])
  })

  it('finishes and rethrows when the promise rejects', async () => {
    const { bar, done } = spy()
    await expect(withLoadingBar(() => Promise.reject(new Error('boom')), 'fail', bar)).rejects.toThrow('boom')
    expect(done).toHaveBeenCalledWith('fail')
  })

  it('finishes when the function throws synchronously', async () => {
    const { bar, done } = spy()
    await expect(
      withLoadingBar(
        () => {
          throw new Error('sync')
        },
        'sync',
        bar
      )
    ).rejects.toThrow('sync')
    expect(done).toHaveBeenCalledWith('sync')
  })

  it('works without a key and uses the shared controller by default', async () => {
    const start = vi.spyOn(loadingBar, 'start')
    const done = vi.spyOn(loadingBar, 'done')
    await withLoadingBar(Promise.resolve(1))
    expect(start).toHaveBeenCalledTimes(1)
    expect(done).toHaveBeenCalledTimes(1)
    start.mockRestore()
    done.mockRestore()
  })
})

describe('useLoadingBarController', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the same controller on every render', () => {
    const { result, rerender } = renderHook(() => useLoadingBarController())
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })

  it('gives each component its own controller, independent of the shared one', () => {
    const a = renderHook(() => useLoadingBarController({ showDelay: SHOW_DELAY }))
    const b = renderHook(() => useLoadingBarController({ showDelay: SHOW_DELAY }))
    expect(a.result.current).not.toBe(b.result.current)
    expect(a.result.current).not.toBe(loadingBar)
    act(() => {
      a.result.current.start(KEY_ONE)
      vi.advanceTimersByTime(SHOW_DELAY)
    })
    expect(a.result.current.getSnapshot().visible).toBe(true)
    expect(b.result.current.getSnapshot().visible).toBe(false)
    expect(loadingBar.getSnapshot().visible).toBe(false)
  })

  it('applies the given options', () => {
    const { result } = renderHook(() => useLoadingBarController({ showDelay: 0, initialProgress: 0.5 }))
    act(() => {
      result.current.start(KEY_ONE)
      vi.advanceTimersByTime(0)
    })
    expect(result.current.getSnapshot().progress).toBe(0.5)
  })

  it('resets the controller on unmount', () => {
    const { result, unmount } = renderHook(() => useLoadingBarController({ showDelay: SHOW_DELAY, minVisibleTime: 0 }))
    const controller = result.current
    act(() => {
      controller.start(KEY_ONE)
      vi.advanceTimersByTime(SHOW_DELAY)
    })
    unmount()
    expect(controller.getSnapshot().progress).toBe(1)
    vi.advanceTimersByTime(1000)
    expect(controller.getSnapshot().visible).toBe(false)
  })
})
