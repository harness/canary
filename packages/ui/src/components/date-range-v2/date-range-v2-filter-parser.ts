import { normalizePresets } from './normalize-picker-config'
import { resolveDateRangeV2, resolvePresetBounds, resolveTimeZone } from './resolve-date-range-v2'
import { isCivilDateTime, utcToCivilDateTime } from './timezone-utils'
import type {
  CalendarExtent,
  CalendarUnit,
  DateRangeV2Config,
  DateRangeV2Preset,
  DateRangeV2Value,
  RelativeUnit,
  ResolvableDateRangeV2,
  TimeZoneId
} from './types'

const DEFAULT_TIME_ZONE: TimeZoneId = 'UTC'

/** A stored value whose range `resolveDateRangeV2` can compute. Preset ranges stay on `createDateRangeV2FilterParser`. */
type ResolvableDateRangeV2Value = Omit<DateRangeV2Value, 'range'> & {
  range: ResolvableDateRangeV2
}

const isTimezone = (value: string): value is TimeZoneId => value.length > 0

const timezoneOf = (timezone?: TimeZoneId): TimeZoneId => timezone || DEFAULT_TIME_ZONE

const unitToken = (unit: string, amount: number): string => {
  const word = unit.toUpperCase()
  return amount === 1 ? word : `${word}S`
}

const parseExtent = (token: string | undefined): CalendarExtent =>
  token === 'SO_FAR' ? 'so_far' : token === 'FROM_NOW' ? 'from_now' : 'full'

const parseTimezone = (token: string | undefined): TimeZoneId | undefined => {
  const timezone = token ?? DEFAULT_TIME_ZONE
  return isTimezone(timezone) ? timezone : undefined
}

const parseAmount = (token: string): number | undefined => {
  const amount = Number(token)
  return Number.isInteger(amount) && amount >= 1 ? amount : undefined
}

const parseEpoch = (token: string): number | undefined => {
  if (!/^-?\d+$/.test(token)) return undefined
  const value = Number(token)
  return Number.isSafeInteger(value) ? value : undefined
}

const withTimezone = (id: string, timezone: string | undefined): string => (timezone ? `${id}|${timezone}` : id)

/** Short preset ids from the old date range picker. `M` is month and `m` is minute. */
const SHORT_RELATIVE_UNIT: Record<string, string> = {
  m: 'minute',
  h: 'hour',
  d: 'day',
  w: 'week',
  M: 'month',
  y: 'year'
}

const decodeRangeQuery = (rangeQuery: string): string | undefined => {
  if (!rangeQuery) return undefined
  try {
    return decodeURIComponent(rangeQuery)
  } catch {
    return undefined
  }
}

/**
 * Rewrites an older rangeQuery into the current grammar. The result is only a string.
 * Each branch matches one older DateRangeV2 query, a default DateRangeField preset id, or a short custom preset id such as `30d`.
 * A query that is already current is returned unchanged. `parseRangeQuery` reads the result.
 */
export const migrateDateRangeV2RangeQuery = (rangeQuery: string): string => {
  const query = decodeRangeQuery(rangeQuery)
  if (!query) return rangeQuery

  /**
   * Note: DateRangeV2 used to write CUSTOM range as `CUSTOM|FROM_MS|TO_MS|TIMEZONE`
   */
  // CUSTOM|FROM_MS|TO_MS|TIMEZONE → FIXED|yyyy-MM-ddTHH:mm:ss|yyyy-MM-ddTHH:mm:ss|TIMEZONE
  const custom = /^CUSTOM\|(?<from>-?\d+)\|(?<to>-?\d+)(?:\|(?<timezone>[^|]+))?$/.exec(query)
  if (custom?.groups) {
    const fromMs = parseEpoch(custom.groups.from)
    const toMs = parseEpoch(custom.groups.to)
    const timezone = custom.groups.timezone ?? DEFAULT_TIME_ZONE
    if (fromMs === undefined || toMs === undefined || !isTimezone(timezone)) return query
    const zone = resolveTimeZone(timezone)
    return `FIXED|${utcToCivilDateTime(new Date(fromMs), zone)}|${utcToCivilDateTime(new Date(toMs), zone)}|${timezone}`
  }

  /**
   * Note: DateRangeV2 wrote a full period as `THIS_MONTH_FULL`. The current grammar omits `_FULL`.
   */
  // THIS_(DAY|WEEK|MONTH|QUARTER|YEAR)_FULL|TIMEZONE → THIS_(UNIT)|TIMEZONE
  const fullPeriod = /^THIS_(?<unit>DAY|WEEK|MONTH|QUARTER|YEAR)S?_FULL(?:\|(?<timezone>[^|]+))?$/.exec(query)
  if (fullPeriod?.groups) return withTimezone(`THIS_${fullPeriod.groups.unit}`, fullPeriod.groups.timezone)

  /**
   * Note: DateRangeV2 used to write last calendar period as `LAST_AMOUNT_CALENDAR_(DAY|WEEK|MONTH|QUARTER|YEAR)S?|TIMEZONE` and now it is rewritten to `PREVIOUS_AMOUNT_CALENDAR_(DAY|WEEK|MONTH|QUARTER|YEAR)S?|TIMEZONE`
   */
  // LAST_AMOUNT_CALENDAR_(DAY|WEEK|MONTH|QUARTER|YEAR)S?|TIMEZONE → PREVIOUS_...
  const lastCalendar =
    /^LAST_(?<amount>\d+)_CALENDAR_(?<unit>DAY|WEEK|MONTH|QUARTER|YEAR)S?(?:\|(?<timezone>[^|]+))?$/.exec(query)
  if (lastCalendar?.groups) {
    const { amount, unit, timezone } = lastCalendar.groups
    return withTimezone(`PREVIOUS_${amount}_CALENDAR_${unit}`, timezone)
  }

  /**
   * Note: getDefaultPresets of DateRangeField (V1) used to write the current period as `CURRENT_MONTH|TIMEZONE`.
   * It is rewritten to `THIS_(DAY|WEEK|MONTH|QUARTER|YEAR)|TIMEZONE`.
   */
  // CURRENT_(DAY|WEEK|MONTH|QUARTER|YEAR)|TIMEZONE → THIS_(UNIT)|TIMEZONE
  const currentPeriod = /^CURRENT_(?<unit>DAY|WEEK|MONTH|QUARTER|YEAR)S?(?:\|(?<timezone>[^|]+))?$/.exec(query)
  if (currentPeriod?.groups) return withTimezone(`THIS_${currentPeriod.groups.unit}`, currentPeriod.groups.timezone)

  /**
   * Note: Amount less preset ids were part of getDefaultPresets of DateRangeField (V1).
   * Day and week use the same calendar units as month, quarter, and year.
   */
  // LAST_(DAY|WEEK|MONTH|QUARTER|YEAR)S?|TIMEZONE → PREVIOUS_1_CALENDAR_(UNIT)|TIMEZONE
  const lastPeriod = /^LAST_(?<unit>DAY|WEEK|MONTH|QUARTER|YEAR)S?(?:\|(?<timezone>[^|]+))?$/.exec(query)
  if (lastPeriod?.groups) {
    return withTimezone(`PREVIOUS_1_CALENDAR_${lastPeriod.groups.unit}`, lastPeriod.groups.timezone)
  }

  /**
   * Note: Custom presets on the old date range picker stored a past relative window as an amount plus a
   * suffix (`24h`, `7d`, `30d`, `90d`, `1y`, and also `1m`, `2w`, `1M`).
   */
  // AMOUNT(m|h|d|w|M|y) → LAST_AMOUNT_(MINUTE|HOUR|DAY|WEEK|MONTH|YEAR)S?
  const shortRelative = /^(?<amount>\d+)(?<suffix>[mhdwMy])$/.exec(query)
  if (shortRelative?.groups) {
    const amount = parseAmount(shortRelative.groups.amount)
    const unit = SHORT_RELATIVE_UNIT[shortRelative.groups.suffix]
    if (amount !== undefined && unit) return `LAST_${amount}_${unitToken(unit, amount)}`
  }

  /**
   * Note: A fixed window from the old picker can be stored as `epochStart-epochEnd`.
   * The epochs are UTC, same as a CUSTOM query that has no timezone.
   */
  // epochStart-epochEnd → FIXED|yyyy-MM-ddTHH:mm:ss|yyyy-MM-ddTHH:mm:ss
  const epochPair = /^(?<from>-?\d+)-(?<to>-?\d+)$/.exec(query)
  if (epochPair?.groups) {
    const fromMs = parseEpoch(epochPair.groups.from)
    const toMs = parseEpoch(epochPair.groups.to)
    if (fromMs !== undefined && toMs !== undefined) {
      const zone = resolveTimeZone(DEFAULT_TIME_ZONE)
      return `FIXED|${utcToCivilDateTime(new Date(fromMs), zone)}|${utcToCivilDateTime(new Date(toMs), zone)}`
    }
  }

  return query
}

/**
 * Relative, calendar, or fixed range inside a current rangeQuery, plus its timezone.
 * A missing timezone is UTC.
 */
export const parseRangeQuery = (
  rangeQuery: string
): { range: ResolvableDateRangeV2; timezone: TimeZoneId } | undefined => {
  const query = decodeRangeQuery(rangeQuery)
  if (!query) return undefined

  // FIXED|yyyy-MM-ddTHH:mm:ss|yyyy-MM-ddTHH:mm:ss|TIMEZONE
  const fixed = /^FIXED\|(?<from>[^|]+)\|(?<to>[^|]+)(?:\|(?<timezone>[^|]+))?$/.exec(query)
  if (fixed?.groups) {
    const { from, to } = fixed.groups
    const timezone = parseTimezone(fixed.groups.timezone)
    if (!isCivilDateTime(from) || !isCivilDateTime(to) || !timezone) return undefined
    return { range: { kind: 'fixed', from, to }, timezone }
  }

  // (LAST|NEXT)_AMOUNT_(MINUTE|HOUR|DAY|WEEK|MONTH|YEAR)S?|TIMEZONE
  const relative =
    /^(?<direction>LAST|NEXT)_(?<amount>\d+)_(?<unit>MINUTE|HOUR|DAY|WEEK|MONTH|YEAR)S?(?:\|(?<timezone>[^|]+))?$/.exec(
      query
    )
  if (relative?.groups) {
    const amount = parseAmount(relative.groups.amount)
    const timezone = parseTimezone(relative.groups.timezone)
    if (amount === undefined || !timezone) return undefined
    return {
      range: {
        kind: 'relative',
        direction: relative.groups.direction === 'LAST' ? 'last' : 'next',
        amount,
        unit: relative.groups.unit.toLowerCase() as RelativeUnit
      },
      timezone
    }
  }

  // THIS_(DAY|WEEK|MONTH|QUARTER|YEAR)(_SO_FAR|_FROM_NOW)?|TIMEZONE
  const current =
    /^THIS_(?<unit>DAY|WEEK|MONTH|QUARTER|YEAR)S?(?:_(?<extent>SO_FAR|FROM_NOW))?(?:\|(?<timezone>[^|]+))?$/.exec(query)
  if (current?.groups) {
    const timezone = parseTimezone(current.groups.timezone)
    if (!timezone) return undefined
    return {
      range: {
        kind: 'calendar',
        position: 'this',
        unit: current.groups.unit.toLowerCase() as CalendarUnit,
        extent: parseExtent(current.groups.extent)
      },
      timezone
    }
  }

  // (PREVIOUS|NEXT)_AMOUNT_CALENDAR_(DAY|WEEK|MONTH|QUARTER|YEAR)S?|TIMEZONE
  const calendar =
    /^(?<direction>PREVIOUS|NEXT)_(?<amount>\d+)_CALENDAR_(?<unit>DAY|WEEK|MONTH|QUARTER|YEAR)S?(?:\|(?<timezone>[^|]+))?$/.exec(
      query
    )
  if (calendar?.groups) {
    const amount = parseAmount(calendar.groups.amount)
    const timezone = parseTimezone(calendar.groups.timezone)
    if (amount === undefined || !timezone) return undefined
    return {
      range: {
        kind: 'calendar',
        position: calendar.groups.direction === 'NEXT' ? 'next' : 'previous',
        amount,
        unit: calendar.groups.unit.toLowerCase() as CalendarUnit
      },
      timezone
    }
  }

  return undefined
}

/**
 * Parses and serializes a RelativeRange, CalendarRange, or FixedRange using the current rangeQuery grammar.
 *
 * `parse` first uses `migrateDateRangeV2RangeQuery` to rewrite a legacy rangeQuery into the current grammar.
 * Then `parseRangeQuery` reads that string as a ResolvableDateRangeV2.
 * Then `resolveDateRangeV2` fills `from` and `to`, returning a ResolvableDateRangeV2Value.
 *
 * `serialize` converts `ResolvableDateRangeV2Value` to a rangeQuery string using the current grammar.
 * An undefined value is an empty string, which drops the filter query.
 */
export const dateRangeV2FilterParser = {
  parse: (rangeQuery: string, now: Date = new Date()): ResolvableDateRangeV2Value | undefined => {
    const parsed = parseRangeQuery(migrateDateRangeV2RangeQuery(rangeQuery))
    if (!parsed) return undefined
    return resolveDateRangeV2({ range: parsed.range, timezone: parsed.timezone }, now)
  },
  /** A rangeQuery for a relative, calendar, or fixed range. An undefined value is an empty string. */
  serialize: (value?: ResolvableDateRangeV2Value): string => {
    if (!value) return ''
    const timezone = timezoneOf(value.timezone)
    const range = value.range
    switch (range.kind) {
      case 'fixed':
        // FIXED|yyyy-MM-ddTHH:mm:ss|yyyy-MM-ddTHH:mm:ss|TIMEZONE
        return `FIXED|${range.from}|${range.to}|${timezone}`
      case 'relative':
        // (LAST|NEXT)_AMOUNT_(MINUTE|HOUR|DAY|WEEK|MONTH|YEAR)S?|TIMEZONE
        return `${range.direction.toUpperCase()}_${range.amount}_${unitToken(range.unit, range.amount)}|${timezone}`
      case 'calendar': {
        if (range.position === 'this') {
          // THIS_(DAY|WEEK|MONTH|QUARTER|YEAR)(_SO_FAR|_FROM_NOW)?|TIMEZONE
          const unit = unitToken(range.unit, 1)
          const extent = range.extent === 'full' ? '' : `_${range.extent.toUpperCase()}`
          return `THIS_${unit}${extent}|${timezone}`
        }
        // (PREVIOUS|NEXT)_AMOUNT_CALENDAR_(DAY|WEEK|MONTH|QUARTER|YEAR)S?|TIMEZONE
        return `${range.position.toUpperCase()}_${range.amount}_CALENDAR_${unitToken(range.unit, range.amount)}|${timezone}`
      }
    }
  }
}

/**
 * Parses and serializes a PresetRange from the PresetModeConfig provided by the user.
 * `parse` uses `preset.getRange({ timezone })` to turn the rangeQuery into a PresetRange value.
 * `serialize` writes `preset.value` as the rangeQuery string. An undefined value is an empty string.
 *
 * Every other rangeQuery is handled by `dateRangeV2FilterParser`.
 */
export const createDateRangeV2FilterParser = (config?: DateRangeV2Config) => {
  const normalizedPresets = normalizePresets(config?.modes?.find(mode => mode.mode === 'presets')?.presets)
  const matchPreset = (token: string): DateRangeV2Preset | undefined =>
    normalizedPresets.find(preset => preset.value === token)

  return {
    parse: (rangeQuery: string, now: Date = new Date()): DateRangeV2Value | undefined => {
      const query = decodeRangeQuery(rangeQuery)
      if (!query) return undefined

      const parts = query.split('|')
      // `FIXED` is the fixed-range query. A preset with that id would replace those bounds.
      if (parts && parts.length <= 2 && parts[0] !== 'FIXED') {
        const [presetToken, timezoneToken] = parts
        const preset = presetToken ? matchPreset(presetToken) : undefined
        if (preset) {
          const timezone = timezoneToken || DEFAULT_TIME_ZONE
          const { from, to } = resolvePresetBounds(preset, timezone)
          return { from, to, range: { kind: 'preset', preset: preset.value }, timezone }
        }
      }
      return dateRangeV2FilterParser.parse(rangeQuery, now)
    },
    serialize: (value?: DateRangeV2Value): string => {
      if (!value) return ''
      const { range } = value
      if (range.kind === 'preset') {
        // PRESET|TIMEZONE
        return `${range.preset}|${timezoneOf(value.timezone)}`
      }
      return dateRangeV2FilterParser.serialize({ ...value, range })
    }
  }
}
