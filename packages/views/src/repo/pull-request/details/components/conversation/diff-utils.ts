import {
  LinesRange,
  Side,
  SideWithBoth
} from '@views/repo/pull-request/components/extended-diff-view/extended-diff-view-types'

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
  const block = getBlockContainsLine(blocks, linesRange.side, linesRange.start)

  if (!block) return linesRange

  const minMax = { min: Number.MAX_SAFE_INTEGER, max: 0 }

  block.lines.forEach(line => {
    const num = getLineNo(line, linesRange.side)
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

  // logic for startSide and endSide
  const [from, to] =
    newLinesRange.start < newLinesRange.end
      ? [newLinesRange.start, newLinesRange.end]
      : [newLinesRange.end, newLinesRange.start]

  const scopedLines = block.lines.filter(line => {
    const num = getLineNo(line, linesRange.side)
    return num != null && num >= from && num <= to
  })

  const startLine = scopedLines[0]
  const endLine = scopedLines[scopedLines.length - 1]

  return { ...newLinesRange, startSide: getBlockLineSide(startLine), endSide: getBlockLineSide(endLine) }
}

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
      direction = indexOfStartBlock <= indexOfEndBlock ? 1 : -1
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
  const startLineSideOrBoth = getBlockLineSide(startLine)
  let side: Side = 'new'
  if (startLineSideOrBoth === 'both') {
    for (let i = startIdx; direction > 0 ? i <= endIdx : i >= endIdx; i += direction) {
      const currSide = getBlockLineSide(startBlock.lines[i])

      if (startLineSideOrBoth !== currSide) {
        side = currSide
        break
      }
    }
  } else {
    side = startLineSideOrBoth
  }

  // we know start line
  const startLineNo = getLineNo(startBlock.lines[startIdx], side) ?? 1
  // endline will be found in the loop
  let endLineNo: number = 1
  let endLine: DiffLine = startBlock.lines[endIdx]

  // iterating while we have the same side
  for (let i = startIdx; direction > 0 ? i <= endIdx : i >= endIdx; i += direction) {
    const line = startBlock.lines[i]

    if (side === 'new' && line.newNumber) {
      endLineNo = line.newNumber
      endLine = line
    } else if (side === 'old' && line.oldNumber) {
      endLineNo = line.oldNumber
      endLine = line
    } else {
      break
    }
  }

  return {
    side,
    start: startLineNo,
    end: endLineNo,
    startSide: direction === 1 ? startLineSideOrBoth : getBlockLineSide(endLine),
    endSide: direction === 1 ? getBlockLineSide(endLine) : startLineSideOrBoth
  }
}

function getBlockLineSide(line: DiffLine): SideWithBoth {
  return line.newNumber && line.oldNumber ? 'both' : line.newNumber ? 'new' : 'old'
}

function getLineNo(line: DiffLine, side: Side) {
  return side === 'new' ? line.newNumber : line.oldNumber
}
