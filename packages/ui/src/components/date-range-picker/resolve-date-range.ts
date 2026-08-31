import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear
} from 'date-fns'

import {
  addCivilDays,
  fromZonedWallTime,
  isCivilDate,
  isCivilTime,
  normalizeTimeZone,
  toZonedWallTime,
  zonedCivilToUtc
} from './timezone-utils'
import {
  AbsoluteDateRangeValue,
  CalendarDateRangeValue,
  DateRangeUnit,
  DateRangeValue,
  ResolveDateRangeOptions,
  ResolvedDateRange,
  TimeZoneId,
  Weekday
} from './types'

const unitAdders: Record<DateRangeUnit, (date: Date, amount: number) => Date> = {
  minute: addMinutes,
  hour: addHours,
  day: addDays,
  week: addWeeks,
  month: addMonths,
  quarter: addQuarters,
  year: addYears
}

const addZoned = (instant: Date, amount: number, unit: DateRangeUnit, timeZone: TimeZoneId): Date =>
  unit === 'minute' || unit === 'hour'
    ? unitAdders[unit](instant, amount)
    : fromZonedWallTime(unitAdders[unit](toZonedWallTime(instant, timeZone), amount), timeZone)

const startOfZonedUnit = (
  instant: Date,
  unit: Exclude<DateRangeUnit, 'minute' | 'hour'>,
  timeZone: TimeZoneId,
  weekStartsOn: Weekday
): Date => {
  const wallTime = toZonedWallTime(instant, timeZone)
  const start =
    unit === 'day'
      ? new Date(wallTime.getFullYear(), wallTime.getMonth(), wallTime.getDate(), 0, 0, 0, 0)
      : unit === 'week'
        ? startOfWeek(wallTime, { weekStartsOn })
        : unit === 'month'
          ? startOfMonth(wallTime)
          : unit === 'quarter'
            ? startOfQuarter(wallTime)
            : startOfYear(wallTime)
  return fromZonedWallTime(start, timeZone)
}

const resolveRelative = (
  value: Extract<DateRangeValue, { kind: 'relative' }>,
  now: Date,
  weekStartsOn: Weekday
): Pick<ResolvedDateRange, 'from' | 'to' | 'excludeWeekdays'> => {
  const { amount, direction, unit, timeZone } = value
  if (!Number.isInteger(amount) || amount < 1) throw new RangeError('Relative amount must be a positive integer')

  const exclusion = value.adjustment?.type === 'exclude' ? value.adjustment.exclude : undefined
  const excludesIncomplete = Boolean(exclusion?.incompleteInterval)
  let from: Date
  let to: Date

  if (unit === 'minute' || unit === 'hour') {
    from = direction === 'past' ? addZoned(now, -amount, unit, timeZone) : now
    to = direction === 'future' ? addZoned(now, amount, unit, timeZone) : now
  } else {
    const currentStart = startOfZonedUnit(now, unit, timeZone, weekStartsOn)

    if (direction === 'past') {
      to = excludesIncomplete ? currentStart : now
      from = addZoned(currentStart, excludesIncomplete ? -amount : -(amount - 1), unit, timeZone)
    } else {
      from = excludesIncomplete ? addZoned(currentStart, 1, unit, timeZone) : now
      to = addZoned(currentStart, excludesIncomplete ? amount + 1 : amount, unit, timeZone)
    }
  }

  if (value.direction === 'past' && value.adjustment?.type === 'offset') {
    const { amount: offsetAmount, unit: offsetUnit } = value.adjustment.offset
    if (!Number.isInteger(offsetAmount) || offsetAmount < 1) {
      throw new RangeError('Relative offset must be a positive integer')
    }
    from = addZoned(from, -offsetAmount, offsetUnit, timeZone)
    to = addZoned(to, -offsetAmount, offsetUnit, timeZone)
  }

  return {
    from,
    to,
    excludeWeekdays: [...new Set(exclusion?.weekdays ?? [])].sort() as Weekday[]
  }
}

const calendarUnit = (period: CalendarDateRangeValue['period']): 'week' | 'month' | 'quarter' | 'year' => {
  if (period.endsWith('_week')) return 'week'
  if (period.endsWith('_month')) return 'month'
  if (period.endsWith('_quarter')) return 'quarter'
  return 'year'
}

const resolveCalendar = (
  value: CalendarDateRangeValue,
  now: Date,
  weekStartsOn: Weekday
): Pick<ResolvedDateRange, 'from' | 'to' | 'excludeWeekdays'> => {
  const unit = calendarUnit(value.period)
  const currentStart = startOfZonedUnit(now, unit, value.timeZone, weekStartsOn)
  const relativePosition = value.period.startsWith('last_') ? -1 : value.period.startsWith('next_') ? 1 : 0
  const from = addZoned(currentStart, relativePosition, unit, value.timeZone)
  const to =
    relativePosition === 0 && value.extent === 'to_now'
      ? now
      : addZoned(currentStart, relativePosition + 1, unit, value.timeZone)
  return { from, to, excludeWeekdays: [] }
}

const resolveAbsolute = (value: AbsoluteDateRangeValue): Pick<ResolvedDateRange, 'from' | 'to' | 'excludeWeekdays'> => {
  if (
    !isCivilDate(value.from.date) ||
    !isCivilDate(value.to.date) ||
    (value.from.time !== undefined && !isCivilTime(value.from.time)) ||
    (value.to.time !== undefined && !isCivilTime(value.to.time))
  ) {
    throw new RangeError('Absolute date range contains an invalid civil date or time')
  }

  const from = zonedCivilToUtc(value.from.date, value.from.time ?? '00:00', value.timeZone)
  const to = value.to.time
    ? addMinutes(zonedCivilToUtc(value.to.date, value.to.time, value.timeZone), 1)
    : zonedCivilToUtc(addCivilDays(value.to.date, 1), '00:00', value.timeZone)
  return { from, to, excludeWeekdays: [] }
}

export const resolveDateRange = (input: DateRangeValue, options: ResolveDateRangeOptions = {}): ResolvedDateRange => {
  const now = options.now ?? new Date()
  const weekStartsOn = options.weekStartsOn ?? 1
  if (Number.isNaN(now.getTime())) throw new RangeError('now must be a valid Date')
  if (!Number.isInteger(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6) {
    throw new RangeError('weekStartsOn must be between 0 and 6')
  }

  const source = { ...input, timeZone: normalizeTimeZone(input.timeZone) } as DateRangeValue
  const range =
    source.kind === 'relative'
      ? resolveRelative(source, now, weekStartsOn)
      : source.kind === 'calendar'
        ? resolveCalendar(source, now, weekStartsOn)
        : resolveAbsolute(source)

  if (range.from.getTime() >= range.to.getTime()) {
    throw new RangeError('Date range must have a positive half-open interval')
  }

  return {
    ...range,
    kind: source.kind,
    timeZone: source.timeZone,
    source
  }
}

export const isInstantExcluded = (instant: Date, range: ResolvedDateRange): boolean => {
  if (instant < range.from || instant >= range.to) return true
  return range.excludeWeekdays.includes(toZonedWallTime(instant, range.timeZone).getDay() as Weekday)
}
