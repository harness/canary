import { describe, it } from 'vitest'

import { parseRangeQuery } from '../date-range-v2-filter-parser'
import type { CalendarUnit, RelativeUnit } from '../types'

const RELATIVE_UNITS: RelativeUnit[] = ['minute', 'hour', 'day', 'week', 'month', 'year']
const CALENDAR_UNITS: CalendarUnit[] = ['day', 'week', 'month', 'quarter', 'year']

const token = (unit: string, amount: number): string => {
  const word = unit.toUpperCase()
  return amount === 1 ? word : `${word}S`
}

describe('parseRangeQuery', () => {
  describe('relative', () => {
    it('reads last and next windows, with a singular unit when the amount is 1', () => {
      for (const unit of RELATIVE_UNITS) {
        expect(parseRangeQuery(`LAST_1_${token(unit, 1)}`)).toEqual({
          range: { kind: 'relative', direction: 'last', amount: 1, unit },
          timezone: 'UTC'
        })
        expect(parseRangeQuery(`NEXT_2_${token(unit, 2)}|Asia/Kolkata`)).toEqual({
          range: { kind: 'relative', direction: 'next', amount: 2, unit },
          timezone: 'Asia/Kolkata'
        })
      }
    })

    it('accepts a plural unit when the amount is 1', () => {
      expect(parseRangeQuery('LAST_1_DAYS|UTC')).toEqual({
        range: { kind: 'relative', direction: 'last', amount: 1, unit: 'day' },
        timezone: 'UTC'
      })
    })

    it('keeps a leading zero as that integer', () => {
      expect(parseRangeQuery('LAST_07_DAYS')?.range).toEqual({
        kind: 'relative',
        direction: 'last',
        amount: 7,
        unit: 'day'
      })
    })

    it('rejects an amount below 1', () => {
      expect(parseRangeQuery('LAST_0_DAYS')).toBeUndefined()
      expect(parseRangeQuery('NEXT_00_HOURS')).toBeUndefined()
    })
  })

  describe('this period', () => {
    it('reads a full period when the extent is omitted', () => {
      for (const unit of CALENDAR_UNITS) {
        expect(parseRangeQuery(`THIS_${token(unit, 1)}`)).toEqual({
          range: { kind: 'calendar', position: 'this', unit, extent: 'full' },
          timezone: 'UTC'
        })
      }
    })

    it('reads so far, from now, and the old full suffix', () => {
      expect(parseRangeQuery('THIS_MONTH_SO_FAR|LOCALE')).toEqual({
        range: { kind: 'calendar', position: 'this', unit: 'month', extent: 'so_far' },
        timezone: 'LOCALE'
      })
      expect(parseRangeQuery('THIS_QUARTER_FROM_NOW')).toEqual({
        range: { kind: 'calendar', position: 'this', unit: 'quarter', extent: 'from_now' },
        timezone: 'UTC'
      })
      expect(parseRangeQuery('THIS_MONTH_FULL|UTC')?.range).toEqual({
        kind: 'calendar',
        position: 'this',
        unit: 'month',
        extent: 'full'
      })
    })

    it('rejects a retired to-date suffix', () => {
      expect(parseRangeQuery('THIS_MONTH_TO_DATE')).toBeUndefined()
    })
  })

  describe('previous and next calendar periods', () => {
    it('reads an explicit calendar amount', () => {
      for (const unit of CALENDAR_UNITS) {
        expect(parseRangeQuery(`PREVIOUS_1_CALENDAR_${token(unit, 1)}`)).toEqual({
          range: { kind: 'calendar', position: 'previous', amount: 1, unit },
          timezone: 'UTC'
        })
        expect(parseRangeQuery(`NEXT_3_CALENDAR_${token(unit, 3)}|UTC`)).toEqual({
          range: { kind: 'calendar', position: 'next', amount: 3, unit },
          timezone: 'UTC'
        })
      }
    })

    it('reads LAST_WEEK and NEXT_MONTH as one calendar period', () => {
      for (const unit of CALENDAR_UNITS) {
        expect(parseRangeQuery(`LAST_${token(unit, 1)}`)).toEqual({
          range: { kind: 'calendar', position: 'previous', amount: 1, unit },
          timezone: 'UTC'
        })
        expect(parseRangeQuery(`NEXT_${token(unit, 1)}|Asia/Calcutta`)).toEqual({
          range: { kind: 'calendar', position: 'next', amount: 1, unit },
          timezone: 'Asia/Calcutta'
        })
      }
    })

    it('does not treat an amount-based query as the calendar alias', () => {
      expect(parseRangeQuery('LAST_7_DAYS')?.range).toEqual({
        kind: 'relative',
        direction: 'last',
        amount: 7,
        unit: 'day'
      })
      expect(parseRangeQuery('NEXT_1_MONTH')?.range).toEqual({
        kind: 'relative',
        direction: 'next',
        amount: 1,
        unit: 'month'
      })
    })

    it('rejects a previous period that omits CALENDAR', () => {
      expect(parseRangeQuery('PREVIOUS_1_MONTH')).toBeUndefined()
    })
  })

  describe('fixed', () => {
    const from = Date.parse('2026-09-05T09:30:00.000Z')
    const to = Date.parse('2026-10-05T09:30:00.000Z')

    it('turns epoch milliseconds into civil datetimes in the query timezone', () => {
      expect(parseRangeQuery(`FIXED|${from}|${to}`)).toEqual({
        range: { kind: 'fixed', from: '2026-09-05T09:30:00', to: '2026-10-05T09:30:00' },
        timezone: 'UTC'
      })
      expect(parseRangeQuery(`FIXED|${from}|${to}|Asia/Kolkata`)).toEqual({
        range: { kind: 'fixed', from: '2026-09-05T15:00:00', to: '2026-10-05T15:00:00' },
        timezone: 'Asia/Kolkata'
      })
    })

    it('keeps a negative epoch', () => {
      expect(parseRangeQuery('FIXED|-3600000|0')).toEqual({
        range: { kind: 'fixed', from: '1969-12-31T23:00:00', to: '1970-01-01T00:00:00' },
        timezone: 'UTC'
      })
    })

    it('returns the civil ends even when the later epoch is written first', () => {
      expect(parseRangeQuery(`FIXED|${to}|${from}|UTC`)?.range).toEqual({
        kind: 'fixed',
        from: '2026-10-05T09:30:00',
        to: '2026-09-05T09:30:00'
      })
    })

    it('rejects an epoch that is not a safe integer', () => {
      const unsafe = (BigInt(Number.MAX_SAFE_INTEGER) + 1n).toString()
      expect(parseRangeQuery(`FIXED|${unsafe}|${to}`)).toBeUndefined()
      expect(parseRangeQuery(`FIXED|${from}|${unsafe}`)).toBeUndefined()
    })

    it('rejects a non-numeric epoch and the wrong number of pieces', () => {
      expect(parseRangeQuery('FIXED|nope|1')).toBeUndefined()
      expect(parseRangeQuery(`FIXED|${from}`)).toBeUndefined()
      expect(parseRangeQuery(`FIXED|${from}|${to}|UTC|extra`)).toBeUndefined()
    })
  })

  describe('timezone and encoding', () => {
    it('uses UTC when the timezone piece is omitted', () => {
      expect(parseRangeQuery('THIS_DAY')?.timezone).toBe('UTC')
      expect(parseRangeQuery('LAST_7_DAYS')?.timezone).toBe('UTC')
    })

    it('decodes a URL-encoded rangeQuery once', () => {
      const encoded = encodeURIComponent('LAST_7_DAYS|Asia/Kolkata')
      expect(parseRangeQuery(encoded)).toEqual({
        range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
        timezone: 'Asia/Kolkata'
      })
      expect(parseRangeQuery(encodeURIComponent(encoded))).toBeUndefined()
    })

    it('rejects an empty query, a broken escape, and a trailing separator', () => {
      expect(parseRangeQuery('')).toBeUndefined()
      expect(parseRangeQuery('%')).toBeUndefined()
      expect(parseRangeQuery('THIS_MONTH|')).toBeUndefined()
      expect(parseRangeQuery('THIS_MONTH|UTC|extra')).toBeUndefined()
    })
  })

  describe('queries that are not a built-in range', () => {
    it('rejects lowercase grammar, surrounding space, and unknown ids', () => {
      expect(parseRangeQuery('last_7_days')).toBeUndefined()
      expect(parseRangeQuery(' LAST_7_DAYS')).toBeUndefined()
      expect(parseRangeQuery('NOPE')).toBeUndefined()
      expect(parseRangeQuery('CURRENT_MONTH')).toBeUndefined()
      expect(parseRangeQuery('Billing_Cycle|UTC')).toBeUndefined()
      expect(parseRangeQuery('[object Object]')).toBeUndefined()
    })
  })
})
