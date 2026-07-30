import { CSSProperties } from 'react'

import { Column } from '@tanstack/react-table'

/**
 * Vertical stickiness of a cell, on the same `position: sticky` mechanism as
 * column pinning, applied to the block axis.
 *
 * The `edge` union is intentionally shaped so a future `'bottom'` value
 * (e.g. bottom-pinned rows) widens the type without changing existing call sites.
 */
export interface StickyCellVertical {
  edge: 'top'
  offset: number | string
}

export interface GetStickyCellStylesOptions<T> {
  column: Column<T>
  /**
   * When provided, the cell sticks to the given block-axis edge.
   * Currently only used for sticky header cells.
   */
  vertical?: StickyCellVertical
}

/**
 * Z-index layering is a rule, not a lookup table:
 *   zIndex = verticalLayer + horizontalLayer
 *   vertical   — normal cell: 0, header cell: 4
 *   horizontal — unpinned column: 0, pinned column: 1
 * Invariants: the header always paints above body cells, and a pinned column
 * always paints above its unpinned neighbours within the same band.
 * (Bottom-pinned body rows add a row layer — 2 — when they land.)
 */
const HEADER_VERTICAL_LAYER = 4

const toCssOffset = (offset: number | string): string => (typeof offset === 'number' ? `${offset}px` : offset)

export const getStickyCellStyles = <T>({ column, vertical }: GetStickyCellStylesOptions<T>): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column?.getIsLastColumn?.('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column?.getIsFirstColumn?.('right')

  const horizontalLayer = isPinned ? 1 : 0
  const verticalLayer = vertical ? HEADER_VERTICAL_LAYER : 0

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px var(--cn-chrome-200) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--cn-chrome-200) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    top: vertical?.edge === 'top' ? toCssOffset(vertical.offset) : undefined,
    position: isPinned || vertical ? 'sticky' : 'relative',
    zIndex: verticalLayer + horizontalLayer
  }
}

/**
 * @deprecated Use {@link getStickyCellStyles} with `{ column }` instead.
 * Kept as a re-export so existing callers behave identically.
 */
export const getCommonPinningStyles = <T>(column: Column<T>): CSSProperties => getStickyCellStyles({ column })
