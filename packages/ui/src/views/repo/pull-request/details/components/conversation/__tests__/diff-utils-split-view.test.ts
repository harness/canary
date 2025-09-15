import { LinesRange } from '@views/repo/pull-request/components/extended-diff-view/extended-diff-view-types'

import { scopeLinesRangeToOneBlock } from '../diff-utils'
import { blocks } from './diff-utils.mocks'

describe('scopeLinesRangeToOneBlock - two blocks', () => {
  it('start in one block end in another - up direction', () => {
    const linesRange = {
      start: 46,
      end: 35,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 46,
      end: 41,
      side: 'new',
      startSide: 'both',
      endSide: 'new'
    })
  })

  it('start in one block end in another - down direction', () => {
    const linesRange = {
      start: 127,
      end: 133,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 127,
      end: 133,
      side: 'new',
      startSide: 'new',
      endSide: 'both'
    })
  })
})

describe('scopeLinesRangeToOneBlock - one line', () => {
  it('one new line', () => {
    const linesRange = {
      start: 6,
      end: 6,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 6,
      end: 6,
      side: 'new',
      startSide: 'new',
      endSide: 'new'
    })
  })

  it('one old line', () => {
    const linesRange = {
      start: 6,
      end: 6,
      side: 'old'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 6,
      end: 6,
      side: 'old',
      startSide: 'old',
      endSide: 'old'
    })
  })

  it('one unchanged (both) line - old side', () => {
    const linesRange = {
      start: 3,
      end: 3,
      side: 'old'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 3,
      end: 3,
      side: 'old',
      startSide: 'both',
      endSide: 'both'
    })
  })

  it('one unchanged (both) line - new side', () => {
    const linesRange = {
      start: 3,
      end: 3,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 3,
      end: 3,
      side: 'new',
      startSide: 'both',
      endSide: 'both'
    })
  })
})

describe('scopeLinesRangeToOneBlock - one block', () => {
  it('from unchanged/both to new - up direction', () => {
    const linesRange = {
      start: 38,
      end: 35,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 38,
      end: 35,
      side: 'new',
      startSide: 'new',
      endSide: 'both'
    })
  })

  it('from unchanged/both to old - up direction', () => {
    const linesRange = {
      start: 10,
      end: 8,
      side: 'old'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 10,
      end: 8,
      side: 'old',
      startSide: 'old',
      endSide: 'both'
    })
  })

  it('from unchanged/both to unchanged/both - up direction, new side', () => {
    const linesRange = {
      start: 43,
      end: 41,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 43,
      end: 41,
      side: 'new',
      startSide: 'both',
      endSide: 'both'
    })
  })

  it('from unchanged/both to unchanged/both - up direction, old side', () => {
    const linesRange = {
      start: 42,
      end: 40,
      side: 'old'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 42,
      end: 40,
      side: 'old',
      startSide: 'both',
      endSide: 'both'
    })
  })

  it('from unchanged/both to new - down direction', () => {
    const linesRange = {
      start: 120,
      end: 123,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 120,
      end: 123,
      side: 'new',
      startSide: 'both',
      endSide: 'new'
    })
  })

  it('from unchanged/both to old - down direction', () => {
    const linesRange = {
      start: 103,
      end: 105,
      side: 'old'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 103,
      end: 105,
      side: 'old',
      startSide: 'both',
      endSide: 'old'
    })
  })

  it('from unchanged/both to unchanged/both - down direction, new side', () => {
    const linesRange = {
      start: 37,
      end: 39,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 37,
      end: 39,
      side: 'new',
      startSide: 'both',
      endSide: 'both'
    })
  })

  it('from unchanged/both to unchanged/both - down direction, old side', () => {
    const linesRange = {
      start: 25,
      end: 27,
      side: 'old',
      startSide: 'both',
      endSide: 'both'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 25,
      end: 27,
      side: 'old',
      startSide: 'both',
      endSide: 'both'
    })
  })

  it('from new to unchanged/both - up direction', () => {
    const linesRange = {
      start: 26,
      end: 22,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 26,
      end: 22,
      side: 'new',
      startSide: 'both',
      endSide: 'new'
    })
  })
  it('from old to unchanged/both - up direction', () => {
    const linesRange = {
      start: 24,
      end: 22,
      side: 'old'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 24,
      end: 22,
      side: 'old',
      startSide: 'both',
      endSide: 'old'
    })
  })

  it('from new to unchanged/both - down direction', () => {
    const linesRange = {
      start: 1,
      end: 3,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 1,
      end: 3,
      side: 'new',
      startSide: 'new',
      endSide: 'both'
    })
  })

  it('from old to unchanged/both - down direction', () => {
    const linesRange = {
      start: 1,
      end: 2,
      side: 'old',
      startSide: 'old',
      endSide: 'both'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 1,
      end: 2,
      side: 'old',
      startSide: 'old',
      endSide: 'both'
    })
  })

  it('from new to new - up direction', () => {
    const linesRange = {
      start: 47,
      end: 45,
      side: 'new',
      startSide: 'new',
      endSide: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 47,
      end: 45,
      side: 'new',
      startSide: 'new',
      endSide: 'new'
    })
  })

  it('from new to new - down direction', () => {
    const linesRange = {
      start: 45,
      end: 46,
      side: 'new',
      startSide: 'new',
      endSide: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 45,
      end: 46,
      side: 'new',
      startSide: 'new',
      endSide: 'new'
    })
  })

  it('from new to new (unchanged/both between) - up direction', () => {
    const linesRange = {
      start: 6,
      end: 1,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 6,
      end: 1,
      side: 'new',
      startSide: 'new',
      endSide: 'new'
    })
  })

  it('from old to old (unchanged/both between) - up direction', () => {
    const linesRange = {
      start: 6,
      end: 1,
      side: 'old'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 6,
      end: 1,
      side: 'old',
      startSide: 'old',
      endSide: 'old'
    })
  })

  it('from new to new (unchanged/both between) - down direction', () => {
    const linesRange = {
      start: 1,
      end: 6,
      side: 'new'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 1,
      end: 6,
      side: 'new',
      startSide: 'new',
      endSide: 'new'
    })
  })

  it('from old to old (unchanged/both between) - down direction', () => {
    const linesRange = {
      start: 1,
      end: 6,
      side: 'old'
    } as LinesRange

    const result = scopeLinesRangeToOneBlock(blocks, linesRange)

    expect(result).toEqual({
      start: 1,
      end: 6,
      side: 'old',
      startSide: 'old',
      endSide: 'old'
    })
  })
})
