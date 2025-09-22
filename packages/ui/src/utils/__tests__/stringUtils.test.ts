import { csvToObject, getInitials } from '../stringUtils'

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

describe('csvToObject', () => {
  it('should handle empty input', () => {
    expect(csvToObject('')).toEqual({})
    expect(csvToObject('   ')).toEqual({})
    expect(csvToObject(null as any)).toEqual({})
    expect(csvToObject(undefined as any)).toEqual({})
  })

  it('should handle single input', () => {
    expect(csvToObject('a')).toEqual({ a: 'a' })
  })

  it('should handle comma-separated input', () => {
    expect(csvToObject('a,b,c')).toEqual({ a: 'a', b: 'b', c: 'c' })
  })

  it('should handle key-value pairs', () => {
    expect(csvToObject('a:1,b:2,c:3')).toEqual({ a: '1', b: '2', c: '3' })
  })

  it('should handle mixed simple and key-value pairs', () => {
    expect(csvToObject('a,b:2,c')).toEqual({ a: 'a', b: '2', c: 'c' })
  })

  it('should trim whitespace from parts', () => {
    expect(csvToObject(' a , b , c ')).toEqual({ a: 'a', b: 'b', c: 'c' })
  })

  it('should filter out empty parts', () => {
    expect(csvToObject('a,,b,,c')).toEqual({ a: 'a', b: 'b', c: 'c' })
  })

  it('should handle duplicate keys with last occurrence winning', () => {
    expect(csvToObject('a:1,a:2,a:3')).toEqual({ a: '3' })
  })

  it('should handle duplicate simple values with last occurrence winning', () => {
    expect(csvToObject('a,a,a')).toEqual({ a: 'a' })
  })

  it('should handle mixed duplicates with last occurrence winning', () => {
    expect(csvToObject('a:1,a,b:2,b')).toEqual({ a: 'a', b: 'b' })
  })

  it('should handle case-sensitive keys', () => {
    expect(csvToObject('a:1,A:2')).toEqual({ a: '1', A: '2' })
  })

  it('should handle empty values in key-value pairs', () => {
    expect(csvToObject('a:,b:2')).toEqual({ a: '', b: '2' })
  })
})
