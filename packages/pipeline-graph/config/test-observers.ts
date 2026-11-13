/**
 * Capturable mock for the browser observer APIs the graph relies on.
 *
 * jsdom ships no ResizeObserver, and the real one is driven by layout that jsdom
 * never produces. This fake records every instance so a test can fire the callback
 * on demand and assert the resulting behaviour (edge redraw / SVG reveal on settle).
 *
 * Mirrors the shape of yaml-editor's `config/test-observers.ts`.
 */

interface ResizeEntry {
  callback: ResizeObserverCallback
  observer: ResizeObserver
  targets: Element[]
}

export const resizeObservers: ResizeEntry[] = []

export function resetObservers(): void {
  resizeObservers.length = 0
}

/** Report a resize on every observed element, firing each matching observer once. */
export function triggerResize(): void {
  resizeObservers.forEach(entry => {
    const entries = entry.targets.map(target => ({ target }) as ResizeObserverEntry)
    entry.callback(entries, entry.observer)
  })
}

export function installObserverMocks(): void {
  global.ResizeObserver = class {
    private entry: ResizeEntry
    constructor(callback: ResizeObserverCallback) {
      this.entry = { callback, observer: this as unknown as ResizeObserver, targets: [] }
      resizeObservers.push(this.entry)
    }
    observe(target: Element) {
      this.entry.targets.push(target)
    }
    unobserve() {}
    disconnect() {
      this.entry.targets.length = 0
    }
  } as unknown as typeof ResizeObserver
}
