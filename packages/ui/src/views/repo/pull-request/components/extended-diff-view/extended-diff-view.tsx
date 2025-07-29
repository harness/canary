import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'

import { DiffFile, DiffView, DiffViewProps, SplitSide } from '@git-diff-view/react'
import { uniq } from 'lodash-es'

import './extended-diff-view-style.css'

import { LinesRange } from './extended-diff-view-types'
import { getLineFromEl, getSide, orderRange, populateLines } from './extended-diff-view-utils'

export interface ExtendedDiffViewProps<T> extends Omit<DiffViewProps<T>, 'extendData' | 'renderWidgetLine'> {
  extendData?: {
    oldFile?: Record<
      string,
      {
        data: T
        fromLine: number
      }
    >
    newFile?: Record<
      string,
      {
        data: T
        fromLine: number
      }
    >
  }
  renderWidgetLine:
    | (({
        diffFile,
        side,
        lineNumber,
        lineFromNumber,
        onClose
      }: {
        lineNumber: number
        lineFromNumber: number
        side: SplitSide
        diffFile: DiffFile
        onClose: () => void
      }) => React.ReactNode)
    | undefined
}

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
    const { extendData, renderWidgetLine, diffFile } = props

    const containerRef = useRef<HTMLDivElement>(null)

    // user selected
    const selectedRangeRef = useRef<LinesRange | null>(null)

    // is user selection is in progress
    const isSelectingRef = useRef(false)

    // selection for the existing comments
    const preselectedLines: { old: number[]; new: number[] } = useMemo(() => {
      if (!extendData) return { old: [], new: [] }

      const oldLines: number[] = populateLines(extendData.oldFile ?? {})
      const newLines: number[] = populateLines(extendData.newFile ?? {})

      return { old: uniq(oldLines), new: uniq(newLines) }
    }, [extendData])

    const preselectedLinesRef = useRef(preselectedLines)
    preselectedLinesRef.current = preselectedLines

    const updateSelection = useCallback(() => {
      if (!containerRef.current) return

      const allCells = containerRef.current?.querySelectorAll<HTMLElement>(`tr[data-line] > td[data-side]`)

      allCells.forEach(cell => {
        cell.classList.remove('ExtendedDiffView-RowCell-Selected')

        const sideAttr = cell.getAttribute('data-side') as 'old' | 'new'
        const lineAttr = cell.parentElement
          ?.querySelector('td[data-side="' + sideAttr + '"] span[data-line-num]')
          ?.getAttribute('data-line-num')

        const line = parseInt(lineAttr || '', 10)

        if (lineAttr !== line.toString()) return

        const range = selectedRangeRef.current ? orderRange(selectedRangeRef.current) : null
        const inUserSelected = range && line >= range.start && line <= range.end && range.side === sideAttr

        const inPreselected = preselectedLinesRef.current?.[sideAttr].indexOf(line) !== -1

        if (inUserSelected || inPreselected) {
          cell.classList.add('ExtendedDiffView-RowCell-Selected')
        }
      })
    }, [preselectedLines, selectedRangeRef])

    useEffect(() => {
      selectedRangeRef.current = null
      updateSelection()
    }, [diffFile])

    useEffect(() => {
      if (!containerRef.current) return
      if (
        !preselectedLinesRef.current ||
        (preselectedLinesRef.current?.new.length === 0 && preselectedLinesRef.current?.old.length === 0)
      )
        return

      updateSelection()
    }, [preselectedLines])

    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const handleMouseDown = (e: MouseEvent) => {
        if (!(e.target instanceof HTMLElement)) return
        if (!e.target.classList.contains('diff-line-new-num') && !e.target.classList.contains('diff-line-old-num'))
          return

        const line = getLineFromEl(e.target)
        if (line == null) return

        selectedRangeRef.current = {
          start: line,
          end: line,
          side: getSide(e.target) ?? 'new'
        }

        isSelectingRef.current = true

        updateSelection()
      }

      const handleMouseOver = (e: MouseEvent) => {
        if (!isSelectingRef.current) return
        if (!(e.target instanceof HTMLElement)) return
        if (!e.target.classList.contains('diff-line-new-num') && !e.target.classList.contains('diff-line-old-num'))
          return

        const line = getLineFromEl(e.target)

        if (line !== null && selectedRangeRef.current) {
          selectedRangeRef.current = { ...selectedRangeRef.current, end: line }
          updateSelection()
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
    }, [isSelectingRef, selectedRangeRef])

    return (
      <div ref={containerRef}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <DiffView
          {...props}
          ref={ref}
          renderWidgetLine={
            renderWidgetLine
              ? props => {
                  return renderWidgetLine({
                    ...props,
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
