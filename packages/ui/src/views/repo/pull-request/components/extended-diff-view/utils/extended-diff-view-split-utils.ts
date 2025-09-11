import { LinesRange } from '../extended-diff-view-types'
import { orderRange } from './extended-diff-view-common-utils'

export function getLineFromEl_Split(el: HTMLElement | null): number | null {
  const targetEl = el?.querySelector('span[data-line-num]')
  if (!targetEl) return null

  const lineAttr = targetEl?.getAttribute('data-line-num')

  const line = parseInt(lineAttr ?? '', 10)

  // NOTE: some rows that are not code lines contains additional data like `data-line="1-hunk"`
  if (lineAttr !== line.toString()) return null

  return !isNaN(line) ? line : null
}

export function getSide_Slit(el: HTMLElement | null): 'old' | 'new' | null {
  const targetEl = el?.closest('[data-side]')
  if (!targetEl) return null

  return targetEl.getAttribute('data-side') as 'old' | 'new'
}

export function updateSelection_Split(
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

export function getNumberHolder_Split(el: HTMLElement | null, inMouseDown = false): HTMLElement | null {
  if (!el) return null

  let numberHolder: HTMLElement | null = null

  if (!inMouseDown || el.closest('.diff-add-widget-wrapper')) {
    const newContentEL = el.closest('.diff-line-new-content')
    const oldContentEL = el.closest('.diff-line-old-content')

    if (newContentEL) {
      numberHolder = newContentEL.parentElement?.querySelector('.diff-line-new-num') ?? null
    }
    if (oldContentEL) {
      numberHolder = oldContentEL.parentElement?.querySelector('.diff-line-old-num') ?? null
    }
  }

  if (!numberHolder) {
    numberHolder = el.closest('.diff-line-new-num') || el.closest('.diff-line-old-num')
  }

  return numberHolder
}
