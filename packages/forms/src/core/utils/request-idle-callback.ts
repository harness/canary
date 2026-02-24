/**
 * Polyfill for requestIdleCallback and cancelIdleCallback
 * Returns polyfilled functions that use native implementation when available,
 * otherwise falls back to setTimeout
 */

export interface IdleDeadline {
  readonly didTimeout: boolean
  timeRemaining(): number
}

export interface IdleRequestOptions {
  timeout?: number
}

export type IdleCallback = (deadline: IdleDeadline) => void

/**
 * Returns a requestIdleCallback function that uses native implementation when available,
 * otherwise falls back to setTimeout
 */
export function requestIdleCallbackPolyfill() {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback
  }

  // Fallback implementation - use setTimeout directly
  return function (cb: IdleCallback, options?: IdleRequestOptions): number {
    const start = Date.now()
    const timeout = options?.timeout || 1

    const timeoutId = setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start))
        }
      })
    }, timeout)

    // Handle both browser (number) and Node.js (Timeout) environments
    return timeoutId as unknown as number
  }
}

/**
 * Returns a cancelIdleCallback function that uses native implementation when available,
 * otherwise falls back to clearTimeout
 */
export function cancelIdleCallbackPolyfill() {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    return window.cancelIdleCallback
  }

  // Fallback implementation - use clearTimeout directly
  return clearTimeout
}
