import { subMilliseconds, subMinutes } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

import { normalizeDateRangeValue } from './normalize-date-range-value'
import { resolveDateRange } from './resolve-date-range'
import { formatTimeZoneLabel, formatTimeZoneOffset } from './timezone-utils'
import {
  CalendarPeriod,
  CivilDateTime,
  DateRangeInput,
  DateRangeUnit,
  DateRangeValue,
  FormatDateRangeLabelOptions,
  TimeZoneId
} from './types'

const UNIT_LABELS: Record<DateRangeUnit, string> = {
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year'
}

const PERIOD_LABELS: Record<CalendarPeriod, string> = {
  this_week: 'This week',
  last_week: 'Last week',
  next_week: 'Next week',
  this_month: 'This month',
  last_month: 'Last month',
  next_month: 'Next month',
  this_quarter: 'This quarter',
  last_quarter: 'Last quarter',
  next_quarter: 'Next quarter',
  this_year: 'This year',
  last_year: 'Last year',
  next_year: 'Next year'
}

const semanticLabelForValue = (value: Exclude<DateRangeValue, { kind: 'absolute' }>): string => {
  if (value.kind === 'calendar') return PERIOD_LABELS[value.period]
  const isToday = value.direction === 'past' && value.amount === 1 && value.unit === 'day' && !value.adjustment
  const isYesterday =
    value.direction === 'past' &&
    value.amount === 1 &&
    value.unit === 'day' &&
    value.adjustment?.type === 'exclude' &&
    value.adjustment.exclude.incompleteInterval &&
    !value.adjustment.exclude.weekdays?.length
  if (isToday) return 'Today'
  if (isYesterday) return 'Yesterday'
  return `${value.direction === 'past' ? 'Last' : 'Next'} ${value.amount} ${UNIT_LABELS[value.unit]}${
    value.amount === 1 ? '' : 's'
  }`
}

const formatResolvedBounds = (
  from: Date,
  to: Date,
  timeZone: TimeZoneId,
  locale: Intl.LocalesArgument | undefined,
  includesTime: boolean
): string => {
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includesTime ? { hour: 'numeric', minute: '2-digit' } : {})
  }
  const formatter = new Intl.DateTimeFormat(locale ?? 'en-US', formatOptions)
  return `${formatter.format(from)} – ${formatter.format(to)}`
}

const dateParts = (
  value: Date,
  timeZone: TimeZoneId,
  locale: Intl.LocalesArgument | undefined
): { day: string; month: string; year: string } => {
  const parts = new Intl.DateTimeFormat(locale ?? 'en-US', {
    timeZone,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).formatToParts(value)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value ?? ''
  return { day: part('day'), month: part('month'), year: part('year') }
}

const formatConciseDates = (
  from: Date,
  to: Date,
  timeZone: TimeZoneId,
  locale: Intl.LocalesArgument | undefined
): string => {
  const start = dateParts(from, timeZone, locale)
  const end = dateParts(to, timeZone, locale)
  if (start.year === end.year && start.month === end.month && start.day === end.day) {
    return `${start.month} ${start.day}, ${start.year}`
  }
  if (start.year !== end.year) {
    return `${start.month} ${start.day}, ${start.year} – ${end.month} ${end.day}, ${end.year}`
  }
  if (start.month === end.month) return `${start.month} ${start.day}–${end.day}, ${end.year}`
  return `${start.month} ${start.day} – ${end.month} ${end.day}, ${end.year}`
}

const civilDateToUtc = (value: CivilDateTime): Date => new Date(`${value.date}T00:00:00.000Z`)

const formatCivilEndpoint = (
  endpoint: CivilDateTime,
  includeYear: boolean,
  locale: Intl.LocalesArgument | undefined,
  // Once either endpoint carries a time, both are shown, so an untouched
  // endpoint falls back to the all-day boundary it actually represents.
  fallbackTime?: string
): string => {
  const date = civilDateToUtc(endpoint)
  const dateLabel = new Intl.DateTimeFormat(locale ?? 'en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {})
  }).format(date)
  const time = endpoint.time ?? fallbackTime
  return time ? `${time} ${dateLabel}` : dateLabel
}

/** The short offset badge shown beside a range, for example `UTC+05:30`. */
export const formatTimeZoneBadge = (timeZone: TimeZoneId, now?: Date): string => formatTimeZoneOffset(timeZone, now)

/** Formats only the resolved bounds of a range, without the semantic ("Last 7 days") prefix. */
export const formatResolvedDateRange = (input: DateRangeInput, options: FormatDateRangeLabelOptions = {}): string => {
  const value = normalizeDateRangeValue(input)
  if (!value) return ''

  const range = resolveDateRange(value, options)
  const includesTime = value.kind === 'absolute' && Boolean(value.from.time || value.to.time)
  const visibleEnd = includesTime ? subMinutes(range.to, 1) : subMilliseconds(range.to, 1)
  const bounds = formatResolvedBounds(range.from, visibleEnd, value.timeZone, options.locale, includesTime)

  return options.includeTimeZone ? `${bounds}, ${formatTimeZoneLabel(value.timeZone, options.now)}` : bounds
}

export const formatDateRangeLabel = (input: DateRangeInput, options: FormatDateRangeLabelOptions = {}): string => {
  const value = normalizeDateRangeValue(input)
  if (!value) return ''

  const range = resolveDateRange(value, options)
  const zoneLabel = formatTimeZoneLabel(value.timeZone, options.now)
  const zoneSuffix = options.includeTimeZone === false ? '' : `, ${zoneLabel}`

  if (value.kind === 'absolute') {
    const includesTime = Boolean(value.from.time || value.to.time)
    const visibleEnd = value.to.time ? subMinutes(range.to, 1) : subMilliseconds(range.to, 1)
    return `${formatResolvedBounds(range.from, visibleEnd, value.timeZone, options.locale, includesTime)}${zoneSuffix}`
  }

  const semanticLabel = semanticLabelForValue(value)

  if (!options.includeResolvedRange) return `${semanticLabel}${zoneSuffix}`

  const visibleEnd = subMilliseconds(range.to, 1)
  const resolved = `${formatInTimeZone(range.from, value.timeZone, 'MMM d, yyyy')} – ${formatInTimeZone(
    visibleEnd,
    value.timeZone,
    'MMM d, yyyy'
  )}`
  return `${semanticLabel} (${resolved}${zoneSuffix})`
}

/**
 * Compact, self-contained label for picker triggers. It keeps semantic ranges
 * and only renders fixed times that are explicitly present in the value. Pass
 * `includeTimeZone: false` when the zone is rendered separately, as the picker
 * trigger does with its offset badge.
 */
export const formatDateRangeTriggerLabel = (
  input: DateRangeInput,
  options: FormatDateRangeLabelOptions = {}
): string => {
  const value = normalizeDateRangeValue(input)
  if (!value) return ''

  const zoneSuffix = options.includeTimeZone === false ? '' : ` · ${formatTimeZoneBadge(value.timeZone, options.now)}`
  if (value.kind === 'absolute') {
    if (!value.from.time && !value.to.time) {
      const dates = formatConciseDates(civilDateToUtc(value.from), civilDateToUtc(value.to), 'UTC', options.locale)
      return `${dates}${zoneSuffix}`
    }
    const startYear = value.from.date.slice(0, 4)
    const endYear = value.to.date.slice(0, 4)
    const sameYear = startYear === endYear
    const from = formatCivilEndpoint(value.from, !sameYear, options.locale, '00:00')
    const to = formatCivilEndpoint(value.to, true, options.locale, '23:59')
    return `${from} – ${to}${zoneSuffix}`
  }

  const range = resolveDateRange(value, options)
  const visibleEnd = subMilliseconds(range.to, 1)
  const bounds = formatConciseDates(range.from, visibleEnd, value.timeZone, options.locale)
  const semanticLabel = semanticLabelForValue(value)

  return `${semanticLabel} (${bounds})${zoneSuffix}`
}
