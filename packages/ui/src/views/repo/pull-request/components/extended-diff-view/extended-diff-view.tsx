import { forwardRef, useEffect, useMemo, useRef } from 'react'

import { DiffFile, DiffView, DiffViewProps } from '@git-diff-view/react'
import { forEach, uniq } from 'lodash-es'

import './extended-diff-view-style.css'

interface ExtendedDiffViewProps<T> extends Omit<DiffViewProps<T>, 'extendData'> {
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
}

function populateLines(
  data: Record<
    string,
    {
      fromLine: number
    }
  >
): number[] {
  const lines: number[] = []

  forEach(data, (item, toLineStr) => {
    const toLine = parseInt(toLineStr, 10)
    for (let lineNo = item.fromLine; lineNo <= toLine; lineNo++) {
      lines.push(lineNo)
    }
  })

  return lines
}

export const ExtendedDiffView = forwardRef(
  <T,>(
    props: ExtendedDiffViewProps<T>,
    ref: React.ForwardedRef<{
      getDiffFileInstance: () => DiffFile
    }>
  ) => {
    const { extendData } = props

    const containerRef = useRef<HTMLDivElement>(null)

    const preselectedLines: { old: number[]; new: number[] } = useMemo(() => {
      if (!extendData) return { old: [], new: [] }

      const oldLines: number[] = populateLines(extendData.oldFile ?? {})
      const newLines: number[] = populateLines(extendData.newFile ?? {})

      return { old: uniq(oldLines), new: uniq(newLines) }
    }, [extendData])

    useEffect(() => {
      if (!containerRef.current) return
      if (preselectedLines.new.length === 0 && preselectedLines.old.length === 0) return

      const allCells = containerRef.current.querySelectorAll<HTMLElement>(`tr[data-line] > td[data-side]`)

      allCells.forEach(cell => {
        const sideAttr = cell.getAttribute('data-side') as 'old' | 'new'
        const lineAttr = cell.parentElement
          ?.querySelector('td[data-side="' + sideAttr + '"] span[data-line-num]')
          ?.getAttribute('data-line-num')

        const line = parseInt(lineAttr || '', 10)

        if (lineAttr !== line.toString()) return

        if (preselectedLines[sideAttr].indexOf(line) !== -1) {
          cell.classList.add('ExtendedDiffView-RowCell-Selected')
        }
      })
    }, [preselectedLines])

    return (
      <div ref={containerRef}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <DiffView {...props} ref={ref} />
      </div>
    )
  }
)

ExtendedDiffView.displayName = 'ExtendedDiffView'
