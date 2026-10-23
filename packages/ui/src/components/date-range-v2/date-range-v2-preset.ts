import { resolveTimeZone } from './resolve-date-range-v2'
import { utcToCivilDateTime } from './timezone-utils'
import type {
  CalendarExtent,
  CalendarRange,
  CalendarUnit,
  FixedRange,
  RelativeUnit,
  ResolvableDateRangeV2,
  TimeZoneId
} from './types'

const RELATIVE_UNITS = ['minute', 'hour', 'day', 'week', 'month', 'year'] as const
const CALENDAR_UNITS = ['day', 'week', 'month', 'quarter', 'year'] as const

const unitToken = (unit: string, amount: number): string => {
  const word = unit.toUpperCase()
  return amount === 1 ? word : `${word}S`
}

const parseUnit = (token: string): RelativeUnit | CalendarUnit | undefined => {
  const singular = token.endsWith('S') ? token.slice(0, -1) : token
  const unit = singular.toLowerCase()
  if ((CALENDAR_UNITS as readonly string[]).includes(unit)) return unit as CalendarUnit
  if ((RELATIVE_UNITS as readonly string[]).includes(unit)) return unit as RelativeUnit
  return undefined
}

const isRelativeUnit = (unit: RelativeUnit | CalendarUnit): unit is RelativeUnit =>
  (RELATIVE_UNITS as readonly string[]).includes(unit)

const isCalendarUnit = (unit: RelativeUnit | CalendarUnit): unit is CalendarUnit =>
  (CALENDAR_UNITS as readonly string[]).includes(unit)

/**
 * Default presets from the previous date range field whose ids are not the DateRangeV2 form.
 * Relative ids such as LAST_7_DAYS already match.
 * A current period is `THIS_MONTH` for the full period, `THIS_MONTH_SO_FAR`, or `THIS_MONTH_FROM_NOW`.
 */
const LEGACY_DEFAULT_PRESETS: Record<string, string> = {
  LAST_MONTH: 'PREVIOUS_1_CALENDAR_MONTH',
  LAST_QUARTER: 'PREVIOUS_1_CALENDAR_QUARTER',
  LAST_YEAR: 'PREVIOUS_1_CALENDAR_YEAR'
}

export const migrateDefaultPreset = (preset: string): string => {
  const token = preset.trim().toUpperCase()
  return LEGACY_DEFAULT_PRESETS[token] ?? token
}

const parseExtent = (token: string | undefined): CalendarExtent =>
  token === 'SO_FAR' ? 'so_far' : token === 'FROM_NOW' ? 'from_now' : 'full'

export const formatDateRangeV2Preset = (range: ResolvableDateRangeV2): string => {
  if (range.kind === 'fixed') return 'FIXED'
  if (range.kind === 'relative') {
    const direction = range.direction === 'last' ? 'LAST' : 'NEXT'
    return `${direction}_${range.amount}_${unitToken(range.unit, range.amount)}`
  }
  if (range.position === 'this') {
    const unit = unitToken(range.unit, 1)
    if (range.extent === 'so_far') return `THIS_${unit}_SO_FAR`
    if (range.extent === 'from_now') return `THIS_${unit}_FROM_NOW`
    return `THIS_${unit}`
  }
  const direction = range.position === 'previous' ? 'PREVIOUS' : 'NEXT'
  return `${direction}_${range.amount}_CALENDAR_${unitToken(range.unit, range.amount)}`
}

export const parseDateRangeV2Preset = (preset: string): ResolvableDateRangeV2 | undefined => {
  const token = migrateDefaultPreset(preset)
  if (token === 'FIXED') return undefined

  const current = /^THIS_([A-Z]+?)(?:_(SO_FAR|FULL|FROM_NOW))?$/.exec(token)
  if (current) {
    const unit = parseUnit(current[1])
    if (!unit || !isCalendarUnit(unit)) return undefined
    return { kind: 'calendar', position: 'this', unit, extent: parseExtent(current[2]) }
  }

  const calendarAmount = /^(PREVIOUS|NEXT)_(\d+)_CALENDAR_([A-Z]+)$/.exec(token)
  if (calendarAmount) {
    return calendarRange(calendarAmount[1], Number(calendarAmount[2]), calendarAmount[3])
  }

  const calendarAlias = /^(LAST|NEXT)_([A-Z]+)$/.exec(token)
  if (calendarAlias && !/^\d/.test(calendarAlias[2])) {
    const parsed = calendarRange(calendarAlias[1], 1, calendarAlias[2])
    if (parsed) return parsed
  }

  const relative = /^(LAST|NEXT)_(\d+)_([A-Z]+)$/.exec(token)
  if (!relative) return undefined
  const unit = parseUnit(relative[3])
  const amount = Number(relative[2])
  if (!unit || !isRelativeUnit(unit) || !Number.isInteger(amount) || amount < 1) return undefined
  return { kind: 'relative', direction: relative[1] === 'LAST' ? 'last' : 'next', amount, unit }
}

const calendarRange = (direction: string, amount: number, unitTokenValue: string): CalendarRange | undefined => {
  const unit = parseUnit(unitTokenValue)
  if (!unit || !isCalendarUnit(unit) || !Number.isInteger(amount) || amount < 1) {
    return undefined
  }
  return {
    kind: 'calendar',
    position: direction === 'NEXT' ? 'next' : 'previous',
    amount,
    unit
  }
}

/** Civil fixed range for instants already stored as epochs. */
export const fixedRangeFromBounds = (from: Date, to: Date, timezone?: TimeZoneId): FixedRange => {
  const zone = resolveTimeZone(timezone)
  return {
    kind: 'fixed',
    from: utcToCivilDateTime(from, zone),
    to: utcToCivilDateTime(to, zone)
  }
}
