import { forwardRef, useEffect, useRef } from 'react'

import { DiffFile, DiffView, SplitSide } from '@git-diff-view/react'

import './extended-diff-view-style.css'

import { ExtendedDiffViewProps, LinesRange } from './extended-diff-view-types'
import {
  getLineFromEl,
  getNumberHolder,
  getPreselectState,
  getSide,
  orderRange,
  updateSelection
} from './extended-diff-view-utils'

/**
 * ExtendedDiffView is a extended/patched version of DiffView.
 * In the ExtendedDiffView we have ability to select multiple lines when adding comments
 **/
export const ExtendedDiffView = forwardRef(
  <T,>(
    props: ExtendedDiffViewProps<T>,
    ref: React.ForwardedRef<{
      getDiffFileInstance: () => DiffFile
    }>
  ) => {
    const { extendData, renderWidgetLine, diffViewAddWidget, scopeMultilineSelectionToOneHunk } = props

    const enableMultiSelect = !!diffViewAddWidget

    const containerRef = useRef<HTMLDivElement>(null)

    // user selected
    const selectedRangeRef = useRef<LinesRange | null>(null)

    // is user selection is in progress
    const isSelectingRef = useRef(false)

    // selection for the existing comments
    const preselectedLinesRef = useRef<{ old: number[]; new: number[] }>({ old: [], new: [] })

    // handle existing comments selection
    useEffect(() => {
      preselectedLinesRef.current = getPreselectState(extendData)
      updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current)
    }, [extendData])

    // handle user selection
    useEffect(() => {
      if (!enableMultiSelect) return

      const container = containerRef.current
      if (!container) return

      const handleMouseDown = (e: MouseEvent) => {
        const numberHolder = getNumberHolder(e.target as HTMLElement, true)
        if (!numberHolder) return

        const line = getLineFromEl(numberHolder)
        if (!line) return

        isSelectingRef.current = true

        selectedRangeRef.current = {
          start: line,
          end: line,
          side: getSide(numberHolder) ?? 'new'
        }

        updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current)
      }

      const handleMouseOver = (e: MouseEvent) => {
        if (!isSelectingRef.current) return

        const numberHolder = getNumberHolder(e.target as HTMLElement)
        if (!numberHolder) return

        const line = getLineFromEl(numberHolder)
        if (!line) return

        if (line !== null && selectedRangeRef.current) {
          selectedRangeRef.current = scopeMultilineSelectionToOneHunk
            ? scopeMultilineSelectionToOneHunk({ ...selectedRangeRef.current, end: line })
            : { ...selectedRangeRef.current, end: line }
          updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current)
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
    }, [isSelectingRef, selectedRangeRef, enableMultiSelect])

    return (
      <div ref={containerRef}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <DiffView
          {...props}
          ref={ref}
          onAddWidgetClick={(lineNumber: number, side: SplitSide) => {
            const oldNewSide = side === SplitSide.old ? 'old' : 'new'

            // NOTE: this covers use case when user click on [+]
            if (
              !selectedRangeRef.current ||
              lineNumber !== selectedRangeRef.current?.end ||
              oldNewSide !== selectedRangeRef.current?.side
            ) {
              selectedRangeRef.current = {
                start: lineNumber,
                end: lineNumber,
                side: oldNewSide
              }
              updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current)
            }

            props.onAddWidgetClick?.(lineNumber, side)
          }}
          renderWidgetLine={
            renderWidgetLine
              ? props => {
                  return renderWidgetLine({
                    ...props,
                    onClose: () => {
                      selectedRangeRef.current = null
                      updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current)
                      props.onClose()
                    },
                    lineFromNumber: selectedRangeRef.current?.start ?? props.lineNumber
                  })
                }
              : undefined
          }
        />
      </div>
    )
  }
)

ExtendedDiffView.displayName = 'ExtendedDiffView'
