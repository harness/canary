import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addWeeks,
  addYears,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear
} from 'date-fns'

import {
  fromZonedWallTime,
  getBrowserTimeZone,
  isCivilDate,
  isCivilTime,
  normalizeTimeZone,
  toZonedWallTime,
  zonedCivilToUtc
} from './timezone-utils'
import type { CalendarUnit, DateRangeV2State, RelativeUnit, TimeZoneId, Weekday } from './types'

const relativeAdders: Record<RelativeUnit, (date: Date, amount: number) => Date> = {
  minute: addMinutes,
  hour: addHours,
  day: addDays,
  week: addWeeks,
  month: addMonths,
  year: addYears
}

const calendarAdders: Record<CalendarUnit, (date: Date, amount: number) => Date> = {
  day: addDays,
  week: addWeeks,
  month: addMonths,
  quarter: (date, amount) => addMonths(date, amount * 3),
  year: addYears
}

const addZoned = (instant: Date, amount: number, unit: RelativeUnit | CalendarUnit, timeZone: string): Date => {
  const adder = unit in relativeAdders ? relativeAdders[unit as RelativeUnit] : calendarAdders[unit as CalendarUnit]
  return unit === 'minute' || unit === 'hour'
    ? adder(instant, amount)
    : fromZonedWallTime(adder(toZonedWallTime(instant, timeZone), amount), timeZone)
}

const startOfZonedUnit = (instant: Date, unit: CalendarUnit, timeZone: string, weekStartsOn: Weekday): Date => {
  const wallTime = toZonedWallTime(instant, timeZone)
  const start =
    unit === 'day'
      ? new Date(wallTime.getFullYear(), wallTime.getMonth(), wallTime.getDate())
      : unit === 'week'
        ? startOfWeek(wallTime, { weekStartsOn })
        : unit === 'month'
          ? startOfMonth(wallTime)
          : unit === 'quarter'
            ? startOfQuarter(wallTime)
            : startOfYear(wallTime)
  return fromZonedWallTime(start, timeZone)
}

/** Concrete IANA zone. `LOCALE` uses the browser zone. An omitted zone is UTC. */
export const resolveTimeZone = (timezone?: TimeZoneId): string => {
  if (timezone === 'LOCALE') return getBrowserTimeZone()
  return normalizeTimeZone(timezone ?? 'UTC')
}

const inclusiveEnd = (exclusiveEnd: Date): number => exclusiveEnd.getTime() - 1

function assertWeekStartsOn(weekStartsOn: number): asserts weekStartsOn is Weekday {
  if (!Number.isInteger(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6) {
    throw new RangeError('weekStartsOn must be between 0 and 6')
  }
}

/**
 * Resolves a saved range to inclusive epoch milliseconds `[startTime, endTime]`.
 * Relative windows include the anchor instant. Calendar and fixed ends include the
 * last millisecond of the ending minute or period.
 */
export const resolveDateRangeV2 = (
  value: DateRangeV2State,
  timezone?: TimeZoneId,
  weekStartsOn: Weekday = 1
): [startTime: number, endTime: number] => {
  const now = new Date()
  return resolveDateRangeV2At(value, now, timezone, weekStartsOn)
}

export const resolveDateRangeV2At = (
  value: DateRangeV2State,
  now: Date,
  timezone?: TimeZoneId,
  weekStartsOn: Weekday = 1
): [startTime: number, endTime: number] => {
  assertWeekStartsOn(weekStartsOn)
  if (Number.isNaN(now.getTime())) throw new RangeError('now must be a valid Date')

  const zone = resolveTimeZone(timezone)
  const range = value.range
  let start: number
  let end: number

  if (range.kind === 'relative') {
    if (!Number.isInteger(range.amount) || range.amount < 1) {
      throw new RangeError('Relative amount must be a positive integer')
    }
    const shifted = addZoned(now, range.direction === 'last' ? -range.amount : range.amount, range.unit, zone)
    start = range.direction === 'last' ? shifted.getTime() : now.getTime()
    end = range.direction === 'last' ? now.getTime() : shifted.getTime()
  } else if (range.kind === 'calendar') {
    const amount = range.position === 'this' ? 1 : range.amount
    if (!Number.isInteger(amount) || amount < 1) {
      throw new RangeError('Calendar amount must be a positive integer')
    }
    const currentStart = startOfZonedUnit(now, range.unit, zone, weekStartsOn)
    const periodStart =
      range.position === 'previous'
        ? addZoned(currentStart, -amount, range.unit, zone)
        : range.position === 'next'
          ? addZoned(currentStart, 1, range.unit, zone)
          : currentStart
    const periodEnd =
      range.position === 'previous'
        ? currentStart
        : range.position === 'next'
          ? addZoned(currentStart, amount + 1, range.unit, zone)
          : addZoned(currentStart, 1, range.unit, zone)
    const extent = range.position === 'this' ? range.extent : 'full'

    if (extent === 'so_far') {
      start = periodStart.getTime()
      end = now.getTime()
    } else if (extent === 'from_now') {
      start = now.getTime()
      end = inclusiveEnd(periodEnd)
    } else {
      start = periodStart.getTime()
      end = inclusiveEnd(periodEnd)
    }
  } else {
    if (
      !isCivilDate(range.from.date) ||
      !isCivilDate(range.to.date) ||
      !isCivilTime(range.from.time) ||
      !isCivilTime(range.to.time)
    ) {
      throw new RangeError('Fixed range contains an invalid civil date or time')
    }
    start = zonedCivilToUtc(range.from.date, range.from.time, zone).getTime()
    const endMinute = zonedCivilToUtc(range.to.date, range.to.time, zone)
    end = endMinute.getTime() + 60_000 - 1
  }

  if (start > end) throw new RangeError('Date range end must not be before its start')
  return [start, end]
}
