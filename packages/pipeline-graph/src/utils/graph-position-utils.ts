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
