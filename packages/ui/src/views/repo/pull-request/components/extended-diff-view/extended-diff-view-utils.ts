import { forEach } from 'lodash-es'

import { LinesRange } from './extended-diff-view-types'

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
