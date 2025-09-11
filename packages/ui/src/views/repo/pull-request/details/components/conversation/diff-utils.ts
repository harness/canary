import { LinesRange, Side } from '@views/repo/pull-request/components/extended-diff-view/extended-diff-view-types'

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

function getBlockLineIndex(block: DiffBlock, side: 'old' | 'new', lineNumber: number) {
  return block.lines.findIndex(line => {
    const num = side === 'old' ? line.oldNumber : line.newNumber
    if (typeof num !== 'undefined' && num === lineNumber) {
      return true
    }
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

type SideWithBoth = Side | 'both'

export function scopeLinesRangeToOneBlockAndOneSide(
  blocks: DiffBlock[],
  start: { old?: number; new?: number },
  end: { old?: number; new?: number }
): LinesRange | null {
  const sideForFindingStartLine: Side = start.new && start.old ? 'new' : start.new ? 'new' : 'old'
  const sideForFindingEndLine: Side = end.new && end.old ? 'new' : end.new ? 'new' : 'old'

  const startLineNumber = start[sideForFindingStartLine] ?? 1
  const endLineNumber = end[sideForFindingEndLine] ?? 1

  const startBlock = getBlockContainsLine(blocks, sideForFindingStartLine, startLineNumber)
  const endBlock = getBlockContainsLine(blocks, sideForFindingEndLine, endLineNumber)

  let direction = 1 // direction 1=DOWN, -1=UP
  let startIdx = 0
  let endIdx = 0
  // different blocks
  if (startBlock && endBlock) {
    if (startBlock !== endBlock) {
      const indexOfStartBlock = blocks.indexOf(startBlock)
      const indexOfEndBlock = blocks.indexOf(endBlock)

      // direction depends on block index
      direction = indexOfStartBlock < indexOfEndBlock ? 1 : -1
      // startIdx -  getting form the startBlock block
      startIdx = getBlockLineIndex(startBlock, sideForFindingStartLine, startLineNumber)
      // endIdx - is first or last line in the block and depends on direction
      endIdx = direction === 1 ? startBlock.lines.length - 1 : 0
    }
    // same blocks
    else {
      // we are getting startIdx and endIdx from the same block
      startIdx = getBlockLineIndex(startBlock, sideForFindingStartLine, startLineNumber)
      endIdx = getBlockLineIndex(startBlock, sideForFindingEndLine, endLineNumber)
      // direction direction on startIdx and endIdx
      direction = startIdx < endIdx ? 1 : -1
    }
  } else {
    return null
  }

  // determine side
  const startLine = startBlock.lines[startIdx]
  const sideOrBoth = getBlockLineSide(startLine)
  let side: Side = 'new'
  if (sideOrBoth === 'both') {
    for (let i = startIdx; direction > 0 ? i <= endIdx : i >= endIdx; i += direction) {
      const currSide = getBlockLineSide(startBlock.lines[i])

      if (sideOrBoth !== currSide) {
        side = currSide
        break
      }
    }
  } else {
    side = sideOrBoth
  }

  // we know start line
  const startLineNo = getLineNo(startBlock.lines[startIdx], side) ?? 1
  // endline will be found in the loop
  let endLineNo: number = 1

  // iterating while we have the same side
  for (let i = startIdx; direction > 0 ? i <= endIdx : i >= endIdx; i += direction) {
    const line = startBlock.lines[i]

    if (side === 'new' && line.newNumber) {
      endLineNo = line.newNumber
    } else if (side === 'old' && line.oldNumber) {
      endLineNo = line.oldNumber
    } else {
      break
    }
  }

  return {
    side,
    start: startLineNo,
    end: endLineNo
  }
}

function getBlockLineSide(line: DiffLine): SideWithBoth {
  return line.newNumber && line.oldNumber ? 'both' : line.newNumber ? 'new' : 'old'
}

function getLineNo(line: DiffLine, side: Side) {
  return side === 'new' ? line.newNumber : line.oldNumber
}
