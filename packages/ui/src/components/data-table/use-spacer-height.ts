import { useLayoutEffect, useState } from 'react'

/**
 * Computes the height of the spacer row that fills the gap between the last
 * body row and a bottom-pinned row when the table is shorter than its
 * scroll viewport.
 *
 * `contentHeight` must exclude the spacer row itself so the value is a stable
 * fixed point rather than a feedback loop.
 */
export const computeSpacerHeight = ({
  viewportClientHeight,
  contentHeight
}: {
  viewportClientHeight: number
  contentHeight: number
}): number => Math.max(0, viewportClientHeight - contentHeight)

interface UseSpacerHeightOptions {
  /**
   * The single scroll viewport (`cn-table-v2-viewport`) element.
   */
  viewportEl: HTMLElement | null
  /**
   * The spacer `<tr>` element at the end of the `<tbody>`. Its own height is
   * excluded from the measured content height (see {@link computeSpacerHeight}).
   */
  spacerRowEl: HTMLTableRowElement | null
  /**
   * Whether a bottom-pinned row is rendered. When false, no measurement runs
   * and the spacer height is 0.
   */
  enabled: boolean
}

/**
 * Measures the spacer row height for bottom-pinned tables via ResizeObserver.
 * Returns 0 until measured (and whenever measurement is disabled), so the
 * spacer starts collapsed and only opens when there is surplus viewport space.
 */
export function useSpacerHeight({ viewportEl, spacerRowEl, enabled }: UseSpacerHeightOptions): number {
  const [spacerHeight, setSpacerHeight] = useState(0)

  useLayoutEffect(() => {
    if (!enabled || !viewportEl || !spacerRowEl) {
      setSpacerHeight(0)
      return
    }

    const measure = () => {
      const table = spacerRowEl.closest('table')
      if (!table) return

      const theadHeight = table.querySelector('thead')?.getBoundingClientRect().height ?? 0
      const tfootHeight = table.querySelector('tfoot')?.getBoundingClientRect().height ?? 0
      const tbodyHeight = spacerRowEl.parentElement?.getBoundingClientRect().height ?? 0
      const spacerOwnHeight = spacerRowEl.getBoundingClientRect().height

      const contentHeight = theadHeight + tbodyHeight - spacerOwnHeight + tfootHeight

      const next = computeSpacerHeight({
        viewportClientHeight: viewportEl.clientHeight,
        contentHeight
      })

      setSpacerHeight(prev => (Math.abs(prev - next) < 0.5 ? prev : next))
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(viewportEl)
    const tbody = spacerRowEl.parentElement
    if (tbody) observer.observe(tbody)
    const tfoot = spacerRowEl.closest('table')?.querySelector('tfoot')
    if (tfoot) observer.observe(tfoot)

    return () => observer.disconnect()
  }, [enabled, viewportEl, spacerRowEl])

  return spacerHeight
}
