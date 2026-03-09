import { MutableRefObject, useEffect, useRef } from 'react'

import { DiffModeEnum } from '@git-diff-view/react'

import { LinesRange } from '../extended-diff-view-types'
import { orderRange, updateSelection } from '../utils/extended-diff-view-common-utils'
import { getLineNumber_Unified } from '../utils/extended-diff-view-unified-utils'

export default function useMultiselectForUnified({
  containerRef,
  isSelectingRef,
  selectedRangeRef,
  preselectedLinesRef,
  enableMultiSelect,
  scopeMultilineSelectionToOneBlockAndOneSide
}: {
  containerRef: MutableRefObject<HTMLDivElement | null>
  isSelectingRef: MutableRefObject<boolean>
  selectedRangeRef: MutableRefObject<LinesRange | null>
  preselectedLinesRef: MutableRefObject<{ old: number[]; new: number[] }>
  enableMultiSelect: boolean
  scopeMultilineSelectionToOneBlockAndOneSide?: (
    start: { old?: number; new?: number },
    end: { old?: number; new?: number }
  ) => LinesRange
}) {
  const startLineNumbersRef = useRef<{ old?: number; new?: number } | null>(null)

  // handle user selection
  useEffect(() => {
    if (!enableMultiSelect) return

    const container = containerRef.current
    if (!container) return

    const handleMouseDown = (e: MouseEvent) => {
      const lines = getLineNumber_Unified(e.target as HTMLElement)
      if (!lines) return

      isSelectingRef.current = true

      startLineNumbersRef.current = lines

      // Note: we are using the "new" side if exist or "old" one. This may be changed while user select more rows.
      // We keep both side line numbers in the startLineNumbersRef for this purpose
      if (lines.new || lines.old) {
        selectedRangeRef.current = {
          start: lines.new ?? lines.old ?? 1,
          end: lines.new ?? lines.old ?? 1,
          side: lines.new ? 'new' : 'old'
        }

        // Note: we execute scopeMultilineSelectionToOneBlockAndOneSide in order to add get side for start and end line
        const newRange = scopeMultilineSelectionToOneBlockAndOneSide?.(lines, lines)

        if (newRange) {
          selectedRangeRef.current = newRange
        }
      }

      updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current, DiffModeEnum.Unified)
    }

    const handleMouseOver = (e: MouseEvent) => {
      if (!isSelectingRef.current) return

      const lines = getLineNumber_Unified(e.target as HTMLElement)
      if (!lines) return

      const newRange = scopeMultilineSelectionToOneBlockAndOneSide?.(startLineNumbersRef.current!, lines)

      if (newRange) {
        selectedRangeRef.current = newRange
      }

      updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current, DiffModeEnum.Unified)
    }

    const handleDocumentMouseUp = () => {
      if (!selectedRangeRef.current) return

      isSelectingRef.current = false

      const newRange = orderRange(selectedRangeRef.current)
      selectedRangeRef.current = newRange

      const lineNumEl = containerRef.current?.querySelector(
        `tr td [data-line-${selectedRangeRef.current?.side}-num='${selectedRangeRef.current?.end}']`
      ) as HTMLElement

      const addEll = lineNumEl?.closest('tr')?.querySelector('.diff-add-widget') as HTMLElement
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
    scopeMultilineSelectionToOneBlockAndOneSide
  ])
}
