import { formatInTimeZone } from 'date-fns-tz'

import { resolveDateRangeV2At, resolveTimeZone } from './resolve-date-range-v2'
import { formatTimeZoneOffset } from './timezone-utils'
import type {
  CalendarUnit,
  DateRangeV2LabelConfig,
  DateRangeV2Preset,
  DateRangeV2State,
  TimeZoneId,
  Weekday
} from './types'

const RELATIVE_UNIT_LABEL: Record<string, [string, string]> = {
  minute: ['minute', 'minutes'],
  hour: ['hour', 'hours'],
  day: ['day', 'days'],
  week: ['week', 'weeks'],
  month: ['month', 'months'],
  year: ['year', 'years']
}

const CALENDAR_UNIT_LABEL: Record<CalendarUnit, string> = {
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year'
}

const POSITION_LABEL = {
  previous: 'Previous',
  this: 'This',
  next: 'Next'
} as const

export interface DateRangeV2Label {
  title: string
  rangeText: string
  triggerText: string
}

const clock = (instant: number, zone: string): string => formatInTimeZone(instant, zone, 'HH:mm')

/** Midnight and 23:59 are the stored edges of a whole day, so those labels stay date-only. */
const isDayBoundary = (instant: number, zone: string): boolean => {
  const time = clock(instant, zone)
  return time === '00:00' || time === '23:59'
}

const formatInstant = (instant: number, zone: string, withTime: boolean): string =>
  formatInTimeZone(instant, zone, withTime ? 'MMM d, yyyy, HH:mm' : 'MMM d, yyyy')

const formatBounds = (start: number, end: number, zone: string, showTime: boolean): string => {
  const withTime = showTime && (!isDayBoundary(start, zone) || !isDayBoundary(end, zone))
  const startText = formatInstant(start, zone, withTime)
  const endText = formatInstant(end, zone, withTime)
  if (startText === endText) return startText
  if (withTime && formatInTimeZone(start, zone, 'yyyy-MM-dd') === formatInTimeZone(end, zone, 'yyyy-MM-dd')) {
    return `${startText} – ${clock(end, zone)}`
  }
  if (withTime) return `${startText} – ${endText}`
  const startYear = formatInTimeZone(start, zone, 'yyyy')
  const endYear = formatInTimeZone(end, zone, 'yyyy')
  if (startYear === endYear) return `${formatInTimeZone(start, zone, 'MMM d')} – ${endText}`
  return `${startText} – ${endText}`
}

export const describeDateRangeV2 = (value: DateRangeV2State): Pick<DateRangeV2Label, 'title'> => {
  const range = value.range
  if (range.kind === 'relative') {
    const [singular, plural] = RELATIVE_UNIT_LABEL[range.unit]
    const unit = range.amount === 1 ? singular : plural
    const direction = range.direction === 'last' ? 'Last' : 'Next'
    return { title: `${direction} ${range.amount} ${unit}` }
  }
  if (range.kind === 'calendar') {
    if (range.position === 'previous' && range.unit === 'day' && range.amount === 1) {
      return { title: 'Yesterday' }
    }
    if (range.position === 'next' && range.unit === 'day' && range.amount === 1) {
      return { title: 'Tomorrow' }
    }
    if (range.position === 'this' && range.unit === 'day') {
      const extent = range.extent === 'so_far' ? ', so far' : range.extent === 'from_now' ? ', from now' : ''
      return { title: `Today${extent}` }
    }
    const unitLabel = CALENDAR_UNIT_LABEL[range.unit]
    const positionLabel = POSITION_LABEL[range.position]
    if (range.position !== 'this' && range.amount !== 1) {
      return { title: `${positionLabel} ${range.amount} ${unitLabel}s` }
    }
    const extent =
      range.position === 'this' && range.extent === 'so_far'
        ? ', so far'
        : range.position === 'this' && range.extent === 'from_now'
          ? ', from now'
          : ''
    return { title: `${positionLabel} ${unitLabel}${extent}` }
  }
  return { title: 'Fixed range' }
}

/** The configured preset name, when `presetId` is one of those presets. `FIXED` stays a fixed range. */
export const configuredPresetLabel = (
  presetId: string | undefined,
  presets: readonly Pick<DateRangeV2Preset, 'value' | 'label'>[] | undefined
): string | undefined => {
  const key = presetId?.trim().toUpperCase()
  if (!key || key === 'FIXED' || !presets?.length) return undefined
  return presets.find(preset => preset.value.trim().toUpperCase() === key)?.label
}

export const formatDateRangeV2Label = (
  value: DateRangeV2State,
  timezone?: TimeZoneId,
  weekStartsOn?: Weekday,
  now: Date = new Date(),
  label: DateRangeV2LabelConfig = {},
  /** Stored from/to. When set, the label does not recompute the window from `now`. */
  bounds?: readonly [number, number],
  /** Preset name. A custom preset id is otherwise described as a fixed range. */
  title?: string
): DateRangeV2Label => {
  const zone = resolveTimeZone(timezone)
  const described = title?.trim() ? { title: title.trim() } : describeDateRangeV2(value)
  let rangeText = described.title
  try {
    const [start, end] = bounds ?? resolveDateRangeV2At(value, now, timezone, weekStartsOn)
    rangeText = formatBounds(start, end, zone, label.showTime ?? true)
  } catch {
    rangeText = described.title
  }
  const offset = formatTimeZoneOffset(zone)
  const showTimezone = label.showTimezone ?? true
  const triggerText = title?.trim() || value.range.kind !== 'fixed' ? `${described.title} (${rangeText})` : rangeText
  return { ...described, rangeText: showTimezone ? `${rangeText} · ${offset}` : rangeText, triggerText }
}
