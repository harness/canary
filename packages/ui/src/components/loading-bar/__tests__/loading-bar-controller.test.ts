import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createLoadingBarController, loadingBar } from '../loading-bar-controller'

const SHOW_DELAY = 120
const MIN_VISIBLE = 300
const COMPLETE = 200
const FADE = 200
const IDLE = { visible: false, progress: 0 }

const make = (options = {}) =>
  createLoadingBarController({ showDelay: SHOW_DELAY, minVisibleTime: MIN_VISIBLE, random: () => 0.5, ...options })

/** Starts `key`, waits until it is visible and past the minimum visible time. */
const startAndSettle = (bar: ReturnType<typeof make>, key = 'a') => {
  bar.start(key)
  vi.advanceTimersByTime(SHOW_DELAY + MIN_VISIBLE)
}

describe('createLoadingBarController', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('show delay', () => {
    it('is idle initially', () => {
      expect(make().getSnapshot()).toEqual(IDLE)
    })

    it('stays hidden for work that finishes before the show delay', () => {
      const bar = make()
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY - 10)
      expect(bar.getSnapshot()).toEqual(IDLE)
      bar.done('a')
      vi.advanceTimersByTime(5000)
      expect(bar.getSnapshot()).toEqual(IDLE)
    })

    it('does not notify subscribers for work that never became visible', () => {
      const bar = make()
      const listener = vi.fn()
      bar.subscribe(listener)
      bar.start('a')
      bar.done('a')
      vi.advanceTimersByTime(5000)
      expect(listener).not.toHaveBeenCalled()
    })

    it('appears at the initial progress once the delay passed', () => {
      const bar = make({ initialProgress: 0.2 })
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
      expect(bar.getSnapshot()).toEqual({ visible: true, progress: 0.2 })
    })
  })

  describe('trickle', () => {
    it('moves monotonically and never exceeds the cap while work is pending', () => {
      const bar = make({ maxDuration: 0 })
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
      expect(bar.getSnapshot().progress).toBeCloseTo(0.08)

      let previous = bar.getSnapshot().progress
      for (let i = 0; i < 200; i++) {
        vi.advanceTimersByTime(250)
        const { progress } = bar.getSnapshot()
        expect(progress).toBeGreaterThanOrEqual(previous)
        expect(progress).toBeLessThanOrEqual(0.95)
        previous = progress
      }
      expect(previous).toBeGreaterThan(0.9)
      expect(bar.getSnapshot().visible).toBe(true)
    })

    it('slows down as it approaches the cap (shrinking steps)', () => {
      const bar = make({ maxDuration: 0 })
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
      const steps: number[] = []
      let previous = bar.getSnapshot().progress
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(250)
        const { progress } = bar.getSnapshot()
        steps.push(progress - previous)
        previous = progress
      }
      for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeLessThan(steps[i - 1])
    })

    it('respects custom maxProgress and trickleInterval', () => {
      const bar = make({ maxProgress: 0.5, trickleInterval: 100, maxDuration: 0 })
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY + 100)
      expect(bar.getSnapshot().progress).toBeGreaterThan(0.08)
      vi.advanceTimersByTime(60_000)
      expect(bar.getSnapshot().progress).toBeLessThanOrEqual(0.5)
    })

    it('stays within bounds for extreme random values', () => {
      for (const value of [0, 1]) {
        const bar = make({ random: () => value, maxDuration: 0 })
        bar.start('a')
        vi.advanceTimersByTime(SHOW_DELAY + 60_000)
        const { progress } = bar.getSnapshot()
        expect(progress).toBeGreaterThan(0)
        expect(progress).toBeLessThanOrEqual(0.95)
        bar.reset()
      }
    })
  })

  describe('completion', () => {
    it('completes to 100%, fades out and rewinds after done', () => {
      const bar = make()
      startAndSettle(bar)
      bar.done('a')
      expect(bar.getSnapshot()).toEqual({ visible: true, progress: 1 })
      vi.advanceTimersByTime(COMPLETE)
      expect(bar.getSnapshot()).toEqual({ visible: false, progress: 1 })
      vi.advanceTimersByTime(FADE)
      expect(bar.getSnapshot()).toEqual(IDLE)
    })

    it('honours custom completeDuration and fadeDuration', () => {
      const bar = make({ completeDuration: 50, fadeDuration: 70 })
      startAndSettle(bar)
      bar.done('a')
      vi.advanceTimersByTime(50)
      expect(bar.getSnapshot()).toEqual({ visible: false, progress: 1 })
      vi.advanceTimersByTime(70)
      expect(bar.getSnapshot()).toEqual(IDLE)
    })

    it('keeps the bar visible for the minimum visible time', () => {
      const bar = make()
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY + 50)
      bar.done('a')
      expect(bar.getSnapshot().progress).toBeLessThan(1)
      expect(bar.getSnapshot().visible).toBe(true)
      vi.advanceTimersByTime(MIN_VISIBLE - 50)
      expect(bar.getSnapshot().progress).toBe(1)
    })

    it('does not trickle while waiting for the minimum visible time', () => {
      const bar = make()
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
      bar.done('a')
      const waiting = bar.getSnapshot().progress
      vi.advanceTimersByTime(MIN_VISIBLE - 1)
      expect(bar.getSnapshot().progress).toBe(waiting)
    })

    it('can run many full cycles in a row on one controller', () => {
      const bar = make()
      for (let i = 0; i < 5; i++) {
        bar.start(`k${i}`)
        vi.advanceTimersByTime(SHOW_DELAY)
        expect(bar.getSnapshot().visible).toBe(true)
        vi.advanceTimersByTime(MIN_VISIBLE)
        bar.done(`k${i}`)
        vi.advanceTimersByTime(COMPLETE + FADE)
        expect(bar.getSnapshot()).toEqual(IDLE)
      }
    })

    it('leaves no timers behind once idle', () => {
      const bar = make()
      startAndSettle(bar)
      bar.done('a')
      vi.advanceTimersByTime(COMPLETE + FADE)
      expect(vi.getTimerCount()).toBe(0)
    })
  })

  describe('reference counting', () => {
    it('completes only after the last of several concurrent tasks', () => {
      const bar = make()
      bar.start('a')
      bar.start('b')
      bar.start('c')
      vi.advanceTimersByTime(SHOW_DELAY + MIN_VISIBLE)
      bar.done('a')
      bar.done('c')
      vi.advanceTimersByTime(2000)
      expect(bar.getSnapshot().visible).toBe(true)
      expect(bar.getSnapshot().progress).toBeLessThan(1)
      bar.done('b')
      expect(bar.getSnapshot().progress).toBe(1)
    })

    it('treats a duplicate key as a single unit of work', () => {
      const bar = make()
      bar.start('a')
      bar.start('a')
      bar.done('a')
      vi.advanceTimersByTime(5000)
      expect(bar.getSnapshot()).toEqual(IDLE)
    })

    it('ignores done for unknown keys and done when idle', () => {
      const bar = make()
      expect(() => bar.done()).not.toThrow()
      expect(() => bar.done('nope')).not.toThrow()
      bar.start('a')
      bar.done('nope')
      vi.advanceTimersByTime(SHOW_DELAY)
      expect(bar.getSnapshot().visible).toBe(true)
    })

    it('ignores a second done for the same key', () => {
      const bar = make()
      bar.start('a')
      bar.start('b')
      vi.advanceTimersByTime(SHOW_DELAY + MIN_VISIBLE)
      bar.done('a')
      bar.done('a')
      expect(bar.getSnapshot().progress).toBeLessThan(1)
    })

    it('generates unique keys for anonymous start and finishes the latest on done()', () => {
      const bar = make()
      const first = bar.start()
      const second = bar.start()
      expect(first).not.toBe(second)
      vi.advanceTimersByTime(SHOW_DELAY + MIN_VISIBLE)
      bar.done()
      expect(bar.getSnapshot().progress).toBeLessThan(1)
      bar.done()
      expect(bar.getSnapshot().progress).toBe(1)
    })

    it('returns the key it was given', () => {
      expect(make().start('my-key')).toBe('my-key')
    })
  })

  describe('restarting', () => {
    it('restarts from the beginning when work arrives while completing', () => {
      const bar = make()
      startAndSettle(bar)
      bar.done('a')
      expect(bar.getSnapshot().progress).toBe(1)
      bar.start('b')
      expect(bar.getSnapshot()).toEqual({ visible: true, progress: 0.08 })
      vi.advanceTimersByTime(5000)
      expect(bar.getSnapshot().visible).toBe(true)
      expect(bar.getSnapshot().progress).toBeLessThan(1)
    })

    it('restarts when work arrives while fading out', () => {
      const bar = make()
      startAndSettle(bar)
      bar.done('a')
      vi.advanceTimersByTime(COMPLETE)
      expect(bar.getSnapshot()).toEqual({ visible: false, progress: 1 })
      bar.start('b')
      expect(bar.getSnapshot()).toEqual({ visible: true, progress: 0.08 })
    })

    it('resumes trickling when work arrives during the minimum visible wait', () => {
      const bar = make({ maxDuration: 0 })
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
      bar.done('a')
      bar.start('b')
      vi.advanceTimersByTime(MIN_VISIBLE + 5000)
      const { visible, progress } = bar.getSnapshot()
      expect(visible).toBe(true)
      expect(progress).toBeGreaterThan(0.08)
      expect(progress).toBeLessThan(1)
    })

    it('applies the show delay again after the previous cycle is fully idle', () => {
      const bar = make()
      startAndSettle(bar)
      bar.done('a')
      vi.advanceTimersByTime(COMPLETE + FADE)
      bar.start('b')
      expect(bar.getSnapshot()).toEqual(IDLE)
      vi.advanceTimersByTime(SHOW_DELAY - 1)
      expect(bar.getSnapshot().visible).toBe(false)
      vi.advanceTimersByTime(1)
      expect(bar.getSnapshot().visible).toBe(true)
    })
  })

  describe('maxDuration safety net', () => {
    it('force-completes work that never calls done', () => {
      const bar = make({ minVisibleTime: 0, maxDuration: 1000 })
      bar.start('stuck')
      vi.advanceTimersByTime(1000)
      expect(bar.getSnapshot().progress).toBe(1)
      vi.advanceTimersByTime(COMPLETE + FADE)
      expect(bar.getSnapshot()).toEqual(IDLE)
    })

    it('accepts new work after a forced completion', () => {
      const bar = make({ minVisibleTime: 0, maxDuration: 1000 })
      bar.start('stuck')
      vi.advanceTimersByTime(1000 + COMPLETE + FADE)
      bar.start('next')
      vi.advanceTimersByTime(SHOW_DELAY)
      expect(bar.getSnapshot().visible).toBe(true)
    })

    it('does not fire after the work finished normally', () => {
      const bar = make({ maxDuration: 1000 })
      startAndSettle(bar)
      bar.done('a')
      vi.advanceTimersByTime(COMPLETE + FADE)
      const listener = vi.fn()
      bar.subscribe(listener)
      vi.advanceTimersByTime(10_000)
      expect(listener).not.toHaveBeenCalled()
    })

    it('is disabled with 0', () => {
      const bar = make({ maxDuration: 0 })
      bar.start('a')
      vi.advanceTimersByTime(10 * 60_000)
      expect(bar.getSnapshot().visible).toBe(true)
      expect(bar.getSnapshot().progress).toBeLessThan(1)
    })

    it('defaults to 30 seconds', () => {
      const bar = createLoadingBarController({ minVisibleTime: 0 })
      bar.start('a')
      vi.advanceTimersByTime(29_999)
      expect(bar.getSnapshot().progress).toBeLessThan(1)
      vi.advanceTimersByTime(1)
      expect(bar.getSnapshot().progress).toBe(1)
    })
  })

  describe('reset', () => {
    it('completes a visible bar immediately and forgets active work', () => {
      const bar = make()
      bar.start('a')
      bar.start('b')
      vi.advanceTimersByTime(SHOW_DELAY + MIN_VISIBLE)
      bar.reset()
      expect(bar.getSnapshot().progress).toBe(1)
      bar.done('a')
      bar.done('b')
      vi.advanceTimersByTime(COMPLETE + FADE)
      expect(bar.getSnapshot()).toEqual(IDLE)
    })

    it('cancels a pending show', () => {
      const bar = make()
      bar.start('a')
      bar.reset()
      vi.advanceTimersByTime(5000)
      expect(bar.getSnapshot()).toEqual(IDLE)
    })

    it('is a no-op when idle', () => {
      const bar = make()
      expect(() => bar.reset()).not.toThrow()
      expect(bar.getSnapshot()).toEqual(IDLE)
    })
  })

  describe('subscriptions', () => {
    it('notifies subscribers on change and supports unsubscribing', () => {
      const bar = make()
      const listener = vi.fn()
      const unsubscribe = bar.subscribe(listener)
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
      expect(listener).toHaveBeenCalled()
      unsubscribe()
      listener.mockClear()
      vi.advanceTimersByTime(1000)
      expect(listener).not.toHaveBeenCalled()
    })

    it('notifies every subscriber and ignores duplicate unsubscribe', () => {
      const bar = make()
      const a = vi.fn()
      const b = vi.fn()
      const offA = bar.subscribe(a)
      bar.subscribe(b)
      bar.start('x')
      vi.advanceTimersByTime(SHOW_DELAY)
      expect(a).toHaveBeenCalled()
      expect(b).toHaveBeenCalled()
      offA()
      expect(() => offA()).not.toThrow()
    })

    it('returns a stable snapshot reference between changes', () => {
      const bar = make()
      expect(bar.getSnapshot()).toBe(bar.getSnapshot())
      bar.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
      expect(bar.getSnapshot()).toBe(bar.getSnapshot())
    })
  })

  describe('isolation', () => {
    it('keeps controllers independent of each other and of the shared instance', () => {
      const one = make()
      const two = make()
      one.start('a')
      vi.advanceTimersByTime(SHOW_DELAY)
      expect(one.getSnapshot().visible).toBe(true)
      expect(two.getSnapshot()).toEqual(IDLE)
      expect(loadingBar.getSnapshot()).toEqual(IDLE)
    })
  })
})
