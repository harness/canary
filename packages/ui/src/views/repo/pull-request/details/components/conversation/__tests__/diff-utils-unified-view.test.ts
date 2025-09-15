import { scopeLinesRangeToOneBlockAndOneSide } from '../diff-utils'
import { blocks, blocks2 } from './diff-utils.mocks'

describe('scopeLinesRangeToOneBlock - two blocks', () => {
  it('start in one block end in another - up direction', () => {
    const start = {
      old: 24
    }
    const end = {
      old: 5,
      new: 5
    }

    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'old',
      start: 24,
      end: 21,
      startSide: 'both',
      endSide: 'old'
    })
  })

  it('start in one block end in another - down direction', () => {
    const start = {
      new: 8
    }
    const end = {
      old: 24
    }

    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 8,
      end: 11,
      startSide: 'new',
      endSide: 'both'
    })
  })
})

describe('scopeLinesRangeToOneBlock - one line', () => {
  it('one new line', () => {
    const start = {
      new: 6
    }
    const end = {
      new: 6
    }

    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 6,
      end: 6,
      startSide: 'new',
      endSide: 'new'
    })
  })

  it('one old line', () => {
    const start = {
      old: 6
    }
    const end = {
      old: 6
    }

    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'old',
      start: 6,
      end: 6,
      startSide: 'old',
      endSide: 'old'
    })
  })

  it('one unchanged line', () => {
    const start = {
      old: 4,
      new: 4
    }
    const end = {
      old: 4,
      new: 4
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 4,
      end: 4,
      startSide: 'both',
      endSide: 'both'
    })
  })
})

describe('scopeLinesRangeToOneBlock - one block', () => {
  it('from unchanged/both to new - up direction', () => {
    const start = {
      old: 33,
      new: 49
    }
    const end = {
      new: 46
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 49,
      end: 46,
      startSide: 'new',
      endSide: 'both'
    })
  })

  it('from unchanged/both to old - up direction', () => {
    const start = {
      old: 4,
      new: 2
    }
    const end = {
      old: 1
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks2, start, end)

    expect(result).toEqual({
      side: 'old',
      start: 4,
      end: 1,
      startSide: 'old',
      endSide: 'both'
    })
  })

  it('from unchanged/both to unchanged/both - up direction', () => {
    const start = {
      old: 11,
      new: 11
    }
    const end = {
      old: 9,
      new: 9
    }

    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 11,
      end: 9,
      startSide: 'both',
      endSide: 'both'
    })
  })

  it('from unchanged/both to new - down direction', () => {
    const start = {
      old: 30,
      new: 42
    }
    const end = {
      new: 47
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 42,
      end: 47,
      startSide: 'both',
      endSide: 'new'
    })
  })

  it('from unchanged/both to old - down direction', () => {
    const start = {
      old: 40,
      new: 56
    }
    const end = {
      old: 43
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'old',
      start: 40,
      end: 43,
      startSide: 'both',
      endSide: 'old'
    })
  })

  it('from unchanged/both to unchanged/both - down direction', () => {
    const start = {
      old: 29,
      new: 41
    }
    const end = {
      old: 31,
      new: 43
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 41,
      end: 43,
      startSide: 'both',
      endSide: 'both'
    })
  })

  it('from new to unchanged/both - up direction', () => {
    const start = {
      old: 21,
      new: 21
    }
    const end = {
      old: 24
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'old',
      start: 21,
      end: 24,
      startSide: 'both',
      endSide: 'old'
    })
  })
  it('from old to unchanged/both - up direction', () => {
    const start = {
      old: 6
    }
    const end = {
      old: 3,
      new: 3
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'old',
      start: 6,
      end: 3,
      startSide: 'both',
      endSide: 'old'
    })
  })

  it('from new to unchanged/both - down direction', () => {
    const start = {
      new: 46
    }
    const end = {
      old: 33,
      new: 49
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 46,
      end: 49,
      startSide: 'new',
      endSide: 'both'
    })
  })

  it('from old to unchanged/both - down direction', () => {
    const start = {
      old: 1
    }
    const end = {
      old: 4,
      new: 2
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks2, start, end)

    expect(result).toEqual({
      side: 'old',
      start: 1,
      end: 4,
      startSide: 'old',
      endSide: 'both'
    })
  })

  it('from new to new - up direction', () => {
    const start = {
      new: 46
    }
    const end = {
      new: 45
    }

    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 46,
      end: 45,
      startSide: 'new',
      endSide: 'new'
    })
  })

  it('from new to new - down direction', () => {
    const start = {
      new: 44
    }
    const end = {
      new: 46
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 44,
      end: 46,
      startSide: 'new',
      endSide: 'new'
    })
  })

  it('from new to new (unchanged/both between) - up direction', () => {
    const start = {
      old: 33,
      new: 49
    }
    const end = {
      old: 30,
      new: 42
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 49,
      end: 42,
      startSide: 'both',
      endSide: 'both'
    })
  })

  it('from old to old (unchanged/both between) - up direction', () => {
    const start = {
      old: 6
    }
    const end = {
      old: 1
    }

    const result = scopeLinesRangeToOneBlockAndOneSide(blocks2, start, end)

    expect(result).toEqual({
      side: 'old',
      start: 6,
      end: 1,
      startSide: 'old',
      endSide: 'old'
    })
  })

  it('from new to new (unchanged/both between) - down direction', () => {
    const start = {
      old: 29,
      new: 41
    }
    const end = {
      old: 34,
      new: 50
    }
    const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

    expect(result).toEqual({
      side: 'new',
      start: 41,
      end: 50,
      startSide: 'both',
      endSide: 'both'
    })
  })

  // it('from old to old (unchanged/both between) - down direction', () => {
  //   const start = {}
  //   const end = {}
  //   const result = scopeLinesRangeToOneBlockAndOneSide(blocks, start, end)

  //   expect(result).toEqual({})
  // })
})
