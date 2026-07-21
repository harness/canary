import { describe, expect, it } from 'vitest'

import { getViewportShift, VIEWPORT_PADDING } from '../clamp-dropdown-position'

const VW = 1000
const VH = 800

describe('getViewportShift', () => {
  it('returns no shift when the dropdown is fully inside the viewport', () => {
    const rect = { top: 300, left: 400, right: 608, bottom: 508 }
    expect(getViewportShift(rect, VW, VH)).toEqual({ dx: 0, dy: 0 })
  })

  it('shifts left when the dropdown overflows the right edge', () => {
    const rect = { top: 300, left: 900, right: 1108, bottom: 508 }
    const { dx, dy } = getViewportShift(rect, VW, VH)
    expect(dx).toBe(-(1108 - (VW - VIEWPORT_PADDING)))
    expect(rect.right + dx).toBe(VW - VIEWPORT_PADDING)
    expect(dy).toBe(0)
  })

  it('shifts up when the dropdown overflows the bottom edge', () => {
    const rect = { top: 700, left: 400, right: 608, bottom: 908 }
    const { dx, dy } = getViewportShift(rect, VW, VH)
    expect(dy).toBe(-(908 - (VH - VIEWPORT_PADDING)))
    expect(rect.bottom + dy).toBe(VH - VIEWPORT_PADDING)
    expect(dx).toBe(0)
  })

  it('shifts on both axes when overflowing the bottom-right corner', () => {
    const rect = { top: 700, left: 900, right: 1108, bottom: 908 }
    const { dx, dy } = getViewportShift(rect, VW, VH)
    expect(rect.right + dx).toBe(VW - VIEWPORT_PADDING)
    expect(rect.bottom + dy).toBe(VH - VIEWPORT_PADDING)
  })

  it('clamps to the top-left padding rather than pushing off the opposite edge on a tiny viewport', () => {
    const rect = { top: 40, left: 40, right: 248, bottom: 248 }
    const { dx, dy } = getViewportShift(rect, 120, 120)
    expect(rect.left + dx).toBe(VIEWPORT_PADDING)
    expect(rect.top + dy).toBe(VIEWPORT_PADDING)
  })

  it('does not move a dropdown already at the padding origin', () => {
    const rect = { top: VIEWPORT_PADDING, left: VIEWPORT_PADDING, right: 216, bottom: 216 }
    expect(getViewportShift(rect, VW, VH)).toEqual({ dx: 0, dy: 0 })
  })
})
