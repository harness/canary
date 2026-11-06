/**
 * Capturable mocks for the browser observer APIs the editor components rely on.
 *
 * jsdom ships no ResizeObserver/MutationObserver/IntersectionObserver, and the
 * real ones are driven by layout/scroll that jsdom never produces. These fakes
 * record every instance so a test can fire the callback on demand and assert
 * the resulting behaviour (lazy render, line-number offset, …).
 */

interface MutationEntry {
  callback: MutationCallback
  targets: Node[]
}

interface IntersectionEntry {
  callback: IntersectionObserverCallback
  observer: IntersectionObserver
  targets: Element[]
}

export const mutationObservers: MutationEntry[] = []
export const intersectionObservers: IntersectionEntry[] = []

export function resetObservers(): void {
  mutationObservers.length = 0
  intersectionObservers.length = 0
}

/** Run the callbacks of every MutationObserver that is watching something. */
export function flushMutations(): void {
  mutationObservers.forEach(entry => entry.callback([], {} as MutationObserver))
}

/** Report the observed element(s) as intersecting, firing each matching observer once. */
export function triggerIntersection(isIntersecting = true): void {
  intersectionObservers.forEach(entry => {
    entry.targets.forEach(target => {
      entry.callback([{ isIntersecting, target } as IntersectionObserverEntry], entry.observer)
    })
  })
}

export function installObserverMocks(): void {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.MutationObserver = class {
    private entry: MutationEntry
    constructor(callback: MutationCallback) {
      this.entry = { callback, targets: [] }
      mutationObservers.push(this.entry)
    }
    observe(target: Node) {
      this.entry.targets.push(target)
    }
    disconnect() {
      this.entry.targets.length = 0
    }
    takeRecords() {
      return []
    }
  } as unknown as typeof MutationObserver

  global.IntersectionObserver = class {
    private entry: IntersectionEntry
    constructor(callback: IntersectionObserverCallback) {
      this.entry = { callback, observer: this as unknown as IntersectionObserver, targets: [] }
      intersectionObservers.push(this.entry)
    }
    observe(target: Element) {
      this.entry.targets.push(target)
    }
    unobserve() {}
    disconnect() {
      this.entry.targets.length = 0
    }
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
}
