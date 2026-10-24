import { normalizePresets } from './normalize-picker-config'
import { resolveDateRangeV2, resolvePresetBounds } from './resolve-date-range-v2'
import { isCivilDateTime } from './timezone-utils'
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

const decodeRangeQuery = (rangeQuery: string): string | undefined => {
  if (!rangeQuery) return undefined
  try {
    return decodeURIComponent(rangeQuery)
  } catch {
    return undefined
  }
}

/**
 * Relative, calendar, or fixed range inside a rangeQuery, plus its timezone.
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

  /**
   * Note: `_FULL` is kept because there was a bug in the previous implementation, which
   * wrote a full period as `THIS_MONTH_FULL` and so far as `THIS_MONTH`.
   * Serialize now writes a full period as `THIS_MONTH` and never writes `_FULL`.
   * `THIS_MONTH_FULL` still parses as the full period, so queries saved by that bug keep working.
   */
  // THIS_(DAY|WEEK|MONTH|QUARTER|YEAR)(_SO_FAR|_FULL|_FROM_NOW)?|TIMEZONE
  const current =
    /^THIS_(?<unit>DAY|WEEK|MONTH|QUARTER|YEAR)S?(?:_(?<extent>SO_FAR|FULL|FROM_NOW))?(?:\|(?<timezone>[^|]+))?$/.exec(
      query
    )
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

  // LAST_WEEK and NEXT_MONTH are one calendar period.
  const calendarAlias =
    /^(?<direction>LAST|NEXT)_(?<unit>DAY|WEEK|MONTH|QUARTER|YEAR)S?(?:\|(?<timezone>[^|]+))?$/.exec(query)
  if (calendarAlias?.groups) {
    const timezone = parseTimezone(calendarAlias.groups.timezone)
    if (!timezone) return undefined
    return {
      range: {
        kind: 'calendar',
        position: calendarAlias.groups.direction === 'NEXT' ? 'next' : 'previous',
        amount: 1,
        unit: calendarAlias.groups.unit.toLowerCase() as CalendarUnit
      },
      timezone
    }
  }

  return undefined
}

export const dateRangeV2FilterParser = {
  parse: (rangeQuery: string, now: Date = new Date()): ResolvableDateRangeV2Value | undefined => {
    const parsed = parseRangeQuery(rangeQuery)
    if (!parsed) return undefined
    return resolveDateRangeV2({ range: parsed.range, timezone: parsed.timezone }, now)
  },
  /** A rangeQuery for a relative, calendar, or fixed range. */
  serialize: (value: ResolvableDateRangeV2Value): string => {
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
 * Ids from the previous date range field.
 * `LAST_MONTH`, `LAST_QUARTER`, and `LAST_YEAR` become the previous calendar period.
 * Relative ids such as `LAST_7_DAYS` already match.
 */
const LEGACY_RANGE_IDS: Record<string, string> = {
  LAST_MONTH: 'PREVIOUS_1_CALENDAR_MONTH',
  LAST_QUARTER: 'PREVIOUS_1_CALENDAR_QUARTER',
  LAST_YEAR: 'PREVIOUS_1_CALENDAR_YEAR'
}

/** Rewrites a migrateable id and keeps the timezone piece. */
const migrateLegacyRangeQuery = (parts: string[]): string | undefined => {
  const migrated = LEGACY_RANGE_IDS[parts[0].trim().toUpperCase()]
  return migrated ? [migrated, ...parts.slice(1)].join('|') : undefined
}

/**
 * Filter parser for one DateRangeV2 option.
 * A PresetRange is `PRESET` or `PRESET|TIMEZONE` and reloads through `getRange({ timezone })`.
 * `LAST_MONTH`, `LAST_QUARTER`, and `LAST_YEAR` are rewritten, then parsed by `dateRangeV2FilterParser`.
 * Every other rangeQuery uses `dateRangeV2FilterParser` as-is.
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
      const migrated = parts ? migrateLegacyRangeQuery(parts) : undefined
      return dateRangeV2FilterParser.parse(migrated ?? rangeQuery, now)
    },
    serialize: (value: DateRangeV2Value): string => {
      const { range } = value
      if (range.kind === 'preset') {
        // PRESET|TIMEZONE
        return `${range.preset}|${timezoneOf(value.timezone)}`
      }
      return dateRangeV2FilterParser.serialize({ ...value, range })
    }
  }
}
