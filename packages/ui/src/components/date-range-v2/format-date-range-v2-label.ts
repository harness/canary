import { formatInTimeZone } from 'date-fns-tz'

import { presetBounds } from './date-range-v2-preset'
import { resolveDateRangeV2At, resolveTimeZone } from './resolve-date-range-v2'
import { formatTimeZoneOffset, zonedCivilDateTimeToUtc } from './timezone-utils'
import type {
  CalendarUnit,
  CivilDateTime,
  DateRangeV2LabelConfig,
  DateRangeV2Preset,
  DateRangeV2Value,
  ResolvableDateRangeV2,
  TimeZoneId
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

export const describeDateRangeV2 = (range: ResolvableDateRangeV2): Pick<DateRangeV2Label, 'title'> => {
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

const storedEpochs = (from?: Date, to?: Date): readonly [number, number] | undefined => {
  if (!from || !to) return undefined
  const start = from.getTime()
  const end = to.getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end)) return undefined
  return [start, end]
}

const assembleLabel = (
  title: string,
  dates: string,
  zone: string,
  showTimezone: boolean,
  wrapTitle: boolean
): DateRangeV2Label => ({
  title,
  rangeText: showTimezone ? `${dates} · ${formatTimeZoneOffset(zone)}` : dates,
  triggerText: wrapTitle ? `${title} (${dates})` : dates
})

const presetEpochs = (
  presetId: string,
  presets: readonly Pick<DateRangeV2Preset, 'value' | 'getRange'>[] | undefined,
  timezone: TimeZoneId | undefined
): readonly [number, number] | undefined => {
  const preset = presets?.find(item => item.value === presetId)
  if (!preset) return undefined
  const bounds = presetBounds(preset, timezone ?? 'UTC')
  return storedEpochs(bounds.from, bounds.to)
}

/** A fixed draft that has a start and no end yet. Whole-day starts stay date-only. */
export const formatFixedStartLabel = (
  value: CivilDateTime,
  timezone?: TimeZoneId,
  label: DateRangeV2LabelConfig = {}
): string => {
  const zone = resolveTimeZone(timezone)
  const instant = zonedCivilDateTimeToUtc(value, zone).getTime()
  const withTime = (label.showTime ?? true) && !isDayBoundary(instant, zone)
  const text = formatInstant(instant, zone, withTime)
  return (label.showTimezone ?? true) ? `${text} · ${formatTimeZoneOffset(zone)}` : text
}

export const formatDateRangeV2Label = (
  range: ResolvableDateRangeV2,
  timezone?: TimeZoneId,
  now: Date = new Date(),
  label: DateRangeV2LabelConfig = {},
  /** Stored from/to. When set, the label does not recompute the window from `now`. */
  bounds?: readonly [number, number]
): DateRangeV2Label => {
  const zone = resolveTimeZone(timezone)
  const described = describeDateRangeV2(range)
  let dates = described.title
  try {
    let start = bounds?.[0]
    let end = bounds?.[1]
    if (start === undefined || end === undefined) {
      const resolved = resolveDateRangeV2At({ range, timezone }, now)
      start = resolved.from.getTime()
      end = resolved.to.getTime()
    }
    dates = formatBounds(start, end, zone, label.showTime ?? true)
  } catch {
    dates = described.title
  }
  return assembleLabel(described.title, dates, zone, label.showTimezone ?? true, range.kind !== 'fixed')
}

export interface DateRangeV2ValueLabelOptions {
  presets?: readonly Pick<DateRangeV2Preset, 'value' | 'label' | 'getRange'>[]
  label?: DateRangeV2LabelConfig
  now?: Date
  /** Epochs to show. When omitted, a preset uses `from`/`to` and then `getRange`. */
  bounds?: readonly [number, number]
}

/**
 * Label for a stored value. A preset uses its configured name and its epochs.
 * Relative, calendar, and fixed ranges use `formatDateRangeV2Label`.
 */
export const formatDateRangeV2ValueLabel = (
  value: Pick<DateRangeV2Value, 'range' | 'from' | 'to' | 'timezone'>,
  options: DateRangeV2ValueLabelOptions = {}
): DateRangeV2Label => {
  const { range, timezone } = value
  if (range.kind !== 'preset') {
    return formatDateRangeV2Label(
      range,
      timezone,
      options.now,
      options.label,
      options.bounds ?? storedEpochs(value.from, value.to)
    )
  }

  const presetName = configuredPresetLabel(range.preset, options.presets)?.trim() || range.preset.trim()
  const zone = resolveTimeZone(timezone)
  const label = options.label ?? {}
  const epochs =
    options.bounds ?? storedEpochs(value.from, value.to) ?? presetEpochs(range.preset, options.presets, timezone)
  if (!epochs) {
    return { title: presetName || 'Fixed range', rangeText: '', triggerText: presetName }
  }
  const dates = formatBounds(epochs[0], epochs[1], zone, label.showTime ?? true)
  return assembleLabel(presetName || 'Fixed range', dates, zone, label.showTimezone ?? true, Boolean(presetName))
}
