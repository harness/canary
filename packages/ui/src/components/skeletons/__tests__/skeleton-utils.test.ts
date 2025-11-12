import { describe, expect, test, vi } from 'vitest'

import { getRandomPercentageWidth, getRandomPixelWidth } from '../skeleton-utils'

// Mock Math.random for predictable testing
const mockRandom = (value: number) => {
  vi.spyOn(Math, 'random').mockReturnValue(value)
}

describe('getRandomPercentageWidth', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Functionality', () => {
    test('should return a percentage string', () => {
      const result = getRandomPercentageWidth(10, 90)
      expect(result).toMatch(/^\d+%$/)
    })

    test('should return value within range', () => {
      const result = getRandomPercentageWidth(10, 90)
      const numericValue = parseInt(result)
      expect(numericValue).toBeGreaterThanOrEqual(10)
      expect(numericValue).toBeLessThanOrEqual(90)
    })

    test('should return min value when random is 0', () => {
      mockRandom(0)
      const result = getRandomPercentageWidth(10, 90)
      expect(result).toBe('10%')
    })

    test('should return max value when random is close to 1', () => {
      mockRandom(0.9999)
      const result = getRandomPercentageWidth(10, 90)
      expect(result).toBe('90%')
    })

    test('should return middle value for random 0.5', () => {
      mockRandom(0.5)
      const result = getRandomPercentageWidth(10, 90)
      const numericValue = parseInt(result)
      expect(numericValue).toBe(50)
    })
  })

  describe('Range Variations', () => {
    test('should handle small range', () => {
      mockRandom(0)
      const result = getRandomPercentageWidth(45, 55)
      expect(result).toBe('45%')
    })

    test('should handle large range', () => {
      mockRandom(0)
      const result = getRandomPercentageWidth(0, 100)
      expect(result).toBe('0%')
    })

    test('should handle range of 1', () => {
      mockRandom(0)
      const result = getRandomPercentageWidth(50, 51)
      expect(result).toBe('50%')
    })

    test('should handle range of 0 (min equals max)', () => {
      mockRandom(0.5)
      const result = getRandomPercentageWidth(50, 50)
      expect(result).toBe('50%')
    })
  })

  describe('Edge Cases', () => {
    test('should handle 0% minimum', () => {
      mockRandom(0)
      const result = getRandomPercentageWidth(0, 100)
      expect(result).toBe('0%')
    })

    test('should handle 100% maximum', () => {
      mockRandom(0.9999)
      const result = getRandomPercentageWidth(0, 100)
      expect(result).toBe('100%')
    })

    test('should handle values less than 10', () => {
      mockRandom(0)
      const result = getRandomPercentageWidth(1, 9)
      expect(result).toBe('1%')
    })

    test('should handle large min value', () => {
      mockRandom(0)
      const result = getRandomPercentageWidth(90, 100)
      expect(result).toBe('90%')
    })
  })

  describe('Random Distribution', () => {
    test('should generate different values across range', () => {
      const values = new Set<string>()

      // Restore mocks to get actual random values
      vi.restoreAllMocks()

      // Generate 100 random values
      for (let i = 0; i < 100; i++) {
        const result = getRandomPercentageWidth(10, 90)
        values.add(result)
      }

      // Should have generated multiple unique values
      expect(values.size).toBeGreaterThan(1)
    })

    test('should stay within bounds for multiple calls', () => {
      vi.restoreAllMocks()

      for (let i = 0; i < 100; i++) {
        const result = getRandomPercentageWidth(20, 80)
        const numericValue = parseInt(result)
        expect(numericValue).toBeGreaterThanOrEqual(20)
        expect(numericValue).toBeLessThanOrEqual(80)
      }
    })
  })

  describe('Formatting', () => {
    test('should always include % symbol', () => {
      mockRandom(0.5)
      const result = getRandomPercentageWidth(10, 90)
      expect(result).toContain('%')
    })

    test('should not include decimals', () => {
      mockRandom(0.333)
      const result = getRandomPercentageWidth(10, 90)
      expect(result).toMatch(/^\d+%$/)
      expect(result).not.toContain('.')
    })

    test('should return integer values', () => {
      mockRandom(0.7777)
      const result = getRandomPercentageWidth(10, 90)
      const numericValue = parseInt(result)
      expect(numericValue).toBe(Math.floor(numericValue))
    })
  })

  describe('Multiple Ranges', () => {
    test('should handle range 50-90', () => {
      mockRandom(0)
      expect(getRandomPercentageWidth(50, 90)).toBe('50%')

      mockRandom(0.9999)
      expect(getRandomPercentageWidth(50, 90)).toBe('90%')
    })

    test('should handle range 30-120', () => {
      mockRandom(0)
      expect(getRandomPercentageWidth(30, 120)).toBe('30%')

      mockRandom(0.9999)
      expect(getRandomPercentageWidth(30, 120)).toBe('120%')
    })

    test('should handle range 10-20', () => {
      mockRandom(0)
      expect(getRandomPercentageWidth(10, 20)).toBe('10%')

      mockRandom(0.9999)
      expect(getRandomPercentageWidth(10, 20)).toBe('20%')
    })
  })
})

describe('getRandomPixelWidth', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Functionality', () => {
    test('should return a pixel string', () => {
      const result = getRandomPixelWidth(10, 90)
      expect(result).toMatch(/^\d+px$/)
    })

    test('should return value within range', () => {
      const result = getRandomPixelWidth(10, 90)
      const numericValue = parseInt(result)
      expect(numericValue).toBeGreaterThanOrEqual(10)
      expect(numericValue).toBeLessThanOrEqual(90)
    })

    test('should return min value when random is 0', () => {
      mockRandom(0)
      const result = getRandomPixelWidth(10, 90)
      expect(result).toBe('10px')
    })

    test('should return max value when random is close to 1', () => {
      mockRandom(0.9999)
      const result = getRandomPixelWidth(10, 90)
      expect(result).toBe('90px')
    })

    test('should return middle value for random 0.5', () => {
      mockRandom(0.5)
      const result = getRandomPixelWidth(10, 90)
      const numericValue = parseInt(result)
      expect(numericValue).toBe(50)
    })
  })

  describe('Range Variations', () => {
    test('should handle small range', () => {
      mockRandom(0)
      const result = getRandomPixelWidth(100, 110)
      expect(result).toBe('100px')
    })

    test('should handle large range', () => {
      mockRandom(0)
      const result = getRandomPixelWidth(0, 1000)
      expect(result).toBe('0px')
    })

    test('should handle range of 1', () => {
      mockRandom(0)
      const result = getRandomPixelWidth(50, 51)
      expect(result).toBe('50px')
    })

    test('should handle range of 0 (min equals max)', () => {
      mockRandom(0.5)
      const result = getRandomPixelWidth(50, 50)
      expect(result).toBe('50px')
    })
  })

  describe('Edge Cases', () => {
    test('should handle 0px minimum', () => {
      mockRandom(0)
      const result = getRandomPixelWidth(0, 100)
      expect(result).toBe('0px')
    })

    test('should handle large pixel values', () => {
      mockRandom(0.9999)
      const result = getRandomPixelWidth(0, 1920)
      expect(result).toBe('1920px')
    })

    test('should handle values less than 10', () => {
      mockRandom(0)
      const result = getRandomPixelWidth(1, 9)
      expect(result).toBe('1px')
    })

    test('should handle large min value', () => {
      mockRandom(0)
      const result = getRandomPixelWidth(500, 600)
      expect(result).toBe('500px')
    })
  })

  describe('Random Distribution', () => {
    test('should generate different values across range', () => {
      const values = new Set<string>()

      vi.restoreAllMocks()

      for (let i = 0; i < 100; i++) {
        const result = getRandomPixelWidth(10, 90)
        values.add(result)
      }

      expect(values.size).toBeGreaterThan(1)
    })

    test('should stay within bounds for multiple calls', () => {
      vi.restoreAllMocks()

      for (let i = 0; i < 100; i++) {
        const result = getRandomPixelWidth(20, 200)
        const numericValue = parseInt(result)
        expect(numericValue).toBeGreaterThanOrEqual(20)
        expect(numericValue).toBeLessThanOrEqual(200)
      }
    })
  })

  describe('Formatting', () => {
    test('should always include px suffix', () => {
      mockRandom(0.5)
      const result = getRandomPixelWidth(10, 90)
      expect(result).toContain('px')
    })

    test('should not include decimals', () => {
      mockRandom(0.333)
      const result = getRandomPixelWidth(10, 90)
      expect(result).toMatch(/^\d+px$/)
      expect(result).not.toContain('.')
    })

    test('should return integer values', () => {
      mockRandom(0.7777)
      const result = getRandomPixelWidth(10, 90)
      const numericValue = parseInt(result)
      expect(numericValue).toBe(Math.floor(numericValue))
    })
  })

  describe('Common Use Cases', () => {
    test('should handle skeleton text width (30-120px)', () => {
      mockRandom(0)
      expect(getRandomPixelWidth(30, 120)).toBe('30px')

      mockRandom(0.9999)
      expect(getRandomPixelWidth(30, 120)).toBe('120px')
    })

    test('should handle skeleton avatar size (40-80px)', () => {
      mockRandom(0)
      expect(getRandomPixelWidth(40, 80)).toBe('40px')

      mockRandom(0.9999)
      expect(getRandomPixelWidth(40, 80)).toBe('80px')
    })

    test('should handle skeleton card width (200-400px)', () => {
      mockRandom(0)
      expect(getRandomPixelWidth(200, 400)).toBe('200px')

      mockRandom(0.9999)
      expect(getRandomPixelWidth(200, 400)).toBe('400px')
    })
  })

  describe('Multiple Ranges', () => {
    test('should handle range 50-90', () => {
      mockRandom(0)
      expect(getRandomPixelWidth(50, 90)).toBe('50px')

      mockRandom(0.9999)
      expect(getRandomPixelWidth(50, 90)).toBe('90px')
    })

    test('should handle range 100-500', () => {
      mockRandom(0)
      expect(getRandomPixelWidth(100, 500)).toBe('100px')

      mockRandom(0.9999)
      expect(getRandomPixelWidth(100, 500)).toBe('500px')
    })

    test('should handle range 10-20', () => {
      mockRandom(0)
      expect(getRandomPixelWidth(10, 20)).toBe('10px')

      mockRandom(0.9999)
      expect(getRandomPixelWidth(10, 20)).toBe('20px')
    })
  })
})

describe('Utility Functions Comparison', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('both functions should use same random logic', () => {
    mockRandom(0.5)

    const percentage = getRandomPercentageWidth(10, 90)
    const pixels = getRandomPixelWidth(10, 90)

    expect(parseInt(percentage)).toBe(parseInt(pixels))
  })

  test('both functions should return min for random 0', () => {
    mockRandom(0)

    expect(getRandomPercentageWidth(20, 80)).toBe('20%')
    expect(getRandomPixelWidth(20, 80)).toBe('20px')
  })

  test('both functions should return max for random close to 1', () => {
    mockRandom(0.9999)

    expect(getRandomPercentageWidth(20, 80)).toBe('80%')
    expect(getRandomPixelWidth(20, 80)).toBe('80px')
  })

  test('both functions should handle same range', () => {
    const results: Array<{ percentage: string; pixel: string }> = []

    for (let i = 0; i <= 10; i++) {
      mockRandom(i / 10)
      results.push({
        percentage: getRandomPercentageWidth(0, 100),
        pixel: getRandomPixelWidth(0, 100)
      })
    }

    results.forEach(({ percentage, pixel }) => {
      expect(parseInt(percentage)).toBe(parseInt(pixel))
    })
  })

  test('different suffixes for same numeric value', () => {
    mockRandom(0.5)

    const percentage = getRandomPercentageWidth(10, 90)
    const pixels = getRandomPixelWidth(10, 90)

    expect(percentage).toContain('%')
    expect(pixels).toContain('px')
    expect(percentage).not.toContain('px')
    expect(pixels).not.toContain('%')
  })
})

describe('Algorithm Correctness', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should use Math.floor for rounding', () => {
    mockRandom(0.5555)

    const result = getRandomPixelWidth(10, 90)
    const numericValue = parseInt(result)

    // With random 0.5555, range 10-90 (81 values)
    // Expected: 10 + Math.floor(0.5555 * 81) = 10 + 44 = 54
    expect(numericValue).toBe(54)
  })

  test('should calculate range correctly', () => {
    mockRandom(0.5)

    // Range: 10-90 (81 values)
    // Expected: 10 + Math.floor(0.5 * 81) = 10 + 40 = 50
    expect(getRandomPixelWidth(10, 90)).toBe('50px')

    // Range: 0-100 (101 values)
    // Expected: 0 + Math.floor(0.5 * 101) = 0 + 50 = 50
    expect(getRandomPixelWidth(0, 100)).toBe('50px')
  })

  test('should handle boundary calculation', () => {
    // Test min boundary
    mockRandom(0)
    expect(getRandomPixelWidth(5, 10)).toBe('5px')

    // Test max boundary (close to 1)
    mockRandom(0.99)
    expect(getRandomPixelWidth(5, 10)).toBe('10px')
  })

  test('should produce deterministic results with same random value', () => {
    mockRandom(0.7)

    const result1 = getRandomPixelWidth(10, 90)
    const result2 = getRandomPixelWidth(10, 90)

    expect(result1).toBe(result2)
  })
})
