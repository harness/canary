import { describe, expect, it } from 'vitest'

import { queryLoadingWhileEnabled } from '../query-loading'

describe('queryLoadingWhileEnabled', () => {
  it('returns false when the query is disabled even if isLoading is true (RQ v4 idle quirk)', () => {
    expect(queryLoadingWhileEnabled(false, { isLoading: true, isFetching: false })).toBe(false)
  })

  it('returns true when enabled and isLoading', () => {
    expect(queryLoadingWhileEnabled(true, { isLoading: true, isFetching: false })).toBe(true)
  })

  it('returns true when enabled and isFetching', () => {
    expect(queryLoadingWhileEnabled(true, { isLoading: false, isFetching: true })).toBe(true)
  })

  it('returns false when enabled and settled', () => {
    expect(queryLoadingWhileEnabled(true, { isLoading: false, isFetching: false })).toBe(false)
  })
})
