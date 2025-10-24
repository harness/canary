import { LinesRange } from '@views/repo/pull-request/components/extended-diff-view/extended-diff-view-types'

import { DiffBlock, DiffLine } from '../../pull-request-details-types'

export function getLinesFromBlocks(
  blocks: DiffBlock[],
  side: 'old' | 'new',
  fromLine: number,
  toLine: number
): (DiffLine & { cleanContent: string })[] {
  const rangeLines: (DiffLine & { cleanContent: string })[] = []

  blocks.forEach(block => {
    block.lines.forEach(line => {
      const num = side === 'old' ? line.oldNumber : line.newNumber
      if (typeof num !== 'undefined' && num >= fromLine && num <= toLine) {
        rangeLines.push({ ...line, cleanContent: line.content.slice(1) })
      }
    })
  })

  return rangeLines
}

function getBlockContainsLine(blocks: DiffBlock[], side: 'old' | 'new', lineNumber: number) {
  return blocks.find(block => {
    return !!block.lines.find(line => {
      const num = side === 'old' ? line.oldNumber : line.newNumber
      if (typeof num !== 'undefined' && num === lineNumber) {
        return true
      }
    })
  })
}

export function scopeLinesRangeToOneBlock(blocks: DiffBlock[], linesRange: LinesRange) {
  if (linesRange.start === linesRange.end) return linesRange

  const block = getBlockContainsLine(blocks, linesRange.side, linesRange.start)

  if (!block) return linesRange

  const minMax = { min: Number.MAX_SAFE_INTEGER, max: 0 }

  block.lines.forEach(line => {
    const num = linesRange.side === 'old' ? line.oldNumber : line.newNumber
    if (num) {
      minMax.min = Math.min(minMax.min, num)
      minMax.max = Math.max(minMax.max, num)
    }
  })

  const newLinesRange = { ...linesRange }

  if (linesRange.start < linesRange.end) {
    newLinesRange.end = Math.min(linesRange.end, minMax.max)
  }

  if (linesRange.start > linesRange.end) {
    newLinesRange.end = Math.max(linesRange.end, minMax.min)
  }

  return newLinesRange
}
