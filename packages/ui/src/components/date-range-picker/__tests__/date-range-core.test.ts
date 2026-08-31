import {
  formatDateRangeLabel,
  formatDateRangeTriggerLabel,
  formatResolvedDateRange,
  formatTimeZoneLabel,
  getBrowserTimeZone,
  getDefaultDateRangePresets,
  getDefaultDateRangeQuickPresets,
  getPreferredTimeZones,
  getSupportedTimeZones,
  isValidTimeZone,
  normalizeDateRangeValue,
  parseDateRangeValue,
  resolveDateRange,
  serializeDateRangeValue,
  type DateRangeValue
} from '..'

const now = new Date('2026-08-19T09:34:00.000Z')

describe('resolveDateRange', () => {
  it('resolves live past and future relative calendar-day windows', () => {
    const past = resolveDateRange(
      { kind: 'relative', direction: 'past', amount: 7, unit: 'day', timeZone: 'UTC' },
      { now }
    )
    const future = resolveDateRange(
      { kind: 'relative', direction: 'future', amount: 7, unit: 'day', timeZone: 'UTC' },
      { now }
    )

    expect(past.from.toISOString()).toBe('2026-08-13T00:00:00.000Z')
    expect(past.to).toEqual(now)
    expect(future.from).toEqual(now)
    expect(future.to.toISOString()).toBe('2026-08-26T00:00:00.000Z')
  })

  it('uses zoned calendar boundaries across a UTC offset', () => {
    const range = resolveDateRange(
      {
        kind: 'relative',
        direction: 'past',
        amount: 7,
        unit: 'day',
        timeZone: 'America/Los_Angeles'
      },
      { now }
    )
    expect(range.from.toISOString()).toBe('2026-08-13T07:00:00.000Z')
    expect(range.to).toEqual(now)
  })

  it('re-resolves live ranges and keeps fixed ranges unchanged', () => {
    const liveValue = {
      kind: 'relative',
      direction: 'past',
      amount: 1,
      unit: 'hour',
      timeZone: 'UTC'
    } as const
    const fixedValue = {
      kind: 'absolute',
      from: { date: '2026-08-01' },
      to: { date: '2026-08-01' },
      timeZone: 'UTC'
    } as const
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

    expect(resolveDateRange(liveValue, { now: oneHourLater }).to.getTime()).toBe(
      resolveDateRange(liveValue, { now }).to.getTime() + 60 * 60 * 1000
    )
    expect(resolveDateRange(fixedValue, { now: oneHourLater })).toMatchObject(resolveDateRange(fixedValue, { now }))
  })

  it('excludes the incomplete interval without changing the requested count', () => {
    const range = resolveDateRange(
      {
        kind: 'relative',
        direction: 'past',
        amount: 7,
        unit: 'day',
        timeZone: 'UTC',
        adjustment: {
          type: 'exclude',
          exclude: { incompleteInterval: true, weekdays: [6, 0, 6] }
        }
      },
      { now }
    )
    expect(range.from.toISOString()).toBe('2026-08-12T00:00:00.000Z')
    expect(range.to.toISOString()).toBe('2026-08-19T00:00:00.000Z')
    expect(range.excludeWeekdays).toEqual([0, 6])
  })

  it('applies offsets to past ranges only', () => {
    const range = resolveDateRange(
      {
        kind: 'relative',
        direction: 'past',
        amount: 7,
        unit: 'day',
        timeZone: 'UTC',
        adjustment: { type: 'offset', offset: { amount: 1, unit: 'day' } }
      },
      { now }
    )
    expect(range.from.toISOString()).toBe('2026-08-12T00:00:00.000Z')
    expect(range.to.toISOString()).toBe('2026-08-18T09:34:00.000Z')
  })

  it('resolves calendar periods with Monday as the default week start', () => {
    const lastWeek = resolveDateRange({ kind: 'calendar', period: 'last_week', timeZone: 'UTC' }, { now })
    const thisMonth = resolveDateRange({ kind: 'calendar', period: 'this_month', timeZone: 'Asia/Kolkata' }, { now })

    expect(lastWeek.from.toISOString()).toBe('2026-08-10T00:00:00.000Z')
    expect(lastWeek.to.toISOString()).toBe('2026-08-17T00:00:00.000Z')
    expect(thisMonth.from.toISOString()).toBe('2026-07-31T18:30:00.000Z')
    expect(thisMonth.to.toISOString()).toBe('2026-08-31T18:30:00.000Z')
  })

  it('resolves all-day and fixed-time absolute ranges as half-open bounds', () => {
    const allDay = resolveDateRange({
      kind: 'absolute',
      from: { date: '2026-08-01' },
      to: { date: '2026-08-15' },
      timeZone: 'UTC'
    })
    const timed = resolveDateRange({
      kind: 'absolute',
      from: { date: '2026-08-01', time: '09:00' },
      to: { date: '2026-08-15', time: '18:30' },
      timeZone: 'Asia/Kolkata'
    })

    expect(allDay.from.toISOString()).toBe('2026-08-01T00:00:00.000Z')
    expect(allDay.to.toISOString()).toBe('2026-08-16T00:00:00.000Z')
    expect(timed.from.toISOString()).toBe('2026-08-01T03:30:00.000Z')
    expect(timed.to.toISOString()).toBe('2026-08-15T13:01:00.000Z')
  })

  it('uses zoned midnights across DST transitions', () => {
    const springForwardDay = resolveDateRange({
      kind: 'absolute',
      from: { date: '2026-03-08' },
      to: { date: '2026-03-08' },
      timeZone: 'America/New_York'
    })

    expect(springForwardDay.from.toISOString()).toBe('2026-03-08T05:00:00.000Z')
    expect(springForwardDay.to.toISOString()).toBe('2026-03-09T04:00:00.000Z')
    expect(springForwardDay.to.getTime() - springForwardDay.from.getTime()).toBe(23 * 60 * 60 * 1000)
  })

  it('rejects inverted absolute ranges', () => {
    expect(() =>
      resolveDateRange({
        kind: 'absolute',
        from: { date: '2026-08-15' },
        to: { date: '2026-08-01' },
        timeZone: 'UTC'
      })
    ).toThrow(RangeError)
  })
})

describe('normalization and serialization', () => {
  it('upgrades recognized legacy presets to live values', () => {
    expect(
      normalizeDateRangeValue({
        from: new Date('2020-01-01T00:00:00.000Z'),
        to: new Date('2020-01-08T00:00:00.000Z'),
        preset: 'LAST_7_DAYS'
      })
    ).toEqual({
      kind: 'relative',
      direction: 'past',
      amount: 7,
      unit: 'day',
      timeZone: 'UTC'
    })
  })

  it('normalizes legacy custom values and invalid zones safely', () => {
    expect(
      normalizeDateRangeValue(
        {
          from: '2026-08-01T09:00:00.000Z',
          to: '2026-08-15T18:30:00.000Z',
          preset: 'CUSTOM'
        },
        'Not/A_Zone'
      )
    ).toEqual({
      kind: 'absolute',
      timeZone: 'UTC',
      from: { date: '2026-08-01', time: '09:00' },
      to: { date: '2026-08-15', time: '18:30' }
    })
  })

  it('round-trips every range kind and adjustment through codec v1', () => {
    const values: DateRangeValue[] = [
      {
        kind: 'relative',
        direction: 'past',
        amount: 30,
        unit: 'day',
        timeZone: 'America/New_York',
        adjustment: {
          type: 'exclude',
          exclude: { incompleteInterval: true, weekdays: [6, 0] }
        }
      },
      { kind: 'calendar', period: 'next_quarter', timeZone: 'Asia/Kolkata' },
      {
        kind: 'absolute',
        from: { date: '2026-08-01', time: '09:00' },
        to: { date: '2026-08-15', time: '18:30' },
        timeZone: 'UTC'
      }
    ]

    for (const value of values) {
      const serialized = serializeDateRangeValue(value)
      expect(serialized.startsWith('1~')).toBe(true)
      expect(parseDateRangeValue(serialized)).toEqual(normalizeDateRangeValue(value))
    }
  })

  it('returns undefined for malformed and unsupported serialized values', () => {
    expect(parseDateRangeValue('2~rel~past~7~day~UTC')).toBeUndefined()
    expect(parseDateRangeValue('1~abs~2026-08-15~2026-08-01~UTC')).toBeUndefined()
    expect(parseDateRangeValue('not a date range')).toBeUndefined()
  })

  it('strips a runtime future offset instead of retaining an invalid state', () => {
    expect(
      normalizeDateRangeValue({
        kind: 'relative',
        direction: 'future',
        amount: 7,
        unit: 'day',
        timeZone: 'UTC',
        adjustment: { type: 'offset', offset: { amount: 1, unit: 'day' } }
      })
    ).toEqual({
      kind: 'relative',
      direction: 'future',
      amount: 7,
      unit: 'day',
      timeZone: 'UTC'
    })
  })
})

describe('labels, zones, and presets', () => {
  it('validates zones without throwing and formats useful labels', () => {
    expect(isValidTimeZone('Asia/Kolkata')).toBe(true)
    expect(isValidTimeZone('Not/A_Zone')).toBe(false)
    expect(formatTimeZoneLabel('UTC', now)).toBe('UTC')
    expect(formatTimeZoneLabel('Asia/Kolkata', now)).toContain('UTC+05:30')
    expect(getSupportedTimeZones()[0]).toBe('UTC')
    expect(getSupportedTimeZones().length).toBeGreaterThan(1)
  })

  it('lists UTC and the browser zone as the preferred zones', () => {
    const preferred = getPreferredTimeZones()

    expect(preferred[0]).toBe('UTC')
    expect(preferred.length).toBeLessThanOrEqual(2)
    expect(new Set(preferred).size).toBe(preferred.length)
    expect(preferred).toContain(getBrowserTimeZone())
  })

  it('formats semantic and resolved range labels', () => {
    const value = { kind: 'relative', direction: 'past', amount: 7, unit: 'day', timeZone: 'UTC' } as const
    expect(formatDateRangeLabel(value, { now })).toBe('Last 7 days, UTC')
    expect(formatDateRangeLabel(value, { now, includeResolvedRange: true })).toContain(
      'Last 7 days (Aug 13, 2026 – Aug 19, 2026, UTC)'
    )
  })

  it('formats concise, timezone-aware trigger labels', () => {
    const relative = { kind: 'relative', direction: 'past', amount: 7, unit: 'day', timeZone: 'UTC' } as const
    expect(formatDateRangeTriggerLabel(relative, { now })).toBe('Last 7 days (Aug 13–19, 2026) · UTC+00:00')
    expect(formatDateRangeTriggerLabel(relative, { now, includeTimeZone: false })).toBe('Last 7 days (Aug 13–19, 2026)')

    const allDay = {
      kind: 'absolute',
      from: { date: '2026-08-24' },
      to: { date: '2026-08-30' },
      timeZone: 'Asia/Kolkata'
    } as const
    expect(formatDateRangeTriggerLabel(allDay, { now })).toBe('Aug 24–30, 2026 · UTC+05:30')

    const timed = {
      kind: 'absolute',
      from: { date: '2026-08-24', time: '16:00' },
      to: { date: '2026-08-30', time: '17:30' },
      timeZone: 'Asia/Kolkata'
    } as const
    expect(formatDateRangeTriggerLabel(timed, { now })).toBe('16:00 Aug 24 – 17:30 Aug 30, 2026 · UTC+05:30')

    const startOnly = {
      kind: 'absolute',
      from: { date: '2026-08-24', time: '16:00' },
      to: { date: '2026-08-30' },
      timeZone: 'UTC'
    } as const
    expect(formatDateRangeTriggerLabel(startOnly, { now })).toBe('16:00 Aug 24 – 23:59 Aug 30, 2026 · UTC+00:00')

    const endOnly = {
      kind: 'absolute',
      from: { date: '2026-08-24' },
      to: { date: '2026-08-30', time: '17:30' },
      timeZone: 'UTC'
    } as const
    expect(formatDateRangeTriggerLabel(endOnly, { now })).toBe('00:00 Aug 24 – 17:30 Aug 30, 2026 · UTC+00:00')
  })

  it('formats resolved bounds without the semantic prefix', () => {
    const relative = { kind: 'relative', direction: 'past', amount: 7, unit: 'day', timeZone: 'UTC' } as const
    expect(formatResolvedDateRange(relative, { now })).toBe('Aug 13, 2026 – Aug 19, 2026')
    expect(formatResolvedDateRange(relative, { now, includeTimeZone: true })).toBe('Aug 13, 2026 – Aug 19, 2026, UTC')

    const period = { kind: 'calendar', period: 'this_month', extent: 'full', timeZone: 'UTC' } as const
    expect(formatResolvedDateRange(period, { now })).toBe('Aug 1, 2026 – Aug 31, 2026')
  })

  it('formats the inclusive visible end of a full calendar period', () => {
    const value = { kind: 'calendar', period: 'this_month', extent: 'full', timeZone: 'UTC' } as const
    expect(formatDateRangeLabel(value, { now, includeResolvedRange: true })).toContain(
      'This month (Aug 1, 2026 – Aug 31, 2026, UTC)'
    )
  })

  it('provides future-friendly semantic presets', () => {
    const presets = getDefaultDateRangePresets()
    expect(presets.some(preset => preset.id === 'next-7-days')).toBe(true)
    expect(presets.some(preset => preset.id === 'next-month')).toBe(true)
    expect(presets.every(preset => preset.value.timeZone === 'UTC')).toBe(true)

    const quickPresets = getDefaultDateRangeQuickPresets()
    expect(quickPresets.map(preset => preset.label)).toEqual(['Today', 'Yesterday', '7D', '30D', '3M', '6M', '12M'])
    expect(quickPresets.every(preset => preset.value)).toBe(true)
  })
})
