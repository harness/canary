import { isCivilDate, isCivilTime, normalizeTimeZone, utcToCivilDate, utcToCivilTime } from './timezone-utils'
import {
  AbsoluteDateRangeValue,
  CalendarPeriod,
  DateRangeInput,
  DateRangeUnit,
  DateRangeValue,
  DEFAULT_TIME_ZONE,
  LegacyDateRangeValue,
  RelativeAdjustment,
  ThisPeriodExtent,
  TimeZoneId,
  Weekday
} from './types'

const UNITS: DateRangeUnit[] = ['minute', 'hour', 'day', 'week', 'month', 'quarter', 'year']
const PERIODS: CalendarPeriod[] = [
  'this_week',
  'last_week',
  'next_week',
  'this_month',
  'last_month',
  'next_month',
  'this_quarter',
  'last_quarter',
  'next_quarter',
  'this_year',
  'last_year',
  'next_year'
]
const EXTENTS: ThisPeriodExtent[] = ['full', 'to_now']

type DateRangeValueWithoutTimeZone = DateRangeValue extends infer Value
  ? Value extends DateRangeValue
    ? Omit<Value, 'timeZone'>
    : never
  : never

const LEGACY_PRESETS: Record<string, DateRangeValueWithoutTimeZone> = {
  LAST_7_DAYS: { kind: 'relative', direction: 'past', amount: 7, unit: 'day' },
  LAST_30_DAYS: { kind: 'relative', direction: 'past', amount: 30, unit: 'day' },
  LAST_3_MONTHS: { kind: 'relative', direction: 'past', amount: 3, unit: 'month' },
  LAST_6_MONTHS: { kind: 'relative', direction: 'past', amount: 6, unit: 'month' },
  LAST_12_MONTHS: { kind: 'relative', direction: 'past', amount: 12, unit: 'month' },
  CURRENT_MONTH: { kind: 'calendar', period: 'this_month', extent: 'to_now' },
  THIS_MONTH: { kind: 'calendar', period: 'this_month', extent: 'to_now' },
  THIS_QUARTER: { kind: 'calendar', period: 'this_quarter', extent: 'to_now' },
  THIS_YEAR: { kind: 'calendar', period: 'this_year', extent: 'to_now' },
  LAST_MONTH: { kind: 'calendar', period: 'last_month' },
  LAST_QUARTER: { kind: 'calendar', period: 'last_quarter' },
  LAST_YEAR: { kind: 'calendar', period: 'last_year' }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const normalizeWeekdays = (value: unknown): Weekday[] | undefined => {
  if (!Array.isArray(value) || value.some(day => !Number.isInteger(day) || day < 0 || day > 6)) return undefined
  return [...new Set(value as Weekday[])].sort()
}

const normalizeAdjustment = (value: unknown, direction: 'past' | 'future'): RelativeAdjustment | undefined => {
  if (!isRecord(value)) return undefined

  if (value.type === 'offset') {
    if (direction !== 'past' || !isRecord(value.offset)) return undefined
    const amount = value.offset.amount
    const unit = value.offset.unit
    return Number.isInteger(amount) && Number(amount) > 0 && UNITS.includes(unit as DateRangeUnit)
      ? { type: 'offset', offset: { amount: Number(amount), unit: unit as DateRangeUnit } }
      : undefined
  }

  if (value.type === 'exclude' && isRecord(value.exclude)) {
    const weekdays = normalizeWeekdays(value.exclude.weekdays)
    const incompleteInterval =
      typeof value.exclude.incompleteInterval === 'boolean' ? value.exclude.incompleteInterval : undefined
    if (!incompleteInterval && !weekdays?.length) return undefined
    return { type: 'exclude', exclude: { incompleteInterval, weekdays } }
  }

  return undefined
}

const normalizeSemanticValue = (
  input: Record<string, unknown>,
  fallbackTimeZone: TimeZoneId
): DateRangeValue | undefined => {
  const timeZone = normalizeTimeZone(input.timeZone, fallbackTimeZone)

  if (input.kind === 'relative') {
    if (
      (input.direction !== 'past' && input.direction !== 'future') ||
      !Number.isInteger(input.amount) ||
      Number(input.amount) < 1 ||
      !UNITS.includes(input.unit as DateRangeUnit)
    ) {
      return undefined
    }

    const adjustment = normalizeAdjustment(input.adjustment, input.direction)
    return {
      kind: 'relative',
      direction: input.direction,
      amount: Number(input.amount),
      unit: input.unit as DateRangeUnit,
      timeZone,
      ...(adjustment ? { adjustment } : {})
    } as DateRangeValue
  }

  if (input.kind === 'calendar') {
    if (!PERIODS.includes(input.period as CalendarPeriod)) return undefined
    const extent = EXTENTS.includes(input.extent as ThisPeriodExtent) ? (input.extent as ThisPeriodExtent) : undefined
    return {
      kind: 'calendar',
      period: input.period as CalendarPeriod,
      timeZone,
      ...(String(input.period).startsWith('this_') && extent ? { extent } : {})
    }
  }

  if (input.kind === 'absolute' && isRecord(input.from) && isRecord(input.to)) {
    if (
      !isCivilDate(input.from.date) ||
      !isCivilDate(input.to.date) ||
      (input.from.time !== undefined && !isCivilTime(input.from.time)) ||
      (input.to.time !== undefined && !isCivilTime(input.to.time))
    ) {
      return undefined
    }
    return {
      kind: 'absolute',
      timeZone,
      from: { date: input.from.date, ...(input.from.time ? { time: input.from.time } : {}) },
      to: { date: input.to.date, ...(input.to.time ? { time: input.to.time } : {}) }
    }
  }

  return undefined
}

const toDate = (value: Date | string | number): Date | undefined => {
  const date = value instanceof Date ? new Date(value) : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const normalizeLegacy = (
  input: LegacyDateRangeValue,
  fallbackTimeZone: TimeZoneId
): AbsoluteDateRangeValue | DateRangeValue | undefined => {
  const preset = input.preset ? LEGACY_PRESETS[input.preset] : undefined
  if (preset) return { ...preset, timeZone: fallbackTimeZone } as DateRangeValue

  const from = toDate(input.from)
  const to = toDate(input.to)
  if (!from || !to) return undefined

  const fromTime = utcToCivilTime(from, fallbackTimeZone)
  const toTime = utcToCivilTime(to, fallbackTimeZone)
  return {
    kind: 'absolute',
    timeZone: fallbackTimeZone,
    from: {
      date: utcToCivilDate(from, fallbackTimeZone),
      ...(fromTime === '00:00' ? {} : { time: fromTime })
    },
    to: {
      date: utcToCivilDate(to, fallbackTimeZone),
      ...(toTime === '00:00' ? {} : { time: toTime })
    }
  }
}

export const isDateRangeValue = (value: unknown): value is DateRangeValue =>
  isRecord(value) && (value.kind === 'relative' || value.kind === 'calendar' || value.kind === 'absolute')

export const normalizeDateRangeValue = (
  input: DateRangeInput | unknown,
  fallbackTimeZone: TimeZoneId = DEFAULT_TIME_ZONE
): DateRangeValue | undefined => {
  if (!isRecord(input)) return undefined
  const safeFallback = normalizeTimeZone(fallbackTimeZone)
  return 'kind' in input
    ? normalizeSemanticValue(input, safeFallback)
    : 'from' in input && 'to' in input
      ? normalizeLegacy(input as unknown as LegacyDateRangeValue, safeFallback)
      : undefined
}
