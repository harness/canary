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
  isCivilDateTime,
  normalizeTimeZone,
  toZonedWallTime,
  zonedCivilDateTimeToUtc
} from './timezone-utils'
import type { CalendarUnit, RelativeUnit, ResolvableDateRangeV2, TimeZoneId } from './types'

/** Calendar weeks start on Monday. */
const WEEK_STARTS_ON = 1

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

const startOfZonedUnit = (instant: Date, unit: CalendarUnit, timeZone: string): Date => {
  const wallTime = toZonedWallTime(instant, timeZone)
  const start =
    unit === 'day'
      ? new Date(wallTime.getFullYear(), wallTime.getMonth(), wallTime.getDate())
      : unit === 'week'
        ? startOfWeek(wallTime, { weekStartsOn: WEEK_STARTS_ON })
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

export interface ResolvedDateRangeV2 {
  from: Date
  to: Date
  range: ResolvableDateRangeV2
  timezone: TimeZoneId
}

const resolveEpochs = (range: ResolvableDateRangeV2, timezone: TimeZoneId | undefined, now: Date): [number, number] => {
  if (Number.isNaN(now.getTime())) throw new RangeError('now must be a valid Date')

  const zone = resolveTimeZone(timezone)
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
    const currentStart = startOfZonedUnit(now, range.unit, zone)
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
    if (!isCivilDateTime(range.from) || !isCivilDateTime(range.to)) {
      throw new RangeError('Fixed range contains an invalid civil date or time')
    }
    start = zonedCivilDateTimeToUtc(range.from, zone).getTime()
    end = zonedCivilDateTimeToUtc(range.to, zone).getTime()
  }

  if (start > end) throw new RangeError('Date range end must not be before its start')
  return [start, end]
}

/**
 * Resolves a relative, calendar, or fixed range to inclusive epochs.
 * `range` is returned unchanged. An omitted timezone is returned as UTC.
 * A configured preset is not accepted: its bounds come from `getRange`.
 */
export const resolveDateRangeV2At = (
  value: { range: ResolvableDateRangeV2; timezone?: TimeZoneId },
  now: Date
): ResolvedDateRangeV2 => {
  const [start, end] = resolveEpochs(value.range, value.timezone, now)
  return {
    from: new Date(start),
    to: new Date(end),
    range: value.range,
    timezone: value.timezone ?? 'UTC'
  }
}

export const resolveDateRangeV2 = (
  value: { range: ResolvableDateRangeV2; timezone?: TimeZoneId },
  now: Date = new Date()
): ResolvedDateRangeV2 => resolveDateRangeV2At(value, now)
