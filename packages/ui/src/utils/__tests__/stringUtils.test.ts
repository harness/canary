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
    expect(csvToObject('')).toEqual({ data: {}, metadata: {} })
    expect(csvToObject('   ')).toEqual({ data: {}, metadata: {} })
    expect(csvToObject(null as any)).toEqual({ data: {}, metadata: {} })
    expect(csvToObject(undefined as any)).toEqual({ data: {}, metadata: {} })
  })

  it('should handle single input', () => {
    expect(csvToObject('a')).toEqual({ data: { a: 'a' }, metadata: { a: false } })
  })

  it('should handle comma-separated input', () => {
    expect(csvToObject('a,b,c')).toEqual({
      data: { a: 'a', b: 'b', c: 'c' },
      metadata: { a: false, b: false, c: false }
    })
  })

  it('should handle key-value pairs', () => {
    expect(csvToObject('a:1,b:2,c:3')).toEqual({
      data: { a: '1', b: '2', c: '3' },
      metadata: { a: true, b: true, c: true }
    })
  })

  it('should handle mixed simple and key-value pairs', () => {
    expect(csvToObject('a,b:2,c')).toEqual({
      data: { a: 'a', b: '2', c: 'c' },
      metadata: { a: false, b: true, c: false }
    })
  })

  it('should trim whitespace from parts', () => {
    expect(csvToObject(' a , b , c ')).toEqual({
      data: { a: 'a', b: 'b', c: 'c' },
      metadata: { a: false, b: false, c: false }
    })
  })

  it('should filter out empty parts', () => {
    expect(csvToObject('a,,b,,c')).toEqual({
      data: { a: 'a', b: 'b', c: 'c' },
      metadata: { a: false, b: false, c: false }
    })
  })

  it('should handle duplicate keys with last occurrence winning', () => {
    expect(csvToObject('a:1,a:2,a:3')).toEqual({ data: { a: '3' }, metadata: { a: true } })
  })

  it('should handle duplicate simple values with last occurrence winning', () => {
    expect(csvToObject('a,a,a')).toEqual({ data: { a: 'a' }, metadata: { a: false } })
  })

  it('should handle mixed duplicates with last occurrence winning', () => {
    expect(csvToObject('a:1,a,b:2,b')).toEqual({ data: { a: 'a', b: 'b' }, metadata: { a: false, b: false } })
  })

  it('should handle case-sensitive keys', () => {
    expect(csvToObject('a:1,A:2')).toEqual({ data: { a: '1', A: '2' }, metadata: { a: true, A: true } })
  })

  it('should handle empty values in key-value pairs', () => {
    expect(csvToObject('a:,b:2')).toEqual({ data: { a: '', b: '2' }, metadata: { a: true, b: true } })
  })

  it('should handle key-value pairs where key and value are the same', () => {
    expect(csvToObject('abc:abc')).toEqual({ data: { abc: 'abc' }, metadata: { abc: true } })
  })

  it('should handle mixed cases with same key-value pairs', () => {
    expect(csvToObject('abc:abc,def:def')).toEqual({
      data: { abc: 'abc', def: 'def' },
      metadata: { abc: true, def: true }
    })
  })

  it('should handle URLs with multiple colons by splitting only at first colon', () => {
    expect(csvToObject('url:https://abc.com')).toEqual({
      data: { url: 'https://abc.com' },
      metadata: { url: true }
    })
  })

  it('should handle multiple colons in key-value pairs', () => {
    expect(csvToObject('a:b:c:d')).toEqual({
      data: { a: 'b:c:d' },
      metadata: { a: true }
    })
  })

  it('should handle tags starting with colon as simple tags', () => {
    expect(csvToObject(':a')).toEqual({
      data: { ':a': ':a' },
      metadata: { ':a': false }
    })
  })

  it('should handle mixed colon-prefixed tags and key-value pairs', () => {
    expect(csvToObject(':a,key:value,:b')).toEqual({
      data: { ':a': ':a', key: 'value', ':b': ':b' },
      metadata: { ':a': false, key: true, ':b': false }
    })
  })
})
