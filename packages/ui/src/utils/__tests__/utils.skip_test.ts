import { formatDate } from '..'

describe('formatDate', () => {
  it('should format a Unix timestamp to a localized date string', () => {
    const timestamp = 1642774800000
    const result = formatDate(timestamp)
    expect(result).toBe('Jan 21, 2022')
  })

  it('should format an ISO date string to a localized date string with full style', () => {
    const timestamp = '2022-01-21'
    const result = formatDate(timestamp, 'full')
    expect(result).toBe('Friday, January 21, 2022')
  })

  it('should return an empty string if timestamp is falsy', () => {
    const result = formatDate('')
    expect(result).toBe('')
  })

  it('should handle invalid date gracefully and return an empty string', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('')
  })
})
