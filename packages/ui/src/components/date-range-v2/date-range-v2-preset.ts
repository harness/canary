import { resolveDateRangeV2At, resolveTimeZone } from './resolve-date-range-v2'
import { utcToCivilDate, utcToCivilTime } from './timezone-utils'
import type {
  CalendarExtent,
  CalendarRange,
  CalendarUnit,
  DateRangeV2Range,
  DateRangeV2State,
  DateRangeV2Value,
  FixedRange,
  RollingUnit,
  TimeZoneId,
  Weekday
} from './types'

const ROLLING_UNITS = ['minute', 'hour', 'day', 'week', 'month', 'year'] as const
const CALENDAR_UNITS = ['day', 'week', 'month', 'quarter', 'year'] as const

const unitToken = (unit: string, amount: number): string => {
  const word = unit.toUpperCase()
  return amount === 1 ? word : `${word}S`
}

const parseUnit = (token: string): RollingUnit | CalendarUnit | undefined => {
  const singular = token.endsWith('S') ? token.slice(0, -1) : token
  const unit = singular.toLowerCase()
  if ((CALENDAR_UNITS as readonly string[]).includes(unit)) return unit as CalendarUnit
  if ((ROLLING_UNITS as readonly string[]).includes(unit)) return unit as RollingUnit
  return undefined
}

const isRollingUnit = (unit: RollingUnit | CalendarUnit): unit is RollingUnit =>
  (ROLLING_UNITS as readonly string[]).includes(unit)

const isCalendarUnit = (unit: RollingUnit | CalendarUnit): unit is CalendarUnit =>
  (CALENDAR_UNITS as readonly string[]).includes(unit)

/**
 * Default presets from the previous date range field whose ids are not the DateRangeV2 form.
 * Rolling ids such as LAST_7_DAYS and to-date ids such as THIS_MONTH already match.
 */
const LEGACY_DEFAULT_PRESETS: Record<string, string> = {
  CURRENT_MONTH: 'THIS_MONTH',
  LAST_MONTH: 'LAST_1_CALENDAR_MONTH',
  LAST_QUARTER: 'LAST_1_CALENDAR_QUARTER',
  LAST_YEAR: 'LAST_1_CALENDAR_YEAR'
}

export const migrateDefaultPreset = (preset: string): string => {
  const token = preset.trim().toUpperCase()
  return LEGACY_DEFAULT_PRESETS[token] ?? token
}

const extentToken = (extent: CalendarExtent): string =>
  extent === 'full' ? 'FULL' : extent === 'from_now' ? 'FROM_NOW' : 'TO_DATE'

const parseExtent = (token: string | undefined): CalendarExtent =>
  token === 'FULL' ? 'full' : token === 'FROM_NOW' ? 'from_now' : 'to_date'

export const formatDateRangeV2Preset = (range: DateRangeV2Range): string => {
  if (range.kind === 'fixed') return 'CUSTOM'
  if (range.kind === 'rolling') {
    const direction = range.direction === 'past' ? 'LAST' : 'NEXT'
    return `${direction}_${range.amount}_${unitToken(range.unit, range.amount)}`
  }
  if (range.position === 'current') {
    const unit = unitToken(range.unit, 1)
    return range.extent === 'to_date' ? `THIS_${unit}` : `THIS_${unit}_${extentToken(range.extent)}`
  }
  const direction = range.position === 'previous' ? 'LAST' : 'NEXT'
  return `${direction}_${range.amount}_CALENDAR_${unitToken(range.unit, range.amount)}`
}

export const parseDateRangeV2Preset = (preset: string): DateRangeV2Range | undefined => {
  const token = migrateDefaultPreset(preset)
  if (token === 'CUSTOM') return undefined

  const current = /^(?:THIS|CURRENT)_([A-Z]+?)(?:_(TO_DATE|FULL|FROM_NOW))?$/.exec(token)
  if (current) {
    const unit = parseUnit(current[1])
    if (!unit || !isCalendarUnit(unit)) return undefined
    return { kind: 'calendar', position: 'current', unit, extent: parseExtent(current[2]) }
  }

  const calendarAmount = /^(LAST|NEXT)_(\d+)_CALENDAR_([A-Z]+)$/.exec(token)
  if (calendarAmount) {
    return calendarRange(calendarAmount[1], Number(calendarAmount[2]), calendarAmount[3])
  }

  const calendarAlias = /^(LAST|NEXT)_([A-Z]+)$/.exec(token)
  if (calendarAlias && !/^\d/.test(calendarAlias[2])) {
    const parsed = calendarRange(calendarAlias[1], 1, calendarAlias[2])
    if (parsed) return parsed
  }

  const rolling = /^(LAST|NEXT)_(\d+)_([A-Z]+)$/.exec(token)
  if (!rolling) return undefined
  const unit = parseUnit(rolling[3])
  const amount = Number(rolling[2])
  if (!unit || !isRollingUnit(unit) || !Number.isInteger(amount) || amount < 1) return undefined
  return { kind: 'rolling', direction: rolling[1] === 'LAST' ? 'past' : 'future', amount, unit }
}

const calendarRange = (direction: string, amount: number, unitTokenValue: string): CalendarRange | undefined => {
  const unit = parseUnit(unitTokenValue)
  if (!unit || !isCalendarUnit(unit) || !Number.isInteger(amount) || amount < 1) {
    return undefined
  }
  return {
    kind: 'calendar',
    position: direction === 'LAST' ? 'previous' : 'next',
    amount,
    unit
  }
}

const fixedRangeFromBounds = (from: Date, to: Date, timezone?: TimeZoneId): FixedRange => {
  const zone = resolveTimeZone(timezone)
  return {
    kind: 'fixed',
    from: { date: utcToCivilDate(from, zone), time: utcToCivilTime(from, zone) },
    to: { date: utcToCivilDate(to, zone), time: utcToCivilTime(to, zone) }
  }
}

export const dateRangeV2StateFromValue = (value: DateRangeV2Value): DateRangeV2State => {
  const preset = value.preset ? migrateDefaultPreset(value.preset) : undefined
  const range = preset && preset !== 'CUSTOM' ? parseDateRangeV2Preset(preset) : undefined
  return {
    version: 1,
    range: range ?? fixedRangeFromBounds(new Date(value.from), new Date(value.to), value.timezone)
  }
}

export const toDateRangeV2Value = (
  value: DateRangeV2State,
  timezone: TimeZoneId = 'UTC',
  now: Date = new Date(),
  weekStartsOn: Weekday = 1
): DateRangeV2Value => {
  const [start, end] = resolveDateRangeV2At(value, now, timezone, weekStartsOn)
  return {
    from: new Date(start),
    to: new Date(end),
    preset: formatDateRangeV2Preset(value.range),
    timezone
  }
}

export const refreshDateRangeV2Value = (
  value: DateRangeV2Value,
  now: Date = new Date(),
  weekStartsOn: Weekday = 1
): DateRangeV2Value => {
  if (!value.preset || value.preset.toUpperCase() === 'CUSTOM') {
    return { ...value, preset: 'CUSTOM', timezone: value.timezone ?? 'UTC' }
  }
  return toDateRangeV2Value(dateRangeV2StateFromValue(value), value.timezone ?? 'UTC', now, weekStartsOn)
}
