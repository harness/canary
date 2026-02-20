import { forwardRef, useEffect, useRef } from 'react'

import { DiffFile, DiffModeEnum, DiffView, SplitSide } from '@git-diff-view/react'

import './extended-diff-view-style.css'

import { ExtendedDiffViewProps, LinesRange } from './extended-diff-view-types'
import useMultiSelectForSplit from './hooks/useMultiSelectSplit'
import useMultiSelectForUnified from './hooks/useMultiSelectUnified'
import { getPreselectState, updateSelection } from './utils/extended-diff-view-common-utils'

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
    const {
      extendData,
      renderWidgetLine,
      diffViewAddWidget,
      scopeMultilineSelectionToOneHunk,
      scopeMultilineSelectionToOneBlockAndOneSide,
      diffViewMode
    } = props

    const diffViewModeRef = useRef(diffViewMode)
    diffViewModeRef.current = diffViewMode

    const enableMultiSelect = !!diffViewAddWidget

    const containerRef = useRef<HTMLDivElement>(null)

    // is user selection is in progress
    const isSelectingRef = useRef(false)

    // user selected
    const selectedRangeRef = useRef<LinesRange | null>(null)

    // selection for the existing comments
    const preselectedLinesRef = useRef<{ old: number[]; new: number[] }>({ old: [], new: [] })

    // handle existing comments selection
    useEffect(() => {
      preselectedLinesRef.current = getPreselectState(extendData)
      updateSelection(containerRef.current, selectedRangeRef.current, preselectedLinesRef.current, diffViewMode)
    }, [diffViewMode, extendData])

    useMultiSelectForSplit({
      containerRef,
      isSelectingRef,
      selectedRangeRef,
      preselectedLinesRef,
      enableMultiSelect: enableMultiSelect && diffViewMode === DiffModeEnum.Split,
      scopeMultilineSelectionToOneHunk
    })

    useMultiSelectForUnified({
      containerRef,
      isSelectingRef,
      selectedRangeRef,
      preselectedLinesRef,
      enableMultiSelect: enableMultiSelect && diffViewMode === DiffModeEnum.Unified,
      scopeMultilineSelectionToOneBlockAndOneSide
    })

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
              updateSelection(
                containerRef.current,
                selectedRangeRef.current,
                preselectedLinesRef.current,
                diffViewModeRef.current
              )
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
                      updateSelection(
                        containerRef.current,
                        selectedRangeRef.current,
                        preselectedLinesRef.current,
                        diffViewModeRef.current
                      )
                      props.onClose()
                    },
                    lineFromNumber: selectedRangeRef.current?.start ?? props.lineNumber,
                    lineFromSide: selectedRangeRef.current?.startSide,
                    lineSide: selectedRangeRef.current?.endSide
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
