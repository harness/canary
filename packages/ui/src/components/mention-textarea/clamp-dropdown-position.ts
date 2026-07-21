export const VIEWPORT_PADDING = 8

interface Rect {
  top: number
  left: number
  right: number
  bottom: number
}

/**
 * Computes how far the mention dropdown must move to stay inside the visible page
 * box (the viewport, excluding scrollbars). The dropdown keeps its natural size and
 * caret-anchored position; only when an edge would overflow this fixed boundary do we
 * return a non-zero shift (dropdown slides left/up so the suggestions stay fully
 * visible), mirroring the editor "@" mention behaviour.
 */
export const getViewportShift = (
  rect: Rect,
  viewportWidth: number = typeof document === 'undefined' ? 0 : document.documentElement.clientWidth,
  viewportHeight: number = typeof document === 'undefined' ? 0 : document.documentElement.clientHeight,
  padding: number = VIEWPORT_PADDING
): { dx: number; dy: number } => {
  let dx = 0
  let dy = 0

  const overflowRight = rect.right - (viewportWidth - padding)
  if (overflowRight > 0) dx = -overflowRight
  if (rect.left + dx < padding) dx = padding - rect.left

  const overflowBottom = rect.bottom - (viewportHeight - padding)
  if (overflowBottom > 0) dy = -overflowBottom
  if (rect.top + dy < padding) dy = padding - rect.top

  return { dx, dy }
}
