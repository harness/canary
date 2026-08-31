import { parseDateRangeQuery } from '../parse-date-range-query'

const options = {
  timeZone: 'UTC',
  now: new Date('2026-08-25T12:00:00.000Z')
}

describe('parseDateRangeQuery', () => {
  it.each([
    ['last 20 days', 'past', 20, 'day'],
    ['past 3 hours', 'past', 3, 'hour'],
    ['next 2 weeks', 'future', 2, 'week'],
    ['coming one quarter', 'future', 1, 'quarter']
  ] as const)('parses rolling query %s', (query, direction, amount, unit) => {
    expect(parseDateRangeQuery(query, options)).toMatchObject({
      kind: 'relative',
      direction,
      amount,
      unit,
      timeZone: 'UTC'
    })
  })

  it('parses a trailing exclusion as a rolling offset', () => {
    expect(parseDateRangeQuery('Last 20 days and exclude 2 days', options)).toEqual({
      kind: 'relative',
      direction: 'past',
      amount: 20,
      unit: 'day',
      timeZone: 'UTC',
      adjustment: { type: 'offset', offset: { amount: 2, unit: 'day' } }
    })
    expect(parseDateRangeQuery('last 20 days excluding the most recent 2 days', options)).toMatchObject({
      adjustment: { type: 'offset', offset: { amount: 2, unit: 'day' } }
    })
  })

  it.each([
    ['last 20 days excluding weekends', [0, 6]],
    ['last 20 days without monday and friday', [1, 5]]
  ] as const)('parses weekday exclusions in %s', (query, weekdays) => {
    expect(parseDateRangeQuery(query, options)).toMatchObject({
      adjustment: { type: 'exclude', exclude: { weekdays } }
    })
  })

  it('parses the current incomplete interval exclusion', () => {
    expect(parseDateRangeQuery('last 7 days excluding today', options)).toMatchObject({
      adjustment: { type: 'exclude', exclude: { incompleteInterval: true } }
    })
  })

  it.each([
    ['next month', 'next_month', undefined],
    ['month to date', 'this_month', 'to_now'],
    ['QTD', 'this_quarter', 'to_now'],
    ['previous year', 'last_year', undefined]
  ] as const)('parses calendar query %s', (query, period, extent) => {
    expect(parseDateRangeQuery(query, options)).toEqual({
      kind: 'calendar',
      period,
      ...(extent ? { extent } : {}),
      timeZone: 'UTC'
    })
  })

  it.each([
    ['today', '2026-08-25', '2026-08-25'],
    ['yesterday', '2026-08-24', '2026-08-24'],
    ['Aug 1 to Aug 15', '2026-08-01', '2026-08-15'],
    ['August 1st - August 15th', '2026-08-01', '2026-08-15'],
    ['since 2026-08-10', '2026-08-10', '2026-08-25']
  ] as const)('parses absolute query %s', (query, from, to) => {
    expect(parseDateRangeQuery(query, options)).toMatchObject({
      kind: 'absolute',
      from: { date: from },
      to: { date: to },
      timeZone: 'UTC'
    })
  })

  it('parses fixed endpoint times', () => {
    expect(parseDateRangeQuery('from Aug 1 at 9am to Aug 15 at 5:30pm', options)).toMatchObject({
      kind: 'absolute',
      from: { date: '2026-08-01', time: '09:00' },
      to: { date: '2026-08-15', time: '17:30' }
    })
  })

  it('returns a useful error for unsupported input', () => {
    expect(() => parseDateRangeQuery('whenever traffic was highest', options)).toThrow(/rolling range.*period.*dates/i)
  })
})
