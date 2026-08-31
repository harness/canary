import { addDays, format, isValid, parse } from 'date-fns'

import { utcToCivilDate } from './timezone-utils'
import {
  CalendarPeriod,
  CivilDate,
  CivilTime,
  DateRangeUnit,
  DateRangeValue,
  DEFAULT_TIME_ZONE,
  TimeZoneId,
  Weekday
} from './types'

export interface ParseDateRangeQueryOptions {
  timeZone?: TimeZoneId
  now?: Date
}

const UNIT_ALIASES: Record<string, DateRangeUnit> = {
  min: 'minute',
  mins: 'minute',
  minute: 'minute',
  minutes: 'minute',
  hr: 'hour',
  hrs: 'hour',
  hour: 'hour',
  hours: 'hour',
  day: 'day',
  days: 'day',
  week: 'week',
  weeks: 'week',
  month: 'month',
  months: 'month',
  quarter: 'quarter',
  quarters: 'quarter',
  year: 'year',
  years: 'year'
}

const WEEKDAY_ALIASES: Record<string, Weekday> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6
}

const CALENDAR_PERIODS: Record<string, { period: CalendarPeriod; extent?: 'to_now' }> = {
  'this week': { period: 'this_week' },
  'current week': { period: 'this_week' },
  'week to date': { period: 'this_week', extent: 'to_now' },
  wtd: { period: 'this_week', extent: 'to_now' },
  'last week': { period: 'last_week' },
  'previous week': { period: 'last_week' },
  'next week': { period: 'next_week' },
  'this month': { period: 'this_month' },
  'current month': { period: 'this_month' },
  'month to date': { period: 'this_month', extent: 'to_now' },
  mtd: { period: 'this_month', extent: 'to_now' },
  'last month': { period: 'last_month' },
  'previous month': { period: 'last_month' },
  'next month': { period: 'next_month' },
  'this quarter': { period: 'this_quarter' },
  'current quarter': { period: 'this_quarter' },
  'quarter to date': { period: 'this_quarter', extent: 'to_now' },
  qtd: { period: 'this_quarter', extent: 'to_now' },
  'last quarter': { period: 'last_quarter' },
  'previous quarter': { period: 'last_quarter' },
  'next quarter': { period: 'next_quarter' },
  'this year': { period: 'this_year' },
  'current year': { period: 'this_year' },
  'year to date': { period: 'this_year', extent: 'to_now' },
  ytd: { period: 'this_year', extent: 'to_now' },
  'last year': { period: 'last_year' },
  'previous year': { period: 'last_year' },
  'next year': { period: 'next_year' }
}

const DATE_FORMATS = ['yyyy-MM-dd', 'M/d/yyyy', 'M-d-yyyy', 'MMM d yyyy', 'MMMM d yyyy', 'MMM d', 'MMMM d']

const clean = (query: string): string =>
  query
    .trim()
    .toLowerCase()
    .replace(/[.!?]+$/, '')
    .replace(/(\d)(st|nd|rd|th)\b/g, '$1')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')

const toCivilDate = (date: Date): CivilDate => format(date, 'yyyy-MM-dd') as CivilDate

/** Parses a single typed date such as `Aug 19, 2026`, `8/19/2026`, or `2026-08-19`. */
export const parseCivilDateInput = (input: string, reference: Date = new Date()): CivilDate | undefined =>
  parseCivilDate(input, reference)

const parseCivilDate = (input: string, reference: Date): CivilDate | undefined => {
  const normalized = input.trim().replace(/,/g, '')
  for (const dateFormat of DATE_FORMATS) {
    const parsed = parse(normalized, dateFormat, reference)
    if (isValid(parsed) && format(parsed, dateFormat).toLowerCase() === normalized.toLowerCase()) {
      return toCivilDate(parsed)
    }
  }
  return undefined
}

const parseCivilTime = (input: string): CivilTime | undefined => {
  const match = input
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/)
  if (!match) return undefined
  let hour = Number(match[1])
  const minute = Number(match[2] ?? 0)
  if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23)) return undefined
  if (match[3]) {
    hour %= 12
    if (match[3] === 'pm') hour += 12
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` as CivilTime
}

const parseEndpoint = (input: string, reference: Date): { date: CivilDate; time?: CivilTime } | undefined => {
  const timed =
    input.trim().match(/^(.+?)\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)$/i) ??
    input.trim().match(/^(.+?)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))$/i)
  const date = parseCivilDate(timed?.[1] ?? input, reference)
  if (!date) return undefined
  const time = timed ? parseCivilTime(timed[2]) : undefined
  if (timed && !time) return undefined
  return { date, ...(time ? { time } : {}) }
}

const parseAbsolute = (query: string, timeZone: TimeZoneId, now: Date): DateRangeValue | undefined => {
  const today = utcToCivilDate(now, timeZone)
  const namedDay = query.match(/^(today|yesterday|tomorrow)$/)?.[1]
  if (namedDay) {
    const delta = namedDay === 'yesterday' ? -1 : namedDay === 'tomorrow' ? 1 : 0
    const civil = toCivilDate(addDays(new Date(`${today}T12:00:00`), delta))
    return { kind: 'absolute', from: { date: civil }, to: { date: civil }, timeZone }
  }

  const between = query.match(/^(?:(?:between|from)\s+)?(.+?)\s+(?:and|to|through|until|-)\s+(.+)$/)
  if (between) {
    const from = parseEndpoint(between[1], now)
    const to = parseEndpoint(between[2], now)
    if (from && to) return { kind: 'absolute', from, to, timeZone }
  }

  const since = query.match(/^since\s+(.+)$/)
  if (since) {
    const from = parseEndpoint(since[1], now)
    if (from) return { kind: 'absolute', from, to: { date: today }, timeZone }
  }
  return undefined
}

const parseExcludedWeekdays = (clause: string): Weekday[] | undefined => {
  if (/\bweekends?\b/.test(clause)) return [0, 6]
  if (/\bweekdays?\b/.test(clause)) return [1, 2, 3, 4, 5]
  const days = Object.entries(WEEKDAY_ALIASES)
    .filter(([name]) => new RegExp(`\\b${name}\\b`).test(clause))
    .map(([, day]) => day)
  return days.length ? [...new Set(days)].sort() : undefined
}

const parseRelative = (query: string, timeZone: TimeZoneId): DateRangeValue | undefined => {
  const match = query.match(
    /^(?:the\s+)?(last|past|previous|next|coming)\s+(\d+|a|an|one)\s+(minutes?|mins?|hours?|hrs?|days?|weeks?|months?|quarters?|years?)(.*)$/
  )
  if (!match) return undefined

  const direction: 'past' | 'future' = match[1] === 'next' || match[1] === 'coming' ? 'future' : 'past'
  const amount = /^(a|an|one)$/.test(match[2]) ? 1 : Number(match[2])
  const unit = UNIT_ALIASES[match[3]]
  const clause = match[4].trim()
  if (!unit || amount < 1) return undefined

  const base = { kind: 'relative' as const, direction, amount, unit, timeZone }
  if (!clause) return base

  const offset = clause.match(
    /^(?:and\s+)?(?:offset(?:\s+by)?|shift(?:ed)?(?:\s+back)?(?:\s+by)?|excluding?|exclude)\s+(?:(?:the\s+)?(?:last|recent|most recent)\s+)?(\d+)\s+(minutes?|mins?|hours?|hrs?|days?|weeks?|months?|quarters?|years?)$/
  )
  if (offset) {
    if (direction === 'future') {
      throw new Error('Offsets and trailing exclusions can only be applied to past rolling ranges.')
    }
    return {
      ...base,
      direction: 'past',
      adjustment: {
        type: 'offset',
        offset: { amount: Number(offset[1]), unit: UNIT_ALIASES[offset[2]] }
      }
    }
  }

  if (
    /^(?:and\s+)?(?:exclude|excluding|without|except)\s+(?:today|the current|current)(?:\s+(?:interval|period|day))?$/.test(
      clause
    )
  ) {
    return {
      ...base,
      adjustment: { type: 'exclude', exclude: { incompleteInterval: true } }
    }
  }

  if (/^(?:and\s+)?(?:exclude|excluding|without|except)\s+/.test(clause)) {
    const weekdays = parseExcludedWeekdays(clause)
    if (weekdays) {
      return { ...base, adjustment: { type: 'exclude', exclude: { weekdays } } }
    }
  }

  throw new Error(
    'I understood the rolling range but not its adjustment. Try “exclude weekends”, “exclude today”, or “offset by 2 days”.'
  )
}

/**
 * Deterministic natural-language parser for every semantic range supported by
 * DateRangePicker. Products can replace it with an AI-backed interpreter via
 * onInterpretQuery when they need unrestricted language understanding.
 */
export const parseDateRangeQuery = (input: string, options: ParseDateRangeQueryOptions = {}): DateRangeValue => {
  const query = clean(input)
  if (!query) throw new Error('Describe a date or time range.')

  const timeZone = options.timeZone ?? DEFAULT_TIME_ZONE
  const now = options.now ?? new Date()

  const calendar = CALENDAR_PERIODS[query]
  if (calendar) return { kind: 'calendar', ...calendar, timeZone }

  const absolute = parseAbsolute(query, timeZone, now)
  if (absolute) return absolute

  const relative = parseRelative(query, timeZone)
  if (relative) return relative

  throw new Error('Try a rolling range (“last 20 days”), a period (“month to date”), or dates (“Aug 1 to Aug 15”).')
}
