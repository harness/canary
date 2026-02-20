import { LinesRange } from '../extended-diff-view-types'
import { orderRange } from './extended-diff-view-common-utils'

export function updateSelection_Unified(
  container: HTMLDivElement | null,
  selectedRange: LinesRange | null,
  preselectedLines: { old: number[]; new: number[] }
) {
  if (!container) return

  const allRows = container.querySelectorAll<HTMLElement>(`tr[data-line]`)

  allRows.forEach(row => {
    // line numbers holder
    const lineNumbersEl = row.querySelector('.diff-line-num')
    const lineContentEl = row.querySelector('.diff-line-content')

    if (!lineNumbersEl || !lineContentEl) return

    lineNumbersEl.classList.remove('ExtendedDiffView-RowCell-Selected')
    lineContentEl.classList.remove('ExtendedDiffView-RowCell-Selected')

    // collect numbers
    const lineNumberOld = lineNumbersEl.querySelector('span[data-line-old-num]')
    const lineNumberNew = lineNumbersEl.querySelector('span[data-line-new-num]')

    const lineOldStr = lineNumberOld?.getAttribute('data-line-old-num')
    const lineNewStr = lineNumberNew?.getAttribute('data-line-new-num')

    const rowLineOld = lineOldStr ? parseInt(lineOldStr, 10) : undefined
    const rowLineNew = lineNewStr ? parseInt(lineNewStr, 10) : undefined

    // current user selection
    const range = selectedRange ? orderRange(selectedRange) : null
    let inUserSelected = false
    if (rowLineOld) {
      if (range && rowLineOld >= range.start && rowLineOld <= range.end && range.side === 'old') {
        inUserSelected = true
      }
    }
    if (rowLineNew) {
      if (range && rowLineNew >= range.start && rowLineNew <= range.end && range.side === 'new') {
        inUserSelected = true
      }
    }

    // selection for existing comments
    const inPreselectedNew = rowLineNew && preselectedLines?.['new'].indexOf(rowLineNew) !== -1
    const inPreselectedOld = rowLineOld && preselectedLines?.['old'].indexOf(rowLineOld) !== -1

    if (inUserSelected || inPreselectedNew || inPreselectedOld) {
      lineNumbersEl.classList.add('ExtendedDiffView-RowCell-Selected')
      lineContentEl.classList.add('ExtendedDiffView-RowCell-Selected')
    }
  })
}

export function getLineNumber_Unified(el: HTMLElement | null): { old?: number; new?: number } | null {
  if (!el) return null

  const lineNumbersEl = el.closest('.diff-line-num')

  if (!lineNumbersEl) return null

  // collect numbers
  const lineNumberOld = lineNumbersEl.querySelector('span[data-line-old-num]')
  const lineNumberNew = lineNumbersEl.querySelector('span[data-line-new-num]')

  const lineOldStr = lineNumberOld?.getAttribute('data-line-old-num')
  const lineNewStr = lineNumberNew?.getAttribute('data-line-new-num')

  const rowLineOld = lineOldStr ? parseInt(lineOldStr, 10) : undefined
  const rowLineNew = lineNewStr ? parseInt(lineNewStr, 10) : undefined

  return { old: rowLineOld, new: rowLineNew }
}
