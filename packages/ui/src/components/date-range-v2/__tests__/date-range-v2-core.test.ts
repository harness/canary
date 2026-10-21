import { describe, it } from 'vitest'

import { isAllowedDateRangeV2, legalExtents } from '../date-range-v2'
import { createDateRangeV2FilterParser, dateRangeV2FilterParser } from '../date-range-v2-filter-parser'
import {
  formatDateRangeV2Preset,
  migrateDefaultPreset,
  parseDateRangeV2Preset,
  refreshDateRangeV2Value,
  toDateRangeV2Value
} from '../date-range-v2-preset'
import { configuredPresetLabel, describeDateRangeV2, formatDateRangeV2Label } from '../format-date-range-v2-label'
import { resolveDateRangeV2At } from '../resolve-date-range-v2'
import type { DateRangeV2Range, DateRangeV2State } from '../types'

const state = (range: DateRangeV2Range): DateRangeV2State => ({ version: 1, range })

const NOW = new Date('2026-10-05T15:30:00.000Z')

describe.concurrent('resolveDateRangeV2At', () => {
  it('anchors a relative month at now and uses calendar months', ({ expect }) => {
    const [start, end] = resolveDateRangeV2At(
      state({ kind: 'relative', direction: 'last', amount: 1, unit: 'month' }),
      NOW,
      'UTC'
    )
    expect(new Date(start).toISOString()).toBe('2026-09-05T15:30:00.000Z')
    expect(end).toBe(NOW.getTime())
  })

  it('clamps a relative month to the end of a short month', ({ expect }) => {
    const [start] = resolveDateRangeV2At(
      state({ kind: 'relative', direction: 'last', amount: 1, unit: 'month' }),
      new Date('2026-03-31T12:00:00.000Z'),
      'UTC'
    )
    expect(new Date(start).toISOString()).toBe('2026-02-28T12:00:00.000Z')
  })

  it('starts a future relative window at now', ({ expect }) => {
    const [start, end] = resolveDateRangeV2At(
      state({ kind: 'relative', direction: 'next', amount: 2, unit: 'week' }),
      NOW,
      'UTC'
    )
    expect(start).toBe(NOW.getTime())
    expect(new Date(end).toISOString()).toBe('2026-10-19T15:30:00.000Z')
  })

  it('ends a full calendar period on its last millisecond', ({ expect }) => {
    const [start, end] = resolveDateRangeV2At(
      state({ kind: 'calendar', position: 'previous', amount: 1, unit: 'quarter' }),
      NOW,
      'UTC'
    )
    expect(new Date(start).toISOString()).toBe('2026-07-01T00:00:00.000Z')
    expect(new Date(end).toISOString()).toBe('2026-09-30T23:59:59.999Z')
  })

  it('splits the current period at now for to date and from now', ({ expect }) => {
    const toDate = resolveDateRangeV2At(
      state({ kind: 'calendar', position: 'this', unit: 'month', extent: 'so_far' }),
      NOW,
      'UTC'
    )
    const fromNow = resolveDateRangeV2At(
      state({ kind: 'calendar', position: 'this', unit: 'month', extent: 'from_now' }),
      NOW,
      'UTC'
    )
    expect(new Date(toDate[0]).toISOString()).toBe('2026-10-01T00:00:00.000Z')
    expect(toDate[1]).toBe(NOW.getTime())
    expect(fromNow[0]).toBe(NOW.getTime())
    expect(new Date(fromNow[1]).toISOString()).toBe('2026-10-31T23:59:59.999Z')
  })

  it('interprets fixed civil times in the given zone and includes the last minute', ({ expect }) => {
    const [start, end] = resolveDateRangeV2At(
      state({
        kind: 'fixed',
        from: { date: '2026-10-01', time: '00:00' },
        to: { date: '2026-10-06', time: '23:59' }
      }),
      NOW,
      'Asia/Kolkata'
    )
    expect(new Date(start).toISOString()).toBe('2026-09-30T18:30:00.000Z')
    expect(new Date(end).toISOString()).toBe('2026-10-06T18:29:59.999Z')
  })

  it('uses weekStartsOn for calendar weeks', ({ expect }) => {
    const monday = resolveDateRangeV2At(
      state({ kind: 'calendar', position: 'previous', amount: 1, unit: 'week' }),
      NOW,
      'UTC',
      1
    )
    const sunday = resolveDateRangeV2At(
      state({ kind: 'calendar', position: 'previous', amount: 1, unit: 'week' }),
      NOW,
      'UTC',
      0
    )
    expect(new Date(monday[0]).toISOString()).toBe('2026-09-28T00:00:00.000Z')
    expect(new Date(sunday[0]).toISOString()).toBe('2026-09-27T00:00:00.000Z')
  })

  it('spans the requested number of complete calendar periods', ({ expect }) => {
    const previous = resolveDateRangeV2At(
      state({ kind: 'calendar', position: 'previous', amount: 2, unit: 'month' }),
      NOW,
      'UTC'
    )
    const next = resolveDateRangeV2At(
      state({ kind: 'calendar', position: 'next', amount: 2, unit: 'month' }),
      NOW,
      'UTC'
    )
    expect(new Date(previous[0]).toISOString()).toBe('2026-08-01T00:00:00.000Z')
    expect(new Date(previous[1]).toISOString()).toBe('2026-09-30T23:59:59.999Z')
    expect(new Date(next[0]).toISOString()).toBe('2026-11-01T00:00:00.000Z')
    expect(new Date(next[1]).toISOString()).toBe('2026-12-31T23:59:59.999Z')
  })

  it('rejects a fixed range whose end precedes its start', ({ expect }) => {
    expect(() =>
      resolveDateRangeV2At(
        state({
          kind: 'fixed',
          from: { date: '2026-10-06', time: '10:00' },
          to: { date: '2026-10-06', time: '09:00' }
        }),
        NOW,
        'UTC'
      )
    ).toThrow(RangeError)
  })
})

describe.concurrent('availability', () => {
  it('limits current-period extents by direction', ({ expect }) => {
    expect(legalExtents('past')).toEqual(['so_far'])
    expect(legalExtents('future')).toEqual(['from_now'])
    expect(legalExtents('any')).toEqual(['full', 'so_far', 'from_now'])
  })

  it('rejects ranges on the wrong side of now', ({ expect }) => {
    const next = state({ kind: 'relative', direction: 'next', amount: 1, unit: 'day' })
    const last = state({ kind: 'relative', direction: 'last', amount: 1, unit: 'day' })
    expect(isAllowedDateRangeV2(next, 'past', 'UTC', 1, NOW)).toBe(false)
    expect(isAllowedDateRangeV2(last, 'past', 'UTC', 1, NOW)).toBe(true)
    expect(isAllowedDateRangeV2(last, 'future', 'UTC', 1, NOW)).toBe(false)
    expect(isAllowedDateRangeV2(next, 'future', 'UTC', 1, NOW)).toBe(true)
    expect(isAllowedDateRangeV2(next, 'any', 'UTC', 1, NOW)).toBe(true)
  })
})

describe.concurrent('labels', () => {
  it('describes each range kind', ({ expect }) => {
    expect(describeDateRangeV2(state({ kind: 'relative', direction: 'last', amount: 1, unit: 'month' }))).toEqual({
      title: 'Last 1 month'
    })
    expect(
      describeDateRangeV2(state({ kind: 'calendar', position: 'this', unit: 'month', extent: 'so_far' })).title
    ).toBe('This month, so far')
    expect(
      describeDateRangeV2(state({ kind: 'calendar', position: 'previous', amount: 1, unit: 'quarter' })).title
    ).toBe('Previous quarter')
    expect(
      describeDateRangeV2(state({ kind: 'calendar', position: 'previous', amount: 2, unit: 'quarter' })).title
    ).toBe('Previous 2 quarters')
    expect(describeDateRangeV2(state({ kind: 'relative', direction: 'last', amount: 1, unit: 'day' })).title).toBe(
      'Last 1 day'
    )
    expect(describeDateRangeV2(state({ kind: 'relative', direction: 'next', amount: 1, unit: 'day' })).title).toBe(
      'Next 1 day'
    )
    expect(describeDateRangeV2(state({ kind: 'calendar', position: 'previous', amount: 1, unit: 'day' })).title).toBe(
      'Yesterday'
    )
    expect(describeDateRangeV2(state({ kind: 'calendar', position: 'next', amount: 1, unit: 'day' })).title).toBe(
      'Tomorrow'
    )
    expect(describeDateRangeV2(state({ kind: 'calendar', position: 'previous', amount: 2, unit: 'day' })).title).toBe(
      'Previous 2 days'
    )
    expect(describeDateRangeV2(state({ kind: 'calendar', position: 'this', unit: 'day', extent: 'full' })).title).toBe(
      'Today'
    )
    expect(
      describeDateRangeV2(state({ kind: 'calendar', position: 'this', unit: 'day', extent: 'so_far' })).title
    ).toBe('Today, so far')
    expect(formatDateRangeV2Preset({ kind: 'relative', direction: 'last', amount: 1, unit: 'day' })).toBe('LAST_1_DAY')
    expect(formatDateRangeV2Preset({ kind: 'calendar', position: 'this', unit: 'day', extent: 'full' })).toBe(
      'THIS_DAY'
    )
  })

  it('builds the trigger text from the description and resolved dates', ({ expect }) => {
    const label = formatDateRangeV2Label(
      state({ kind: 'relative', direction: 'last', amount: 1, unit: 'month' }),
      'UTC',
      1,
      NOW
    )
    expect(label.triggerText).toBe('Last 1 month (Sep 5, 2026, 15:30 – Oct 5, 2026, 15:30)')
  })

  it('names a configured preset instead of a fixed range', ({ expect }) => {
    const fixed = state({
      kind: 'fixed',
      from: { date: '2026-10-11', time: '20:34' },
      to: { date: '2026-10-14', time: '20:34' }
    })
    const presets = [{ label: 'Previous 3 days', value: 'PREVIOUS_3_DAYS' }]
    const label = formatDateRangeV2Label(
      fixed,
      'UTC',
      1,
      NOW,
      {},
      undefined,
      configuredPresetLabel('PREVIOUS_3_DAYS', presets)
    )

    expect(label.title).toBe('Previous 3 days')
    expect(label.triggerText).toBe('Previous 3 days (Oct 11, 2026, 20:34 – Oct 14, 2026, 20:34)')
    expect(configuredPresetLabel('FIXED', presets)).toBeUndefined()
  })

  it('keeps whole days date-only and shows a time on both ends when either end is mid-day', ({ expect }) => {
    const fullMonth = formatDateRangeV2Label(
      state({ kind: 'calendar', position: 'this', unit: 'month', extent: 'full' }),
      'UTC',
      1,
      NOW
    )
    expect(fullMonth.triggerText).toBe('This month (Oct 1 – Oct 31, 2026)')

    const soFar = formatDateRangeV2Label(
      state({ kind: 'calendar', position: 'this', unit: 'month', extent: 'so_far' }),
      'UTC',
      1,
      NOW
    )
    expect(soFar.triggerText).toBe('This month, so far (Oct 1, 2026, 00:00 – Oct 5, 2026, 15:30)')

    const sameDay = formatDateRangeV2Label(
      state({
        kind: 'fixed',
        from: { date: '2026-10-05', time: '09:00' },
        to: { date: '2026-10-05', time: '17:00' }
      }),
      'UTC'
    )
    expect(sameDay.triggerText).toBe('Oct 5, 2026, 09:00 – 17:00')

    const datesOnly = formatDateRangeV2Label(
      state({ kind: 'relative', direction: 'last', amount: 1, unit: 'month' }),
      'UTC',
      1,
      NOW,
      { showTime: false }
    )
    expect(datesOnly.triggerText).toBe('Last 1 month (Sep 5 – Oct 5, 2026)')

    const hiddenZone = formatDateRangeV2Label(
      state({ kind: 'relative', direction: 'last', amount: 1, unit: 'month' }),
      'UTC',
      1,
      NOW,
      { showTimezone: false }
    )
    expect(hiddenZone.rangeText).toBe('Sep 5, 2026, 15:30 – Oct 5, 2026, 15:30')
  })
})

describe.concurrent('date range v2 presets', () => {
  it('names relative windows with an amount and calendar windows with CALENDAR', ({ expect }) => {
    expect(formatDateRangeV2Preset({ kind: 'relative', direction: 'last', amount: 7, unit: 'day' })).toBe('LAST_7_DAYS')
    expect(formatDateRangeV2Preset({ kind: 'relative', direction: 'last', amount: 1, unit: 'month' })).toBe(
      'LAST_1_MONTH'
    )
    expect(formatDateRangeV2Preset({ kind: 'relative', direction: 'next', amount: 2, unit: 'week' })).toBe(
      'NEXT_2_WEEKS'
    )
    expect(formatDateRangeV2Preset({ kind: 'calendar', position: 'previous', amount: 2, unit: 'month' })).toBe(
      'PREVIOUS_2_CALENDAR_MONTHS'
    )
    expect(formatDateRangeV2Preset({ kind: 'calendar', position: 'previous', amount: 1, unit: 'quarter' })).toBe(
      'PREVIOUS_1_CALENDAR_QUARTER'
    )
    expect(formatDateRangeV2Preset({ kind: 'calendar', position: 'this', unit: 'month', extent: 'full' })).toBe(
      'THIS_MONTH'
    )
    expect(formatDateRangeV2Preset({ kind: 'calendar', position: 'this', unit: 'month', extent: 'so_far' })).toBe(
      'THIS_MONTH_SO_FAR'
    )
    expect(formatDateRangeV2Preset({ kind: 'calendar', position: 'this', unit: 'month', extent: 'from_now' })).toBe(
      'THIS_MONTH_FROM_NOW'
    )
    expect(
      formatDateRangeV2Preset({
        kind: 'fixed',
        from: { date: '2026-09-05', time: '09:30' },
        to: { date: '2026-10-05', time: '09:30' }
      })
    ).toBe('FIXED')
  })

  it('maps previous default presets onto DateRangeV2 ids', ({ expect }) => {
    expect(migrateDefaultPreset('LAST_MONTH')).toBe('PREVIOUS_1_CALENDAR_MONTH')
    expect(migrateDefaultPreset('LAST_QUARTER')).toBe('PREVIOUS_1_CALENDAR_QUARTER')
    expect(migrateDefaultPreset('LAST_YEAR')).toBe('PREVIOUS_1_CALENDAR_YEAR')
    expect(migrateDefaultPreset('LAST_7_DAYS')).toBe('LAST_7_DAYS')
    expect(migrateDefaultPreset('LAST_30_DAYS')).toBe('LAST_30_DAYS')
    expect(migrateDefaultPreset('THIS_MONTH')).toBe('THIS_MONTH')
    expect(migrateDefaultPreset('THIS_QUARTER')).toBe('THIS_QUARTER')
    expect(migrateDefaultPreset('THIS_YEAR')).toBe('THIS_YEAR')
    expect(migrateDefaultPreset('LAST_3_MONTHS')).toBe('LAST_3_MONTHS')
    expect(migrateDefaultPreset('LAST_6_MONTHS')).toBe('LAST_6_MONTHS')
    expect(migrateDefaultPreset('LAST_12_MONTHS')).toBe('LAST_12_MONTHS')
  })

  it('keeps existing DateRange preset names on the same side of the clock', ({ expect }) => {
    expect(parseDateRangeV2Preset('LAST_MONTH')).toEqual({
      kind: 'calendar',
      position: 'previous',
      amount: 1,
      unit: 'month'
    })
    expect(parseDateRangeV2Preset('LAST_3_MONTHS')).toEqual({
      kind: 'relative',
      direction: 'last',
      amount: 3,
      unit: 'month'
    })
    expect(parseDateRangeV2Preset('THIS_MONTH')).toEqual({
      kind: 'calendar',
      position: 'this',
      unit: 'month',
      extent: 'full'
    })
    expect(parseDateRangeV2Preset('THIS_MONTH_SO_FAR')).toEqual({
      kind: 'calendar',
      position: 'this',
      unit: 'month',
      extent: 'so_far'
    })
    expect(parseDateRangeV2Preset('THIS_MONTH_FULL')).toEqual({
      kind: 'calendar',
      position: 'this',
      unit: 'month',
      extent: 'full'
    })
    expect(parseDateRangeV2Preset('PREVIOUS_2_CALENDAR_QUARTERS')).toEqual({
      kind: 'calendar',
      position: 'previous',
      amount: 2,
      unit: 'quarter'
    })
  })

  it('rebuilds moving bounds from the preset and keeps a custom range', ({ expect }) => {
    const refreshed = refreshDateRangeV2Value(
      {
        from: new Date('2020-01-01T00:00:00.000Z'),
        to: new Date('2020-01-02T00:00:00.000Z'),
        preset: 'LAST_MONTH',
        timezone: 'UTC'
      },
      NOW
    )
    expect(refreshed.preset).toBe('PREVIOUS_1_CALENDAR_MONTH')
    expect(refreshed.from.toISOString()).toBe('2026-09-01T00:00:00.000Z')
    expect(refreshed.to.toISOString()).toBe('2026-09-30T23:59:59.999Z')

    const custom = refreshDateRangeV2Value(
      {
        from: new Date('2026-09-05T09:30:00.000Z'),
        to: new Date('2026-10-05T09:30:00.000Z'),
        preset: 'FIXED',
        timezone: 'UTC'
      },
      NOW
    )
    expect(custom.from.toISOString()).toBe('2026-09-05T09:30:00.000Z')
    expect(custom.to.toISOString()).toBe('2026-10-05T09:30:00.000Z')
  })
})

describe.concurrent('dateRangeV2FilterParser', () => {
  const values = [
    toDateRangeV2Value(state({ kind: 'relative', direction: 'last', amount: 1, unit: 'month' }), 'Asia/Kolkata', NOW),
    toDateRangeV2Value(state({ kind: 'calendar', position: 'this', unit: 'month', extent: 'from_now' }), 'LOCALE', NOW),
    toDateRangeV2Value(state({ kind: 'calendar', position: 'previous', amount: 1, unit: 'quarter' }), 'UTC', NOW),
    toDateRangeV2Value(
      state({
        kind: 'fixed',
        from: { date: '2026-09-05', time: '09:30' },
        to: { date: '2026-10-05', time: '09:30' }
      }),
      'UTC',
      NOW
    )
  ]

  it('writes a preset or custom bounds, and always appends the timezone', ({ expect }) => {
    expect(values.map(value => value.preset)).toEqual([
      'LAST_1_MONTH',
      'THIS_MONTH_FROM_NOW',
      'PREVIOUS_1_CALENDAR_QUARTER',
      'FIXED'
    ])
    expect(values.map(dateRangeV2FilterParser.serialize)).toEqual([
      `LAST_1_MONTH|Asia/Kolkata`,
      'THIS_MONTH_FROM_NOW|LOCALE',
      'PREVIOUS_1_CALENDAR_QUARTER|UTC',
      `FIXED|${values[3].from.getTime()}|${values[3].to.getTime()}|UTC`
    ])
  })

  it('round-trips every range kind and refreshes moving presets', ({ expect }) => {
    for (const value of values) {
      expect(dateRangeV2FilterParser.parse(dateRangeV2FilterParser.serialize(value), NOW)).toEqual(value)
    }
  })

  it('decodes URL-encoded values', ({ expect }) => {
    const serialized = dateRangeV2FilterParser.serialize(
      toDateRangeV2Value(state({ kind: 'relative', direction: 'last', amount: 7, unit: 'day' }), 'Asia/Kolkata', NOW)
    )
    expect(dateRangeV2FilterParser.parse(encodeURIComponent(serialized), NOW)?.timezone).toBe('Asia/Kolkata')
    expect(dateRangeV2FilterParser.parse(encodeURIComponent(serialized), NOW)?.preset).toBe('LAST_7_DAYS')
  })

  it('rejects malformed and foreign values', ({ expect }) => {
    expect(dateRangeV2FilterParser.parse('')).toBeUndefined()
    expect(dateRangeV2FilterParser.parse('LAST_0_DAYS')).toBeUndefined()
    expect(dateRangeV2FilterParser.parse('NOPE')).toBeUndefined()
    expect(dateRangeV2FilterParser.parse('FIXED|nope|1')).toBeUndefined()
    expect(dateRangeV2FilterParser.parse('CUSTOM|1788201000000|1788978600000|UTC')).toBeUndefined()
    expect(dateRangeV2FilterParser.parse('THIS_MONTH_TO_DATE')).toBeUndefined()
    expect(dateRangeV2FilterParser.parse('CURRENT_MONTH')).toBeUndefined()
    expect(dateRangeV2FilterParser.parse('THIS_MONTH|UTC|extra')).toBeUndefined()
    expect(dateRangeV2FilterParser.parse('[object Object]')).toBeUndefined()
  })

  it('hydrates a calendar week with weekStartsOn', ({ expect }) => {
    const value = toDateRangeV2Value(
      state({ kind: 'calendar', position: 'previous', amount: 1, unit: 'week' }),
      'UTC',
      NOW,
      0
    )
    const serialized = dateRangeV2FilterParser.serialize(value)

    expect(serialized).toBe('PREVIOUS_1_CALENDAR_WEEK|UTC')
    expect(dateRangeV2FilterParser.parse(serialized, NOW, 0)).toEqual(value)
    expect(dateRangeV2FilterParser.parse(serialized, NOW)?.from.toISOString()).toBe('2026-09-28T00:00:00.000Z')
    expect(value.from.toISOString()).toBe('2026-09-27T00:00:00.000Z')
  })

  it('reads preset and custom query values with an optional timezone', ({ expect }) => {
    expect(dateRangeV2FilterParser.parse('THIS_MONTH', NOW)?.preset).toBe('THIS_MONTH')
    expect(dateRangeV2FilterParser.parse('THIS_MONTH', NOW)?.timezone).toBe('UTC')
    expect(dateRangeV2FilterParser.parse('THIS_MONTH|UTC', NOW)?.timezone).toBe('UTC')
    expect(dateRangeV2FilterParser.parse('THIS_MONTH|Asia/Calcutta', NOW)?.timezone).toBe('Asia/Calcutta')

    const from = 1788201000000
    const to = 1788978600000
    expect(dateRangeV2FilterParser.parse(`FIXED|${from}|${to}`, NOW)).toMatchObject({
      preset: 'FIXED',
      timezone: 'UTC',
      from: new Date(from),
      to: new Date(to)
    })
    expect(dateRangeV2FilterParser.parse(`FIXED|${from}|${to}|LOCALE`, NOW)?.timezone).toBe('LOCALE')
    expect(dateRangeV2FilterParser.parse(`FIXED|${from}|${to}|UTC`, NOW)?.timezone).toBe('UTC')
    expect(dateRangeV2FilterParser.parse(`FIXED|${from}|${to}|Asia/Calcutta`, NOW)?.timezone).toBe('Asia/Calcutta')
  })

  it('rewrites old preset ids to the current serializer', ({ expect }) => {
    expect(dateRangeV2FilterParser.parse('THIS_MONTH_FULL', NOW)?.preset).toBe('THIS_MONTH')
    expect(dateRangeV2FilterParser.parse('LAST_MONTH', NOW)?.preset).toBe('PREVIOUS_1_CALENDAR_MONTH')
    expect(dateRangeV2FilterParser.parse('LAST_QUARTER|UTC', NOW)?.preset).toBe('PREVIOUS_1_CALENDAR_QUARTER')
    expect(dateRangeV2FilterParser.parse('LAST_YEAR', NOW)?.preset).toBe('PREVIOUS_1_CALENDAR_YEAR')
    expect(
      dateRangeV2FilterParser.serialize({
        from: NOW,
        to: NOW,
        preset: 'LAST_MONTH',
        timezone: 'LOCALE'
      })
    ).toBe('PREVIOUS_1_CALENDAR_MONTH|LOCALE')
    expect(
      dateRangeV2FilterParser.serialize({
        from: NOW,
        to: NOW,
        preset: 'THIS_MONTH'
      })
    ).toBe('THIS_MONTH|UTC')
  })
})

describe.concurrent('createDateRangeV2FilterParser', () => {
  const billingFrom = new Date('2026-01-01T00:00:00.000Z')
  const billingTo = new Date('2026-01-31T00:00:00.000Z')
  const localFrom = new Date('2026-10-01T00:00:00.000Z')
  const localTo = new Date('2026-10-07T00:00:00.000Z')
  const fixedFrom = 1788201000000
  const fixedTo = 1788978600000
  const parser = createDateRangeV2FilterParser(
    [
      {
        label: 'Billing cycle',
        value: 'Billing_Cycle',
        group: 'recommended',
        getRange: () => ({ from: billingTo, to: billingFrom })
      },
      {
        label: 'Last 7 days',
        value: 'LAST_7_DAYS',
        group: 'recommended',
        getRange: () => ({ from: localFrom, to: localTo })
      },
      {
        label: 'Blank',
        value: '   ',
        group: 'recommended',
        getRange: () => ({ from: localFrom, to: localTo })
      },
      {
        label: 'Broken',
        value: 'BROKEN',
        group: 'recommended',
        getRange: undefined as unknown as () => { from: Date; to: Date }
      }
    ],
    0
  )

  it('reloads a custom preset through getRange and keeps the configured id', ({ expect }) => {
    expect(parser.serialize({ from: NOW, to: NOW, preset: 'billing_cycle', timezone: 'Asia/Kolkata' })).toBe(
      'Billing_Cycle|Asia/Kolkata'
    )
    expect(parser.parse('billing_cycle|Asia/Kolkata', NOW)).toEqual({
      from: billingFrom,
      to: billingTo,
      preset: 'Billing_Cycle',
      timezone: 'Asia/Kolkata'
    })
    expect(parser.parse('Billing_Cycle', NOW)?.timezone).toBe('UTC')
    expect(parser.parse('Billing_Cycle|', NOW)?.timezone).toBe('UTC')
    expect(parser.serialize({ from: billingFrom, to: billingTo, preset: 'Billing_Cycle', timezone: '' })).toBe(
      'Billing_Cycle|UTC'
    )
  })

  it('passes the query timezone into getRange', ({ expect }) => {
    const seen: string[] = []
    const zoned = createDateRangeV2FilterParser([
      {
        label: 'Billing cycle',
        value: 'Billing_Cycle',
        group: 'recommended',
        getRange: ({ timezone }) => {
          seen.push(timezone)
          return { from: billingFrom, to: billingTo }
        }
      }
    ])

    zoned.parse('Billing_Cycle|Asia/Kolkata', NOW)
    zoned.parse('Billing_Cycle', NOW)

    expect(seen).toEqual(['Asia/Kolkata', 'UTC'])
  })

  it('orders a reversed getRange and ignores bounds stored on the value', ({ expect }) => {
    const parsed = parser.parse('Billing_Cycle|UTC', NOW)

    expect(parsed?.from).toEqual(billingFrom)
    expect(parsed?.to).toEqual(billingTo)
    expect(parsed?.from.getTime()).toBeLessThan(parsed?.to.getTime() ?? 0)
  })

  it('uses getRange when a configured preset reuses a built-in id', ({ expect }) => {
    const builtIn = dateRangeV2FilterParser.parse('LAST_7_DAYS|UTC', NOW)

    expect(parser.serialize({ from: NOW, to: NOW, preset: 'LAST_7_DAYS', timezone: 'UTC' })).toBe('LAST_7_DAYS|UTC')
    expect(parser.parse('LAST_7_DAYS|UTC', NOW)).toEqual({
      from: localFrom,
      to: localTo,
      preset: 'LAST_7_DAYS',
      timezone: 'UTC'
    })
    expect(parser.parse('LAST_7_DAYS|LOCALE', NOW)?.timezone).toBe('LOCALE')
    expect(builtIn?.from.getTime()).not.toBe(localFrom.getTime())
  })

  it('leaves unconfigured built-in ids and fixed ranges on the built-in parser', ({ expect }) => {
    const bare = createDateRangeV2FilterParser()
    const fixed = { from: new Date(fixedFrom), to: new Date(fixedTo), preset: 'FIXED', timezone: 'UTC' as const }

    expect(bare.parse('LAST_7_DAYS|UTC', NOW)).toEqual(dateRangeV2FilterParser.parse('LAST_7_DAYS|UTC', NOW))
    expect(parser.parse('THIS_MONTH|UTC', NOW)?.preset).toBe('THIS_MONTH')
    expect(parser.parse(`FIXED|${fixedFrom}|${fixedTo}|UTC`, NOW)).toMatchObject(fixed)
    expect(parser.serialize(fixed)).toBe(`FIXED|${fixedFrom}|${fixedTo}|UTC`)
    expect(bare.serialize({ from: NOW, to: NOW, preset: 'LAST_MONTH', timezone: 'LOCALE' })).toBe(
      'PREVIOUS_1_CALENDAR_MONTH|LOCALE'
    )
  })

  it('does not let a preset named FIXED replace a fixed range', ({ expect }) => {
    const namedFixed = createDateRangeV2FilterParser([
      {
        label: 'Fixed',
        value: 'fixed',
        group: 'recommended',
        getRange: () => ({ from: localFrom, to: localTo })
      }
    ])
    const fixed = { from: new Date(fixedFrom), to: new Date(fixedTo), preset: 'FIXED', timezone: 'UTC' as const }

    expect(namedFixed.serialize(fixed)).toBe(`FIXED|${fixedFrom}|${fixedTo}|UTC`)
    expect(namedFixed.parse(`FIXED|${fixedFrom}|${fixedTo}|UTC`, NOW)).toMatchObject(fixed)
    expect(namedFixed.parse('FIXED|UTC', NOW)).toBeUndefined()
    expect(namedFixed.parse('fixed', NOW)).toBeUndefined()
  })

  it('rejects a custom preset query that is not PRESET or PRESET|TIMEZONE', ({ expect }) => {
    expect(parser.parse('')).toBeUndefined()
    expect(parser.parse('Billing_Cycle|UTC|extra', NOW)).toBeUndefined()
    expect(parser.parse('BROKEN|UTC', NOW)).toBeUndefined()
    expect(parser.parse('%', NOW)).toBeUndefined()
    expect(parser.parse(encodeURIComponent('Billing_Cycle|UTC'), NOW)?.preset).toBe('Billing_Cycle')
  })

  it('reads a calendar week from weekStartsOn and ignores an invalid weekday', ({ expect }) => {
    const sunday = createDateRangeV2FilterParser(undefined, 0)
    const monday = createDateRangeV2FilterParser()
    const invalid = createDateRangeV2FilterParser(undefined, 7)

    expect(sunday.parse('PREVIOUS_1_CALENDAR_WEEK|UTC', NOW)?.from.toISOString()).toBe('2026-09-27T00:00:00.000Z')
    expect(monday.parse('PREVIOUS_1_CALENDAR_WEEK|UTC', NOW)?.from.toISOString()).toBe('2026-09-28T00:00:00.000Z')
    expect(invalid.parse('PREVIOUS_1_CALENDAR_WEEK|UTC', NOW)?.from.toISOString()).toBe('2026-09-28T00:00:00.000Z')
    expect(parser.parse('Billing_Cycle|UTC', NOW)?.from).toEqual(billingFrom)
  })
})
