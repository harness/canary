/**
 * Top level containers are shifted vertically with `position: relative; top: -Npx` to align their
 * ports. Relative offsets move an element visually but leave the layout box of the flex container
 * untouched, so `nodesContainer.getBoundingClientRect()` does not describe what is actually painted.
 * The union of the children rects does, since `getBoundingClientRect` accounts for relative offsets.
 */
export function getGraphContentRect(nodesContainer: HTMLElement): DOMRect {
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity

  Array.from(nodesContainer.children).forEach(child => {
    const rect = child.getBoundingClientRect()

    // skip nodes that are not rendered (e.g. mid collapse animation)
    if (!rect.width && !rect.height) return

    left = Math.min(left, rect.left)
    top = Math.min(top, rect.top)
    right = Math.max(right, rect.right)
    bottom = Math.max(bottom, rect.bottom)
  })

  if (left === Infinity) return nodesContainer.getBoundingClientRect()

  return new DOMRect(left, top, right - left, bottom - top)
}

// TODO: temporary we pick "top" adjustment from DOM
export function getNegativeTopAdjustment(container: HTMLDivElement | null): number {
  if (!container) return 0

  let minMarginTop = Infinity

  Array.from(container.children).forEach(child => {
    if (!(child instanceof HTMLElement)) return 0

    const style = getComputedStyle(child)
    const marginTop = parseFloat(style.top)

    if (!Number.isNaN(marginTop)) {
      minMarginTop = Math.min(minMarginTop, marginTop)
    }
  })

  return minMarginTop === Infinity ? 0 : minMarginTop
}
