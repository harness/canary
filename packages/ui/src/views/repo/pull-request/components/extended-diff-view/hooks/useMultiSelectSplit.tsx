import { MutableRefObject, useEffect } from 'react'

import { DiffModeEnum } from '@git-diff-view/react'

import { LinesRange } from '../extended-diff-view-types'
import { orderRange, updateSelection } from '../utils/extended-diff-view-common-utils'
import { getLineFromEl_Split, getNumberHolder_Split, getSide_Slit } from '../utils/extended-diff-view-split-utils'

export default function useMultiSelectForSplit({
  containerRef,
  isSelectingRef,
  selectedRangeRef,
  preselectedLinesRef,
  enableMultiSelect,
  scopeMultilineSelectionToOneHunk
}: {
  containerRef: MutableRefObject<HTMLDivElement | null>
  isSelectingRef: MutableRefObject<boolean>
  selectedRangeRef: MutableRefObject<LinesRange | null>
  preselectedLinesRef: MutableRefObject<{ old: number[]; new: number[] }>
  enableMultiSelect: boolean
  scopeMultilineSelectionToOneHunk?: (lineRange: LinesRange) => LinesRange
}) {
  // handle user selection
  useEffect(() => {
    if (!enableMultiSelect) return

    const container = containerRef.current
    if (!container) return

    const handleMouseDown = (e: MouseEvent) => {
      const numberHolder = getNumberHolder_Split(e.target as HTMLElement, true)
      if (!numberHolder) return

      const line = getLineFromEl_Split(numberHolder)
      if (!line) return

      isSelectingRef.current = true

      const lineRange = {
        start: line,
        end: line,
        side: getSide_Slit(numberHolder) ?? 'new'
      }

      // Note: we execute scopeMultilineSelectionToOneHunk in order to add get side for start and end line
      selectedRangeRef.current = scopeMultilineSelectionToOneHunk
        ? scopeMultilineSelectionToOneHunk(lineRange)
        : lineRange

      updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current)
    }

    const handleMouseOver = (e: MouseEvent) => {
      if (!isSelectingRef.current) return

      const numberHolder = getNumberHolder_Split(e.target as HTMLElement)
      if (!numberHolder) return

      const line = getLineFromEl_Split(numberHolder)
      if (!line) return

      if (line !== null && selectedRangeRef.current) {
        selectedRangeRef.current = scopeMultilineSelectionToOneHunk
          ? scopeMultilineSelectionToOneHunk({ ...selectedRangeRef.current, end: line })
          : { ...selectedRangeRef.current, end: line }
        updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current, DiffModeEnum.Split)
      }
    }

    const handleDocumentMouseUp = () => {
      if (!selectedRangeRef.current) return

      isSelectingRef.current = false

      const newRange = orderRange(selectedRangeRef.current)
      selectedRangeRef.current = newRange

      const lineNumEl = containerRef.current?.querySelector(
        `tr td[data-side='${selectedRangeRef.current?.side}'] [data-line-num='${selectedRangeRef.current?.end}']`
      ) as HTMLElement

      const addEll = lineNumEl?.parentElement?.querySelector('.diff-add-widget') as HTMLElement
      addEll?.click()
    }

    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseup', handleDocumentMouseUp)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseup', handleDocumentMouseUp)
    }
  }, [
    isSelectingRef,
    selectedRangeRef,
    enableMultiSelect,
    containerRef,
    preselectedLinesRef,
    scopeMultilineSelectionToOneHunk
  ])
}
