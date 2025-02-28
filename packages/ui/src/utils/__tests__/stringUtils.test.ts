import { getInitials } from '../stringUtils'

describe('getInitials', () => {
  it('should return the initials of a single word', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('should return the initials of multiple words', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should return the initials truncated to the specified length', () => {
    expect(getInitials('John Doe', 1)).toBe('J')
    expect(getInitials('John Doe', 2)).toBe('JD')
    expect(getInitials('John Doe', 3)).toBe('JD')
  })

  it('should ignore extra spaces between words', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD')
  })

  it('should handle empty strings', () => {
    expect(getInitials('')).toBe('')
  })

  it('should handle names with more than two words', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
    expect(getInitials('John Michael Doe', 2)).toBe('JM')
  })

  it('should handle names with special characters', () => {
    expect(getInitials('John-Michael Doe')).toBe('JD')
  })
})
