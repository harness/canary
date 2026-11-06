import { describe, expect, it } from 'vitest'

import { createRandomString, escapeSingleQuote, timeAgoFromISOTime } from '../utils'

describe('createRandomString', () => {
  it('returns a string of the requested length using only the allowed alphabet', () => {
    const result = createRandomString(32)

    expect(result).toHaveLength(32)
    expect(result).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('returns an empty string for length 0', () => {
    expect(createRandomString(0)).toBe('')
  })
})

describe('escapeSingleQuote', () => {
  it('escapes the first single quote with its HTML entity', () => {
    expect(escapeSingleQuote("it's")).toBe('it&#39;s')
  })

  it('leaves strings without a single quote untouched', () => {
    expect(escapeSingleQuote('no quotes here')).toBe('no quotes here')
  })
})

describe('timeAgoFromISOTime', () => {
  const now = Date.now()
  const isoFor = (secondsAgo: number) => new Date(now - secondsAgo * 1000).toISOString()

  it('formats differences across each time unit as a past event', () => {
    expect(timeAgoFromISOTime(isoFor(5))).toBe('5 seconds ago')
    expect(timeAgoFromISOTime(isoFor(2 * 60))).toBe('2 minutes ago')
    expect(timeAgoFromISOTime(isoFor(3 * 60 * 60))).toBe('3 hours ago')
    expect(timeAgoFromISOTime(isoFor(2 * 24 * 60 * 60))).toBe('2 days ago')
    expect(timeAgoFromISOTime(isoFor(2 * 30 * 24 * 60 * 60))).toBe('2 months ago')
    expect(timeAgoFromISOTime(isoFor(2 * 365 * 24 * 60 * 60))).toBe('2 years ago')
  })

  it('treats future timestamps as past events (absolute difference)', () => {
    const inTenSeconds = new Date(now + 10 * 1000).toISOString()
    expect(timeAgoFromISOTime(inTenSeconds)).toBe('10 seconds ago')
  })
})
