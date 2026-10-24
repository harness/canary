import { describe, it } from 'vitest'

import {
  createDateRangeV2FilterParser,
  dateRangeV2FilterParser,
  migrateDateRangeV2RangeQuery,
  parseRangeQuery
} from '../date-range-v2-filter-parser'
import type {
  CalendarExtent,
  CalendarUnit,
  DateRangeV2Preset,
  RelativeUnit,
  ResolvableDateRangeV2,
  TimeZoneId
} from '../types'

const NOW = new Date('2026-10-05T15:30:00.000Z')
const RELATIVE_UNITS: RelativeUnit[] = ['minute', 'hour', 'day', 'week', 'month', 'year']
const CALENDAR_UNITS: CalendarUnit[] = ['day', 'week', 'month', 'quarter', 'year']
const EXTENTS: CalendarExtent[] = ['full', 'so_far', 'from_now']
const FROM = '2026-09-05T09:30:00'
const TO = '2026-10-05T09:30:00'

const token = (unit: string, amount: number): string => {
  const word = unit.toUpperCase()
  return amount === 1 ? word : `${word}S`
}

const extentToken = (extent: CalendarExtent): string => (extent === 'full' ? '' : `_${extent.toUpperCase()}`)

const preset = (
  value: string,
  getRange: DateRangeV2Preset['getRange'],
  extra?: Partial<Pick<DateRangeV2Preset, 'label' | 'group'>>
): DateRangeV2Preset => ({
  label: extra?.label ?? value,
  value,
  group: extra?.group ?? 'recommended',
  getRange
})

describe('parseRangeQuery', () => {
  describe('relative', () => {
    it('reads last and next for every relative unit', () => {
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

    it('accepts a plural unit when the amount is 1 and a singular unit when the amount is greater than 1', () => {
      expect(parseRangeQuery('LAST_1_DAYS|UTC')).toEqual({
        range: { kind: 'relative', direction: 'last', amount: 1, unit: 'day' },
        timezone: 'UTC'
      })
      expect(parseRangeQuery('NEXT_2_WEEK|LOCALE')).toEqual({
        range: { kind: 'relative', direction: 'next', amount: 2, unit: 'week' },
        timezone: 'LOCALE'
      })
    })

    it('keeps a leading zero as that integer', () => {
      expect(parseRangeQuery('LAST_07_DAYS')).toEqual({
        range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
        timezone: 'UTC'
      })
      expect(parseRangeQuery('NEXT_008_HOURS|UTC')?.range).toMatchObject({ amount: 8, unit: 'hour' })
    })

    it('rejects an amount below 1, a fraction, a sign, and a calendar-only unit', () => {
      expect(parseRangeQuery('LAST_0_DAYS')).toBeUndefined()
      expect(parseRangeQuery('NEXT_00_HOURS')).toBeUndefined()
      expect(parseRangeQuery('LAST_1.5_DAYS')).toBeUndefined()
      expect(parseRangeQuery('LAST_+7_DAYS')).toBeUndefined()
      expect(parseRangeQuery('LAST_-1_DAYS')).toBeUndefined()
      expect(parseRangeQuery('LAST_1_QUARTER')).toBeUndefined()
      expect(parseRangeQuery('NEXT_1_QUARTERS')).toBeUndefined()
    })

    it('keeps the timezone characters exactly, including a zone that is not an IANA id', () => {
      expect(parseRangeQuery('LAST_7_DAYS|UTC')?.timezone).toBe('UTC')
      expect(parseRangeQuery('LAST_7_DAYS|Asia/Calcutta')?.timezone).toBe('Asia/Calcutta')
      expect(parseRangeQuery('LAST_7_DAYS|Not/AZone')?.timezone).toBe('Not/AZone')
      expect(parseRangeQuery('LAST_7_DAYS| ')?.timezone).toBe(' ')
    })
  })

  describe('this period', () => {
    it('reads every unit with every extent', () => {
      for (const unit of CALENDAR_UNITS) {
        for (const extent of EXTENTS) {
          expect(parseRangeQuery(`THIS_${token(unit, 1)}${extentToken(extent)}|Asia/Kolkata`)).toEqual({
            range: { kind: 'calendar', position: 'this', unit, extent },
            timezone: 'Asia/Kolkata'
          })
        }
      }
    })

    it('reads a full period when the extent is omitted, including a plural unit', () => {
      expect(parseRangeQuery('THIS_MONTH')).toEqual({
        range: { kind: 'calendar', position: 'this', unit: 'month', extent: 'full' },
        timezone: 'UTC'
      })
      expect(parseRangeQuery('THIS_MONTHS_SO_FAR')).toEqual({
        range: { kind: 'calendar', position: 'this', unit: 'month', extent: 'so_far' },
        timezone: 'UTC'
      })
      expect(parseRangeQuery('THIS_DAYS_FROM_NOW|LOCALE')).toEqual({
        range: { kind: 'calendar', position: 'this', unit: 'day', extent: 'from_now' },
        timezone: 'LOCALE'
      })
    })

    it('rejects the old full suffix, a retired to-date suffix, and a relative unit', () => {
      expect(parseRangeQuery('THIS_MONTH_FULL|UTC')).toBeUndefined()
      expect(parseRangeQuery('THIS_MONTH_TO_DATE')).toBeUndefined()
      expect(parseRangeQuery('THIS_MONTH_SOFAR')).toBeUndefined()
      expect(parseRangeQuery('THIS_HOUR')).toBeUndefined()
      expect(parseRangeQuery('THIS_MINUTE_SO_FAR')).toBeUndefined()
    })
  })

  describe('previous and next calendar periods', () => {
    it('reads an explicit calendar amount for every unit', () => {
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

    it('accepts a plural unit when the amount is 1 and a singular unit when the amount is greater than 1', () => {
      expect(parseRangeQuery('PREVIOUS_1_CALENDAR_MONTHS|Asia/Kolkata')).toEqual({
        range: { kind: 'calendar', position: 'previous', amount: 1, unit: 'month' },
        timezone: 'Asia/Kolkata'
      })
      expect(parseRangeQuery('NEXT_2_CALENDAR_QUARTER')).toEqual({
        range: { kind: 'calendar', position: 'next', amount: 2, unit: 'quarter' },
        timezone: 'UTC'
      })
    })

    it('keeps a leading zero and rejects an amount below 1', () => {
      expect(parseRangeQuery('PREVIOUS_07_CALENDAR_DAYS')?.range).toMatchObject({ amount: 7, unit: 'day' })
      expect(parseRangeQuery('PREVIOUS_0_CALENDAR_MONTHS')).toBeUndefined()
      expect(parseRangeQuery('NEXT_00_CALENDAR_YEARS')).toBeUndefined()
    })

    it('rejects the previous calendar form written on main and the default DateRange preset ids', () => {
      expect(parseRangeQuery('LAST_1_CALENDAR_MONTH')).toBeUndefined()
      expect(parseRangeQuery('LAST_2_CALENDAR_MONTHS|UTC')).toBeUndefined()
      expect(parseRangeQuery('CURRENT_MONTH')).toBeUndefined()
      expect(parseRangeQuery('LAST_MONTH|UTC')).toBeUndefined()
      expect(parseRangeQuery('LAST_QUARTER')).toBeUndefined()
      expect(parseRangeQuery('LAST_YEAR|Asia/Kolkata')).toBeUndefined()
    })

    it('rejects an amount-less period and a previous period that omits CALENDAR', () => {
      expect(parseRangeQuery('LAST_WEEK')).toBeUndefined()
      expect(parseRangeQuery('NEXT_MONTH')).toBeUndefined()
      expect(parseRangeQuery('PREVIOUS_1_MONTH')).toBeUndefined()
      expect(parseRangeQuery('NEXT_DAY')).toBeUndefined()
      expect(parseRangeQuery('PREVIOUS_1_CALENDAR_MINUTE')).toBeUndefined()
      expect(parseRangeQuery('PREVIOUS_1_CALENDAR_HOUR')).toBeUndefined()
    })

    it('reads NEXT_1_DAY as a relative day, because an amount without CALENDAR is a rolling window', () => {
      expect(parseRangeQuery('NEXT_1_DAY')).toEqual({
        range: { kind: 'relative', direction: 'next', amount: 1, unit: 'day' },
        timezone: 'UTC'
      })
    })

    it('keeps an amount-based query relative', () => {
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
      expect(parseRangeQuery('LAST_12_MONTHS')?.range).toEqual({
        kind: 'relative',
        direction: 'last',
        amount: 12,
        unit: 'month'
      })
    })
  })

  describe('fixed', () => {
    it('keeps the civil datetimes and the query timezone', () => {
      expect(parseRangeQuery(`FIXED|${FROM}|${TO}`)).toEqual({
        range: { kind: 'fixed', from: FROM, to: TO },
        timezone: 'UTC'
      })
      expect(parseRangeQuery(`FIXED|${FROM}|${TO}|Asia/Kolkata`)).toEqual({
        range: { kind: 'fixed', from: FROM, to: TO },
        timezone: 'Asia/Kolkata'
      })
      expect(parseRangeQuery(`FIXED|${FROM}|${TO}|LOCALE`)?.timezone).toBe('LOCALE')
      expect(parseRangeQuery(`FIXED|${FROM}|${TO}|Not/AZone`)?.timezone).toBe('Not/AZone')
    })

    it('accepts a real leap day and equal ends, and returns the ends in the order they were written', () => {
      expect(parseRangeQuery('FIXED|2024-02-29T00:00:00|2024-02-29T23:59:59')?.range).toEqual({
        kind: 'fixed',
        from: '2024-02-29T00:00:00',
        to: '2024-02-29T23:59:59'
      })
      expect(parseRangeQuery(`FIXED|${FROM}|${FROM}|UTC`)?.range).toEqual({ kind: 'fixed', from: FROM, to: FROM })
      expect(parseRangeQuery(`FIXED|${TO}|${FROM}|UTC`)?.range).toEqual({ kind: 'fixed', from: TO, to: FROM })
    })

    it('decodes a URL-encoded fixed query once', () => {
      const encoded = encodeURIComponent(`FIXED|${FROM}|${TO}|Asia/Kolkata`)
      expect(parseRangeQuery(encoded)).toEqual({
        range: { kind: 'fixed', from: FROM, to: TO },
        timezone: 'Asia/Kolkata'
      })
      expect(parseRangeQuery(encodeURIComponent(encoded))).toBeUndefined()
    })

    it('rejects an invalid civil datetime, epoch milliseconds, and the wrong number of pieces', () => {
      expect(parseRangeQuery('FIXED|2026-02-30T00:00:00|2026-03-01T00:00:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-02-29T00:00:00|2026-03-01T00:00:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-04-31T00:00:00|2026-05-01T00:00:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-13-01T00:00:00|2026-13-02T00:00:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-00-01T00:00:00|2026-01-02T00:00:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-01-00T00:00:00|2026-01-02T00:00:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-09-05T24:00:00|2026-09-06T00:00:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-09-05T09:60:00|2026-09-06T00:00:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-09-05T09:30:60|2026-09-06T00:00:00')).toBeUndefined()
      expect(parseRangeQuery(`FIXED|${FROM.slice(0, 16)}|${TO}`)).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-09-05T09:30:00.000|2026-10-05T09:30:00.000')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-09-05T09:30:00Z|2026-10-05T09:30:00Z')).toBeUndefined()
      expect(parseRangeQuery('FIXED|2026-09-05 09:30:00|2026-10-05 09:30:00')).toBeUndefined()
      expect(parseRangeQuery('FIXED|1788201000000|1788978600000')).toBeUndefined()
      expect(parseRangeQuery('FIXED|nope|1')).toBeUndefined()
      expect(parseRangeQuery(`FIXED|${FROM}`)).toBeUndefined()
      expect(parseRangeQuery('FIXED')).toBeUndefined()
      expect(parseRangeQuery(`FIXED|${FROM}|${TO}|UTC|extra`)).toBeUndefined()
    })
  })

  describe('timezone and encoding', () => {
    it('uses UTC when the timezone piece is omitted', () => {
      expect(parseRangeQuery('THIS_DAY')?.timezone).toBe('UTC')
      expect(parseRangeQuery('LAST_7_DAYS')?.timezone).toBe('UTC')
      expect(parseRangeQuery('PREVIOUS_1_CALENDAR_WEEK')?.timezone).toBe('UTC')
      expect(parseRangeQuery(`FIXED|${FROM}|${TO}`)?.timezone).toBe('UTC')
    })

    it('decodes a URL-encoded rangeQuery once', () => {
      const encoded = encodeURIComponent('LAST_7_DAYS|Asia/Kolkata')
      expect(parseRangeQuery(encoded)).toEqual({
        range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
        timezone: 'Asia/Kolkata'
      })
      expect(parseRangeQuery('LAST_7_DAYS%7CUTC')).toEqual({
        range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
        timezone: 'UTC'
      })
      expect(parseRangeQuery(encodeURIComponent(encoded))).toBeUndefined()
    })

    it('rejects an empty query, a broken escape, a trailing separator, and an extra piece', () => {
      expect(parseRangeQuery('')).toBeUndefined()
      expect(parseRangeQuery('%')).toBeUndefined()
      expect(parseRangeQuery('%ZZ')).toBeUndefined()
      expect(parseRangeQuery('THIS_MONTH|')).toBeUndefined()
      expect(parseRangeQuery('LAST_7_DAYS|')).toBeUndefined()
      expect(parseRangeQuery('THIS_MONTH|UTC|extra')).toBeUndefined()
      expect(parseRangeQuery('LAST_7_DAYS||UTC')).toBeUndefined()
    })
  })

  describe('queries that are not a built-in range', () => {
    it('rejects lowercase grammar, surrounding space, and unknown ids', () => {
      expect(parseRangeQuery('last_7_days')).toBeUndefined()
      expect(parseRangeQuery('Last_7_Days')).toBeUndefined()
      expect(parseRangeQuery(' LAST_7_DAYS')).toBeUndefined()
      expect(parseRangeQuery('LAST_7_DAYS ')).toBeUndefined()
      expect(parseRangeQuery('LAST_7_DAYS\n')).toBeUndefined()
      expect(parseRangeQuery('fixed|2026-09-05T09:30:00|2026-10-05T09:30:00')).toBeUndefined()
      expect(parseRangeQuery('NOPE')).toBeUndefined()
      expect(parseRangeQuery('Billing_Cycle|UTC')).toBeUndefined()
      expect(parseRangeQuery('[object Object]')).toBeUndefined()
    })
  })
})

describe('migrateDateRangeV2RangeQuery', () => {
  it('leaves a current rangeQuery unchanged', () => {
    const current = [
      'LAST_7_DAYS|UTC',
      'NEXT_1_MONTH',
      'THIS_MONTH_SO_FAR',
      'THIS_MONTH_FROM_NOW|LOCALE',
      'PREVIOUS_2_CALENDAR_MONTHS|UTC',
      'NEXT_1_CALENDAR_WEEK|UTC',
      `FIXED|${FROM}|${TO}|UTC`,
      'Billing_Cycle|UTC'
    ]
    for (const query of current) {
      expect(migrateDateRangeV2RangeQuery(query)).toBe(query)
    }
  })

  it('rewrites the previous calendar form written on main and drops the plural S', () => {
    for (const unit of CALENDAR_UNITS) {
      expect(migrateDateRangeV2RangeQuery(`LAST_1_CALENDAR_${token(unit, 1)}|UTC`)).toBe(
        `PREVIOUS_1_CALENDAR_${token(unit, 1)}|UTC`
      )
      expect(migrateDateRangeV2RangeQuery(`LAST_2_CALENDAR_${token(unit, 2)}`)).toBe(
        `PREVIOUS_2_CALENDAR_${unit.toUpperCase()}`
      )
    }
    expect(migrateDateRangeV2RangeQuery('LAST_07_CALENDAR_DAYS|Asia/Kolkata')).toBe(
      'PREVIOUS_07_CALENDAR_DAY|Asia/Kolkata'
    )
    expect(migrateDateRangeV2RangeQuery('LAST_0_CALENDAR_MONTHS')).toBe('PREVIOUS_0_CALENDAR_MONTH')
  })

  it('drops the old full suffix, including a plural unit', () => {
    for (const unit of CALENDAR_UNITS) {
      expect(migrateDateRangeV2RangeQuery(`THIS_${token(unit, 1)}_FULL`)).toBe(`THIS_${token(unit, 1)}`)
      expect(migrateDateRangeV2RangeQuery(`THIS_${token(unit, 2)}_FULL|UTC`)).toBe(`THIS_${unit.toUpperCase()}|UTC`)
    }
  })

  it('rewrites default DateRange preset ids that are not the current query', () => {
    for (const unit of CALENDAR_UNITS) {
      expect(migrateDateRangeV2RangeQuery(`CURRENT_${token(unit, 1)}`)).toBe(`THIS_${token(unit, 1)}`)
      expect(migrateDateRangeV2RangeQuery(`CURRENT_${token(unit, 2)}|UTC`)).toBe(`THIS_${unit.toUpperCase()}|UTC`)
    }
    expect(migrateDateRangeV2RangeQuery('LAST_MONTH|UTC')).toBe('PREVIOUS_1_CALENDAR_MONTH|UTC')
    expect(migrateDateRangeV2RangeQuery('LAST_QUARTER')).toBe('PREVIOUS_1_CALENDAR_QUARTER')
    expect(migrateDateRangeV2RangeQuery('LAST_YEAR|Asia/Kolkata')).toBe('PREVIOUS_1_CALENDAR_YEAR|Asia/Kolkata')
  })

  it('keeps rolling preset ids and amount-less periods that are not month, quarter, or year', () => {
    expect(migrateDateRangeV2RangeQuery('LAST_7_DAYS')).toBe('LAST_7_DAYS')
    expect(migrateDateRangeV2RangeQuery('LAST_30_DAYS|UTC')).toBe('LAST_30_DAYS|UTC')
    expect(migrateDateRangeV2RangeQuery('LAST_3_MONTHS')).toBe('LAST_3_MONTHS')
    expect(migrateDateRangeV2RangeQuery('LAST_12_MONTHS')).toBe('LAST_12_MONTHS')
    expect(migrateDateRangeV2RangeQuery('THIS_MONTH')).toBe('THIS_MONTH')
    expect(migrateDateRangeV2RangeQuery('LAST_WEEK')).toBe('LAST_WEEK')
    expect(migrateDateRangeV2RangeQuery('LAST_DAY|UTC')).toBe('LAST_DAY|UTC')
    expect(migrateDateRangeV2RangeQuery('NEXT_MONTH')).toBe('NEXT_MONTH')
  })

  it('turns the old fixed epoch query into civil datetimes', () => {
    const from = Date.parse('2026-09-05T09:30:00.000Z')
    const to = Date.parse('2026-10-05T09:30:00.000Z')
    expect(migrateDateRangeV2RangeQuery(`CUSTOM|${from}|${to}|UTC`)).toBe(`FIXED|${FROM}|${TO}|UTC`)
    expect(migrateDateRangeV2RangeQuery(`CUSTOM|${from}|${to}`)).toBe(`FIXED|${FROM}|${TO}|UTC`)
    expect(migrateDateRangeV2RangeQuery(`CUSTOM|${from}|${to}|Asia/Kolkata`)).toBe(
      'FIXED|2026-09-05T15:00:00|2026-10-05T15:00:00|Asia/Kolkata'
    )
    expect(migrateDateRangeV2RangeQuery('CUSTOM|-1000|0|UTC')).toBe('FIXED|1969-12-31T23:59:59|1970-01-01T00:00:00|UTC')
    expect(migrateDateRangeV2RangeQuery(`CUSTOM|${to}|${from}|UTC`)).toBe(`FIXED|${TO}|${FROM}|UTC`)
  })

  it('leaves a broken custom query, a trailing separator, and an unknown id unchanged', () => {
    expect(migrateDateRangeV2RangeQuery('CUSTOM|nope|1')).toBe('CUSTOM|nope|1')
    expect(migrateDateRangeV2RangeQuery('CUSTOM|1|2|UTC|extra')).toBe('CUSTOM|1|2|UTC|extra')
    expect(migrateDateRangeV2RangeQuery('CUSTOM|9007199254740993|1|UTC')).toBe('CUSTOM|9007199254740993|1|UTC')
    expect(migrateDateRangeV2RangeQuery('CURRENT_MONTH|')).toBe('CURRENT_MONTH|')
    expect(migrateDateRangeV2RangeQuery('THIS_MONTH_FULL|')).toBe('THIS_MONTH_FULL|')
    expect(migrateDateRangeV2RangeQuery('LAST_1_CALENDAR_MINUTE')).toBe('LAST_1_CALENDAR_MINUTE')
    expect(migrateDateRangeV2RangeQuery('NOPE')).toBe('NOPE')
  })

  it('decodes once, and returns the original string when the escape is broken or the query is empty', () => {
    expect(migrateDateRangeV2RangeQuery(encodeURIComponent('LAST_MONTH|Asia/Kolkata'))).toBe(
      'PREVIOUS_1_CALENDAR_MONTH|Asia/Kolkata'
    )
    expect(migrateDateRangeV2RangeQuery(encodeURIComponent('THIS_MONTH_FULL|UTC'))).toBe('THIS_MONTH|UTC')
    const twice = encodeURIComponent(encodeURIComponent('LAST_MONTH|UTC'))
    expect(migrateDateRangeV2RangeQuery(twice)).toBe(decodeURIComponent(twice))
    expect(migrateDateRangeV2RangeQuery('')).toBe('')
    expect(migrateDateRangeV2RangeQuery('%')).toBe('%')
  })
})

describe('dateRangeV2FilterParser', () => {
  const parse = (rangeQuery: string) => dateRangeV2FilterParser.parse(rangeQuery, NOW)

  const value = (range: ResolvableDateRangeV2, timezone?: TimeZoneId) => ({ range, timezone })

  it('fills from and to for a relative, calendar, and fixed range', () => {
    expect(parse('LAST_7_DAYS')).toEqual({
      range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
      timezone: 'UTC',
      from: new Date('2026-09-28T15:30:00.000Z'),
      to: NOW
    })
    expect(parse('LAST_1_HOUR|UTC')).toMatchObject({
      from: new Date('2026-10-05T14:30:00.000Z'),
      to: NOW
    })
    expect(parse('LAST_30_MINUTES')).toMatchObject({
      from: new Date('2026-10-05T15:00:00.000Z'),
      to: NOW
    })
    expect(parse('NEXT_1_DAY')).toMatchObject({
      from: NOW,
      to: new Date('2026-10-06T15:30:00.000Z')
    })
    expect(parse('THIS_MONTH')).toEqual({
      range: { kind: 'calendar', position: 'this', unit: 'month', extent: 'full' },
      timezone: 'UTC',
      from: new Date('2026-10-01T00:00:00.000Z'),
      to: new Date('2026-10-31T23:59:59.999Z')
    })
    expect(parse('THIS_MONTH_SO_FAR')).toMatchObject({
      from: new Date('2026-10-01T00:00:00.000Z'),
      to: NOW
    })
    expect(parse('THIS_MONTH_FROM_NOW')).toMatchObject({
      from: NOW,
      to: new Date('2026-10-31T23:59:59.999Z')
    })
    expect(parse('THIS_DAY')).toMatchObject({
      from: new Date('2026-10-05T00:00:00.000Z'),
      to: new Date('2026-10-05T23:59:59.999Z')
    })
    expect(parse('PREVIOUS_1_CALENDAR_WEEK')).toEqual({
      range: { kind: 'calendar', position: 'previous', amount: 1, unit: 'week' },
      timezone: 'UTC',
      from: new Date('2026-09-28T00:00:00.000Z'),
      to: new Date('2026-10-04T23:59:59.999Z')
    })
    expect(parse('PREVIOUS_1_CALENDAR_QUARTER')).toMatchObject({
      from: new Date('2026-07-01T00:00:00.000Z'),
      to: new Date('2026-09-30T23:59:59.999Z')
    })
    expect(parse('PREVIOUS_1_CALENDAR_YEAR')).toMatchObject({
      from: new Date('2025-01-01T00:00:00.000Z'),
      to: new Date('2025-12-31T23:59:59.999Z')
    })
    expect(parse('NEXT_2_CALENDAR_MONTHS')).toMatchObject({
      from: new Date('2026-11-01T00:00:00.000Z'),
      to: new Date('2026-12-31T23:59:59.999Z')
    })
    expect(parse('NEXT_1_CALENDAR_DAY')).toMatchObject({
      from: new Date('2026-10-06T00:00:00.000Z'),
      to: new Date('2026-10-06T23:59:59.999Z')
    })
    expect(parse(`FIXED|${FROM}|${TO}`)).toEqual({
      range: { kind: 'fixed', from: FROM, to: TO },
      timezone: 'UTC',
      from: new Date('2026-09-05T09:30:00.000Z'),
      to: new Date('2026-10-05T09:30:00.000Z')
    })
    expect(parse(`FIXED|${FROM}|${FROM}`)).toMatchObject({
      from: new Date('2026-09-05T09:30:00.000Z'),
      to: new Date('2026-09-05T09:30:00.000Z')
    })
  })

  it('resolves a calendar day in the query timezone', () => {
    expect(parse('PREVIOUS_1_CALENDAR_DAY|Asia/Kolkata')).toMatchObject({
      timezone: 'Asia/Kolkata',
      from: new Date('2026-10-03T18:30:00.000Z'),
      to: new Date('2026-10-04T18:29:59.999Z')
    })
    expect(parse('THIS_MONTH|Asia/Kolkata')).toMatchObject({
      from: new Date('2026-09-30T18:30:00.000Z'),
      to: new Date('2026-10-31T18:29:59.999Z')
    })
    expect(parse(`FIXED|${FROM}|${TO}|Asia/Kolkata`)).toMatchObject({
      timezone: 'Asia/Kolkata',
      from: new Date('2026-09-05T04:00:00.000Z'),
      to: new Date('2026-10-05T04:00:00.000Z')
    })
  })

  it('keeps an unrecognized timezone token and resolves the epochs in UTC', () => {
    const parsed = parse('LAST_7_DAYS|Not/AZone')
    expect(parsed?.timezone).toBe('Not/AZone')
    expect(parsed?.from).toEqual(new Date('2026-09-28T15:30:00.000Z'))
    expect(parsed?.to).toEqual(NOW)
  })

  it('reads a legacy rangeQuery after migration, then resolves it', () => {
    expect(parse('THIS_MONTH_FULL|UTC')).toEqual(parse('THIS_MONTH|UTC'))
    expect(parse('CURRENT_WEEK')).toEqual(parse('THIS_WEEK'))
    expect(parse('CURRENT_MONTHS|Asia/Kolkata')).toEqual(parse('THIS_MONTH|Asia/Kolkata'))
    expect(parse('LAST_MONTH|LOCALE')?.range).toEqual({
      kind: 'calendar',
      position: 'previous',
      amount: 1,
      unit: 'month'
    })
    expect(parse('LAST_QUARTER')).toEqual(parse('PREVIOUS_1_CALENDAR_QUARTER'))
    expect(parse('LAST_YEAR|UTC')).toEqual(parse('PREVIOUS_1_CALENDAR_YEAR|UTC'))
    expect(parse('LAST_2_CALENDAR_MONTHS')).toEqual(parse('PREVIOUS_2_CALENDAR_MONTH'))
    expect(parse('LAST_2_CALENDAR_MONTHS')).toMatchObject({
      from: new Date('2026-08-01T00:00:00.000Z'),
      to: new Date('2026-09-30T23:59:59.999Z')
    })
    expect(parse('LAST_1_MONTH')).toMatchObject({
      range: { kind: 'relative', direction: 'last', amount: 1, unit: 'month' },
      from: new Date('2026-09-05T15:30:00.000Z'),
      to: NOW
    })

    const from = Date.parse('2026-09-05T09:30:00.000Z')
    const to = Date.parse('2026-10-05T09:30:00.000Z')
    expect(parse(`CUSTOM|${from}|${to}|UTC`)).toEqual(parse(`FIXED|${FROM}|${TO}|UTC`))
    expect(parse(`CUSTOM|${from}|${to}|Asia/Kolkata`)).toEqual(
      parse('FIXED|2026-09-05T15:00:00|2026-10-05T15:00:00|Asia/Kolkata')
    )
  })

  it('rejects a legacy amount of 0 after rewriting it, and rejects a query migration does not know', () => {
    expect(parse('LAST_0_CALENDAR_MONTHS')).toBeUndefined()
    expect(parse('LAST_WEEK')).toBeUndefined()
    expect(parse('CUSTOM|nope|1')).toBeUndefined()
    expect(parse('CUSTOM|9007199254740993|1')).toBeUndefined()
    expect(parse('THIS_MONTH_TO_DATE')).toBeUndefined()
    expect(parse('')).toBeUndefined()
    expect(parse('%')).toBeUndefined()
    expect(parse('NOPE')).toBeUndefined()
    expect(parse('Billing_Cycle|UTC')).toBeUndefined()
  })

  it('throws when the fixed ends are reversed', () => {
    expect(() => parse(`FIXED|${TO}|${FROM}|UTC`)).toThrow(RangeError)
    const from = Date.parse('2026-10-05T09:30:00.000Z')
    const to = Date.parse('2026-09-05T09:30:00.000Z')
    expect(() => parse(`CUSTOM|${from}|${to}|UTC`)).toThrow(RangeError)
  })

  it('writes every range with the current grammar and always appends a timezone', () => {
    for (const unit of RELATIVE_UNITS) {
      expect(dateRangeV2FilterParser.serialize(value({ kind: 'relative', direction: 'last', amount: 1, unit }))).toBe(
        `LAST_1_${token(unit, 1)}|UTC`
      )
      expect(
        dateRangeV2FilterParser.serialize(
          value({ kind: 'relative', direction: 'next', amount: 2, unit }, 'Asia/Kolkata')
        )
      ).toBe(`NEXT_2_${token(unit, 2)}|Asia/Kolkata`)
    }

    for (const unit of CALENDAR_UNITS) {
      for (const extent of EXTENTS) {
        expect(
          dateRangeV2FilterParser.serialize(value({ kind: 'calendar', position: 'this', unit, extent }, 'LOCALE'))
        ).toBe(`THIS_${token(unit, 1)}${extentToken(extent)}|LOCALE`)
      }
      expect(
        dateRangeV2FilterParser.serialize(value({ kind: 'calendar', position: 'previous', amount: 1, unit }))
      ).toBe(`PREVIOUS_1_CALENDAR_${token(unit, 1)}|UTC`)
      expect(
        dateRangeV2FilterParser.serialize(
          value({ kind: 'calendar', position: 'next', amount: 3, unit }, 'Asia/Kolkata')
        )
      ).toBe(`NEXT_3_CALENDAR_${token(unit, 3)}|Asia/Kolkata`)
    }

    expect(dateRangeV2FilterParser.serialize(value({ kind: 'fixed', from: FROM, to: TO }))).toBe(
      `FIXED|${FROM}|${TO}|UTC`
    )
    expect(dateRangeV2FilterParser.serialize(value({ kind: 'fixed', from: TO, to: FROM }, 'Asia/Kolkata'))).toBe(
      `FIXED|${TO}|${FROM}|Asia/Kolkata`
    )
  })

  it('writes UTC when the stored timezone is omitted or empty', () => {
    const range: ResolvableDateRangeV2 = { kind: 'relative', direction: 'last', amount: 1, unit: 'month' }
    expect(dateRangeV2FilterParser.serialize({ range })).toBe('LAST_1_MONTH|UTC')
    expect(dateRangeV2FilterParser.serialize({ range, timezone: '' })).toBe('LAST_1_MONTH|UTC')
  })

  it('round-trips a serialized query back to the same resolved value', () => {
    const stored = [
      value({ kind: 'relative', direction: 'last', amount: 7, unit: 'day' }, 'Asia/Kolkata'),
      value({ kind: 'relative', direction: 'next', amount: 1, unit: 'hour' }),
      value({ kind: 'calendar', position: 'this', unit: 'quarter', extent: 'so_far' }, 'LOCALE'),
      value({ kind: 'calendar', position: 'this', unit: 'year', extent: 'from_now' }),
      value({ kind: 'calendar', position: 'previous', amount: 2, unit: 'month' }),
      value({ kind: 'calendar', position: 'next', amount: 1, unit: 'week' }, 'Asia/Kolkata'),
      value({ kind: 'fixed', from: FROM, to: TO }, 'UTC')
    ]
    for (const item of stored) {
      const resolved = dateRangeV2FilterParser.parse(dateRangeV2FilterParser.serialize(item), NOW)
      expect(resolved?.range).toEqual(item.range)
      expect(resolved?.timezone).toBe(item.timezone ?? 'UTC')
      expect(resolved?.from).toBeInstanceOf(Date)
      expect(resolved?.to).toBeInstanceOf(Date)
    }
  })

  it('serializes a migrated value with the current grammar', () => {
    const lastMonth = parse('LAST_MONTH|LOCALE')
    expect(lastMonth && dateRangeV2FilterParser.serialize(lastMonth)).toBe('PREVIOUS_1_CALENDAR_MONTH|LOCALE')
    const full = parse('THIS_YEAR_FULL')
    expect(full && dateRangeV2FilterParser.serialize(full)).toBe('THIS_YEAR|UTC')
    const current = parse('CURRENT_DAY|Asia/Kolkata')
    expect(current && dateRangeV2FilterParser.serialize(current)).toBe('THIS_DAY|Asia/Kolkata')
  })
})

describe('createDateRangeV2FilterParser', () => {
  const billingFrom = new Date('2026-01-31T00:00:00.000Z')
  const billingTo = new Date('2026-01-01T00:00:00.000Z')
  const localFrom = new Date('2026-10-01T00:00:00.000Z')
  const localTo = new Date('2026-10-07T00:00:00.000Z')

  const parserFor = (presets: readonly DateRangeV2Preset[]) =>
    createDateRangeV2FilterParser({ modes: [{ mode: 'presets', presets }] })

  const billing = preset('Billing_Cycle', () => ({ from: billingFrom, to: billingTo }), { label: 'Billing cycle' })
  const parser = parserFor([
    billing,
    preset('LAST_7_DAYS', () => ({ from: localFrom, to: localTo }), { label: 'Last 7 days' }),
    preset('   ', () => ({ from: localFrom, to: localTo }), { label: 'Blank value' }),
    preset('BROKEN', undefined as unknown as DateRangeV2Preset['getRange'], { label: 'Broken' }),
    preset('NO_LABEL', () => ({ from: localFrom, to: localTo }), { label: '   ' }),
    preset('BAD_GROUP', () => ({ from: localFrom, to: localTo }), {
      group: 'other' as DateRangeV2Preset['group']
    })
  ])

  it('reloads a configured preset through getRange and keeps the configured id', () => {
    expect(parser.parse('Billing_Cycle|Asia/Kolkata', NOW)).toEqual({
      from: billingTo,
      to: billingFrom,
      range: { kind: 'preset', preset: 'Billing_Cycle' },
      timezone: 'Asia/Kolkata'
    })
    expect(parser.parse('Billing_Cycle', NOW)?.timezone).toBe('UTC')
    expect(parser.parse('Billing_Cycle|', NOW)?.timezone).toBe('UTC')
    expect(parser.parse('billing_cycle|Asia/Kolkata', NOW)).toBeUndefined()
    expect(parser.parse(' Billing_Cycle', NOW)).toBeUndefined()
    expect(parser.parse('Billing_Cycle ', NOW)).toBeUndefined()
  })

  it('passes the query timezone into getRange, including LOCALE, without resolving it', () => {
    const seen: TimeZoneId[] = []
    const zoned = parserFor([
      preset('Billing_Cycle', ({ timezone }) => {
        seen.push(timezone)
        return { from: billingTo, to: billingFrom }
      })
    ])

    zoned.parse('Billing_Cycle|Asia/Kolkata', NOW)
    zoned.parse('Billing_Cycle', NOW)
    zoned.parse('Billing_Cycle|LOCALE', NOW)
    zoned.parse('Billing_Cycle| ', NOW)

    expect(seen).toEqual(['Asia/Kolkata', 'UTC', 'LOCALE', ' '])
  })

  it('orders a reversed getRange', () => {
    const parsed = parser.parse('Billing_Cycle|UTC', NOW)
    expect(parsed?.from).toEqual(billingTo)
    expect(parsed?.to).toEqual(billingFrom)
    expect(parsed?.from && parsed.to && parsed.from < parsed.to).toBe(true)
  })

  it('matches a preset value exactly, including a leading space', () => {
    const spaced = parserFor([
      preset(' my custom preset 3 days', () => ({ from: localFrom, to: localTo }), { label: 'Previous 3 days' })
    ])
    expect(spaced.parse(' my custom preset 3 days|UTC', NOW)?.range).toEqual({
      kind: 'preset',
      preset: ' my custom preset 3 days'
    })
    expect(spaced.parse('my custom preset 3 days|UTC', NOW)).toBeUndefined()
  })

  it('uses the first configured copy when the same value is listed twice', () => {
    const firstFrom = new Date('2026-01-01T00:00:00.000Z')
    const firstTo = new Date('2026-01-02T00:00:00.000Z')
    const secondFrom = new Date('2026-02-01T00:00:00.000Z')
    const secondTo = new Date('2026-02-02T00:00:00.000Z')
    const duplicates = parserFor([
      preset('SAME', () => ({ from: firstFrom, to: firstTo }), { label: 'First' }),
      preset('SAME', () => ({ from: secondFrom, to: secondTo }), { label: 'Second', group: 'relative' })
    ])
    expect(duplicates.parse('SAME', NOW)).toEqual({
      from: firstFrom,
      to: firstTo,
      range: { kind: 'preset', preset: 'SAME' },
      timezone: 'UTC'
    })
  })

  it('uses only the first presets mode', () => {
    const selected = createDateRangeV2FilterParser({
      modes: [
        { mode: 'relative' },
        { mode: 'presets', presets: [billing] },
        {
          mode: 'presets',
          presets: [preset('OTHER', () => ({ from: localFrom, to: localTo }))]
        }
      ]
    })
    expect(selected.parse('Billing_Cycle', NOW)?.range).toEqual({ kind: 'preset', preset: 'Billing_Cycle' })
    expect(selected.parse('OTHER', NOW)).toBeUndefined()
  })

  it('drops a blank value, a blank label, a missing getRange, and an unknown group', () => {
    expect(parser.parse('   |UTC', NOW)).toBeUndefined()
    expect(parser.parse('BROKEN|UTC', NOW)).toBeUndefined()
    expect(parser.parse('NO_LABEL|UTC', NOW)).toBeUndefined()
    expect(parser.parse('BAD_GROUP|UTC', NOW)).toBeUndefined()
  })

  it('uses getRange when a configured preset reuses a built-in id', () => {
    const builtIn = dateRangeV2FilterParser.parse('LAST_7_DAYS|UTC', NOW)
    expect(parser.parse('LAST_7_DAYS|UTC', NOW)).toEqual({
      from: localFrom,
      to: localTo,
      range: { kind: 'preset', preset: 'LAST_7_DAYS' },
      timezone: 'UTC'
    })
    expect(parser.parse('LAST_7_DAYS|LOCALE', NOW)?.timezone).toBe('LOCALE')
    expect(builtIn?.from?.getTime()).not.toBe(localFrom.getTime())
  })

  it('does not let a preset named FIXED replace a fixed range', () => {
    const namedFixed = parserFor([
      preset('FIXED', () => ({ from: localFrom, to: localTo }), { label: 'Reserved' }),
      preset('fixed', () => ({ from: localFrom, to: localTo }), { label: 'Fixed' })
    ])
    const fixed = dateRangeV2FilterParser.parse(`FIXED|${FROM}|${TO}|UTC`, NOW)

    expect(namedFixed.parse(`FIXED|${FROM}|${TO}|UTC`, NOW)).toEqual(fixed)
    expect(namedFixed.parse('FIXED', NOW)).toBeUndefined()
    expect(namedFixed.parse('FIXED|UTC', NOW)).toBeUndefined()
    expect(namedFixed.parse('fixed', NOW)).toEqual({
      from: localFrom,
      to: localTo,
      range: { kind: 'preset', preset: 'fixed' },
      timezone: 'UTC'
    })
  })

  it('leaves every other rangeQuery on the built-in parser', () => {
    const bare = createDateRangeV2FilterParser()
    expect(bare.parse('LAST_7_DAYS|UTC', NOW)).toEqual(dateRangeV2FilterParser.parse('LAST_7_DAYS|UTC', NOW))
    expect(parser.parse('THIS_MONTH|UTC', NOW)).toEqual(dateRangeV2FilterParser.parse('THIS_MONTH|UTC', NOW))
    expect(parser.parse('LAST_MONTH|UTC', NOW)).toEqual(dateRangeV2FilterParser.parse('LAST_MONTH|UTC', NOW))
    expect(parser.parse(`FIXED|${FROM}|${TO}|Asia/Kolkata`, NOW)).toEqual(
      dateRangeV2FilterParser.parse(`FIXED|${FROM}|${TO}|Asia/Kolkata`, NOW)
    )
    expect(bare.parse('Billing_Cycle', NOW)).toBeUndefined()
  })

  it('rejects a preset query that is empty, broken, or longer than PRESET|TIMEZONE', () => {
    expect(parser.parse('', NOW)).toBeUndefined()
    expect(parser.parse('%', NOW)).toBeUndefined()
    expect(parser.parse('|', NOW)).toBeUndefined()
    expect(parser.parse('Billing_Cycle|UTC|extra', NOW)).toBeUndefined()
    expect(parser.parse(encodeURIComponent('Billing_Cycle|UTC'), NOW)?.range).toEqual({
      kind: 'preset',
      preset: 'Billing_Cycle'
    })
    expect(parser.parse(encodeURIComponent(encodeURIComponent('Billing_Cycle|UTC')), NOW)).toBeUndefined()
  })

  it('writes the stored preset id and leaves a resolvable range on the built-in serializer', () => {
    expect(
      parser.serialize({
        range: { kind: 'preset', preset: 'billing_cycle' },
        timezone: 'Asia/Kolkata'
      })
    ).toBe('billing_cycle|Asia/Kolkata')
    expect(
      parser.serialize({
        range: { kind: 'preset', preset: 'Billing_Cycle' },
        timezone: ''
      })
    ).toBe('Billing_Cycle|UTC')
    expect(parser.serialize({ range: { kind: 'preset', preset: 'Billing_Cycle' } })).toBe('Billing_Cycle|UTC')

    const fixed = dateRangeV2FilterParser.parse(`FIXED|${FROM}|${TO}|UTC`, NOW)
    expect(fixed && parser.serialize(fixed)).toBe(`FIXED|${FROM}|${TO}|UTC`)
    const lastMonth = createDateRangeV2FilterParser().parse('LAST_MONTH|LOCALE', NOW)
    expect(lastMonth && parser.serialize(lastMonth)).toBe('PREVIOUS_1_CALENDAR_MONTH|LOCALE')
  })
})
