import { DiffModeEnum } from '@git-diff-view/react'
import { forEach, uniq } from 'lodash-es'

import { ExtendedDiffViewProps, LinesRange } from '../extended-diff-view-types'
import { updateSelection_Split } from './extended-diff-view-split-utils'
import { updateSelection_Unified } from './extended-diff-view-unified-utils'

export function getPreselectState(extendData: ExtendedDiffViewProps<unknown>['extendData']) {
  if (!extendData) return { old: [], new: [] }

  const oldLines: number[] = populateLines(extendData.oldFile ?? {})
  const newLines: number[] = populateLines(extendData.newFile ?? {})

  return { old: uniq(oldLines), new: uniq(newLines) }
}

export function populateLines(
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

export function orderRange(range: LinesRange) {
  const start = Math.min(range.start, range.end)
  const end = Math.max(range.start, range.end)
  return { ...range, start, end }
}

export function updateSelection(
  container: HTMLDivElement | null,
  selectedRange: LinesRange | null,
  preselectedLines: { old: number[]; new: number[] },
  diffViewMode: DiffModeEnum = DiffModeEnum.Split
) {
  if (diffViewMode === DiffModeEnum.Split) {
    updateSelection_Split(container, selectedRange, preselectedLines)
  } else {
    updateSelection_Unified(container, selectedRange, preselectedLines)
  }
}
