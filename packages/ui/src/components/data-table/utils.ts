import { CSSProperties } from 'react'

import { Column } from '@tanstack/react-table'

export const getCommonPinningStyles = <T>(column: Column<T>): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column?.getIsLastColumn?.('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column?.getIsFirstColumn?.('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px var(--cn-chrome-200) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px var(--cn-chrome-200) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0
  }
}
