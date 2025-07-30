import { forEach, uniq } from 'lodash-es'

import { ExtendedDiffViewProps, LinesRange } from './extended-diff-view-types'

export function orderRange(range: LinesRange) {
  const start = Math.min(range.start, range.end)
  const end = Math.max(range.start, range.end)
  return { ...range, start, end }
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

export function getLineFromEl(el: HTMLElement | null): number | null {
  const targetEl = el?.querySelector('span[data-line-num]')
  if (!targetEl) return null

  const lineAttr = targetEl?.getAttribute('data-line-num')

  const line = parseInt(lineAttr ?? '', 10)

  // NOTE: some rows that are not code lines contains additional data like `data-line="1-hunk"`
  if (lineAttr !== line.toString()) return null

  return !isNaN(line) ? line : null
}

export function getSide(el: HTMLElement | null): 'old' | 'new' | null {
  const targetEl = el?.closest('[data-side]')
  if (!targetEl) return null

  return targetEl.getAttribute('data-side') as 'old' | 'new'
}

export function getPreselectState(extendData: ExtendedDiffViewProps<unknown>['extendData']) {
  if (!extendData) return { old: [], new: [] }

  const oldLines: number[] = populateLines(extendData.oldFile ?? {})
  const newLines: number[] = populateLines(extendData.newFile ?? {})

  return { old: uniq(oldLines), new: uniq(newLines) }
}

export function updateSelection(
  container: HTMLDivElement | null,
  selectedRange: LinesRange | null,
  preselectedLines: { old: number[]; new: number[] }
) {
  if (!container) return

  const allCells = container.querySelectorAll<HTMLElement>(`tr[data-line] > td[data-side]`)

  allCells.forEach(cell => {
    cell.classList.remove('ExtendedDiffView-RowCell-Selected')

    const sideAttr = cell.getAttribute('data-side') as 'old' | 'new'
    const lineAttr = cell.parentElement
      ?.querySelector('td[data-side="' + sideAttr + '"] span[data-line-num]')
      ?.getAttribute('data-line-num')

    const line = parseInt(lineAttr || '', 10)

    if (lineAttr !== line.toString()) return

    // current user selection
    const range = selectedRange ? orderRange(selectedRange) : null
    const inUserSelected = range && line >= range.start && line <= range.end && range.side === sideAttr

    // selection for existing comments
    const inPreselected = preselectedLines?.[sideAttr].indexOf(line) !== -1

    if (inUserSelected || inPreselected) {
      cell.classList.add('ExtendedDiffView-RowCell-Selected')
    }
  })
}
