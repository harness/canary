/**
 * Framework-agnostic controller for the top-of-page loading bar.
 *
 * The backend never tells us how far along a request is, so progress is *simulated*:
 * it starts at a small value, "trickles" towards (but never reaches) `maxProgress`
 * with ever smaller steps, and only jumps to 100% when the work really finishes.
 *
 * Multiple sources (route navigation, several API calls, ...) share a single bar through
 * keyed reference counting: the bar completes only after every `start` has a matching `done`.
 */

export interface LoadingBarState {
  /** Whether the bar is shown (opacity 1). */
  visible: boolean
  /** Simulated progress in the range 0..1. */
  progress: number
}

export interface LoadingBarOptions {
  /** Delay (ms) before the bar appears, so very fast work never flashes the bar. Default 120. */
  showDelay?: number
  /** Minimum time (ms) the bar stays visible once shown. Default 300. */
  minVisibleTime?: number
  /** Interval (ms) between trickle steps. Default 250. */
  trickleInterval?: number
  /** Progress shown right after the bar appears (0..1). Default 0.08. */
  initialProgress?: number
  /** Trickling never goes past this value (0..1). Default 0.95. */
  maxProgress?: number
  /** Time (ms) given to the fill to animate to 100% before fading out. Default 200. */
  completeDuration?: number
  /** Time (ms) of the fade-out. Default 200. */
  fadeDuration?: number
  /** Safety net: force-complete if work is still "active" after this many ms. 0 disables it. Default 30000. */
  maxDuration?: number
  /** Random source, injectable for deterministic tests. Default `Math.random`. */
  random?: () => number
}

export interface LoadingBarController {
  /**
   * Registers a unit of work. Returns the key to pass to `done`.
   * Starting with a key that is already active is a no-op (idempotent).
   */
  start: (key?: string) => string
  /** Marks a unit of work as finished. Without a key the most recently started one is finished. No-op if unknown. */
  done: (key?: string) => void
  /** Immediately completes the bar regardless of active work. */
  reset: () => void
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => LoadingBarState
}

const IDLE_STATE: LoadingBarState = Object.freeze({ visible: false, progress: 0 })

export function createLoadingBarController(options: LoadingBarOptions = {}): LoadingBarController {
  const {
    showDelay = 120,
    minVisibleTime = 300,
    trickleInterval = 250,
    initialProgress = 0.08,
    maxProgress = 0.95,
    completeDuration = 200,
    fadeDuration = 200,
    maxDuration = 30000,
    random = Math.random
  } = options

  let state: LoadingBarState = IDLE_STATE
  const listeners = new Set<() => void>()
  // Insertion ordered, so the last element is the most recently started piece of work.
  const activeKeys = new Set<string>()
  let anonymousCounter = 0

  let shownAt = 0
  let showTimer: ReturnType<typeof setTimeout> | undefined
  let trickleTimer: ReturnType<typeof setInterval> | undefined
  let maxDurationTimer: ReturnType<typeof setTimeout> | undefined
  let finishTimers: Array<ReturnType<typeof setTimeout>> = []

  const setState = (next: LoadingBarState) => {
    if (next.visible === state.visible && next.progress === state.progress) return
    state = next
    listeners.forEach(listener => listener())
  }

  const clearShowTimer = () => {
    if (showTimer !== undefined) clearTimeout(showTimer)
    showTimer = undefined
  }
  const clearTrickle = () => {
    if (trickleTimer !== undefined) clearInterval(trickleTimer)
    trickleTimer = undefined
  }
  const clearMaxDuration = () => {
    if (maxDurationTimer !== undefined) clearTimeout(maxDurationTimer)
    maxDurationTimer = undefined
  }
  const clearFinishTimers = () => {
    finishTimers.forEach(clearTimeout)
    finishTimers = []
  }
  // Timers remove themselves once fired, so `finishTimers.length > 0` really means "still finishing".
  const scheduleFinishStep = (fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      finishTimers = finishTimers.filter(t => t !== timer)
      fn()
    }, ms)
    finishTimers.push(timer)
  }

  const trickle = () => {
    if (!state.visible || state.progress >= maxProgress) return
    // Shrinking steps: a fraction (3%-10%) of the distance that is left, so it slows down near the cap.
    const step = (maxProgress - state.progress) * (0.03 + random() * 0.07)
    setState({ visible: true, progress: Math.min(maxProgress, state.progress + step) })
  }

  const startTrickle = () => {
    clearTrickle()
    trickleTimer = setInterval(trickle, trickleInterval)
  }

  const show = () => {
    showTimer = undefined
    shownAt = Date.now()
    setState({ visible: true, progress: initialProgress })
    startTrickle()
  }

  const finish = () => {
    clearTrickle()
    clearMaxDuration()
    clearFinishTimers()
    setState({ visible: true, progress: 1 })
    scheduleFinishStep(() => {
      setState({ visible: false, progress: 1 })
      // Rewind only once fully faded out, so the fill never visibly runs backwards.
      scheduleFinishStep(() => setState(IDLE_STATE), fadeDuration)
    }, completeDuration)
  }

  const complete = () => {
    clearShowTimer()
    if (!state.visible) {
      // Never became visible (or is already fading out): nothing to complete.
      clearTrickle()
      clearMaxDuration()
      return
    }
    const remainingVisibleTime = Math.max(0, shownAt + minVisibleTime - Date.now())
    if (remainingVisibleTime === 0) {
      finish()
    } else {
      clearTrickle()
      clearFinishTimers()
      scheduleFinishStep(finish, remainingVisibleTime)
    }
  }

  const start: LoadingBarController['start'] = key => {
    const id = key ?? `__anonymous_${++anonymousCounter}`
    if (activeKeys.has(id)) return id

    const wasIdle = activeKeys.size === 0
    activeKeys.add(id)
    if (!wasIdle) return id

    // First piece of work: (re)start the bar.
    if (maxDuration > 0) {
      clearMaxDuration()
      maxDurationTimer = setTimeout(() => {
        activeKeys.clear()
        complete()
      }, maxDuration)
    }

    if (finishTimers.length > 0) {
      // New work arrived while waiting for the minimum visible time, or while finishing/fading out.
      clearFinishTimers()
      if (state.progress >= 1) {
        // Already completed: restart from the beginning.
        shownAt = Date.now()
        setState({ visible: true, progress: initialProgress })
      }
      // Otherwise just resume trickling from the current progress.
      startTrickle()
    } else if (!state.visible) {
      clearShowTimer()
      showTimer = setTimeout(show, showDelay)
    }
    return id
  }

  const done: LoadingBarController['done'] = key => {
    if (activeKeys.size === 0) return
    const id = key ?? Array.from(activeKeys).pop()
    if (id === undefined || !activeKeys.delete(id)) return
    if (activeKeys.size === 0) complete()
  }

  const reset: LoadingBarController['reset'] = () => {
    activeKeys.clear()
    complete()
  }

  return {
    start,
    done,
    reset,
    subscribe: listener => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => state
  }
}

/** Shared application-wide instance. */
export const loadingBar: LoadingBarController = createLoadingBarController()
