import { formatInTimeZone } from 'date-fns-tz'

import { resolveDateRangeV2At, resolvePresetBounds, resolveTimeZone } from './resolve-date-range-v2'
import { formatTimeZoneOffset } from './timezone-utils'
import type {
  CalendarExtent,
  CalendarUnit,
  DateRangeV2Preset,
  DateRangeV2TriggerLabelConfig,
  DateRangeV2Value,
  RelativeUnit,
  ResolvableDateRangeV2,
  TimeZoneId
} from './types'

const RELATIVE_UNIT_LABEL: Record<RelativeUnit, [string, string]> = {
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

const STAMP_SEPARATOR = '\t'
const STAMP_PATTERN = ['yyyy-MM-dd', 'yyyy', 'MMM d', 'MMM d, yyyy', 'HH:mm', 'HH:mm:ss'].join(`'${STAMP_SEPARATOR}'`)

/** Strings for one range. `title` is the name, `caption` is the dates, `buttonText` is the closed button. */
export interface DateRangeV2Label {
  title: string
  caption: string
  buttonText: string
}

interface InstantStamp {
  day: string
  year: string
  monthDay: string
  date: string
  clock: string
  clockWithSeconds: string
}

const stampOf = (instant: number, zone: string): InstantStamp => {
  const [day, year, monthDay, date, clock, clockWithSeconds] = formatInTimeZone(instant, zone, STAMP_PATTERN).split(
    STAMP_SEPARATOR
  )
  return { day, year, monthDay, date, clock, clockWithSeconds }
}

/** 00:00:00 and 23:59:59 are the stored edges of a whole day, so those labels stay date-only. */
const isDayBoundary = (stamp: InstantStamp): boolean =>
  stamp.clockWithSeconds === '00:00:00' || stamp.clockWithSeconds === '23:59:59'

const formatBounds = (
  start: number,
  end: number,
  zone: string,
  showTime: boolean,
  showSeconds: boolean,
  exactTime: boolean
): string => {
  const withSeconds = exactTime || showSeconds
  const startStamp = stampOf(start, zone)
  const endStamp = stampOf(end, zone)
  const withTime = exactTime || (showTime && (!isDayBoundary(startStamp) || !isDayBoundary(endStamp)))
  const text = (stamp: InstantStamp): string =>
    withTime ? `${stamp.date}, ${withSeconds ? stamp.clockWithSeconds : stamp.clock}` : stamp.date
  const startText = text(startStamp)
  const endText = text(endStamp)
  if (startText === endText) return startText
  if (withTime && startStamp.day === endStamp.day) {
    return `${startText} – ${withSeconds ? endStamp.clockWithSeconds : endStamp.clock}`
  }
  if (withTime || startStamp.year !== endStamp.year) return `${startText} – ${endText}`
  return `${startStamp.monthDay} – ${endText}`
}

const extentLabel = (extent: CalendarExtent | undefined): string =>
  extent === 'so_far' ? ', so far' : extent === 'from_now' ? ', from now' : ''

export const describeDateRangeV2 = (range: ResolvableDateRangeV2): Pick<DateRangeV2Label, 'title'> => {
  if (range.kind === 'relative') {
    const [singular, plural] = RELATIVE_UNIT_LABEL[range.unit]
    const unit = range.amount === 1 ? singular : plural
    const direction = range.direction === 'last' ? 'Last' : 'Next'
    return { title: `${direction} ${range.amount} ${unit}` }
  }
  if (range.kind === 'calendar') {
    const unitLabel = CALENDAR_UNIT_LABEL[range.unit]
    if (range.position === 'previous' && range.unit === 'day' && range.amount === 1) return { title: 'Yesterday' }
    if (range.position === 'next' && range.unit === 'day' && range.amount === 1) return { title: 'Tomorrow' }
    if (range.position === 'this' && range.unit === 'day') return { title: `Today${extentLabel(range.extent)}` }
    if (range.position !== 'this' && range.amount !== 1) {
      return { title: `${POSITION_LABEL[range.position]} ${range.amount} ${unitLabel}s` }
    }
    const extent = range.position === 'this' ? extentLabel(range.extent) : ''
    return { title: `${POSITION_LABEL[range.position]} ${unitLabel}${extent}` }
  }
  return { title: 'Fixed range' }
}

/** The configured preset name, when `presetId` is one of those presets. `FIXED` stays a fixed range. */
export const configuredPresetLabel = (
  presetId: string | undefined,
  presets: readonly Pick<DateRangeV2Preset, 'value' | 'label'>[] | undefined
): string | undefined => {
  if (!presetId || presetId === 'FIXED' || !presets?.length) return undefined
  return presets.find(preset => preset.value === presetId)?.label
}

const storedEpochs = (from?: Date, to?: Date): readonly [number, number] | undefined => {
  if (!from || !to) return undefined
  const start = from.getTime()
  const end = to.getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end)) return undefined
  return [start, end]
}

const presetEpochs = (
  presetId: string,
  presets: readonly Pick<DateRangeV2Preset, 'value' | 'getRange'>[] | undefined,
  timezone: TimeZoneId | undefined
): readonly [number, number] | undefined => {
  const preset = presets?.find(item => item.value === presetId)
  if (!preset) return undefined
  const bounds = resolvePresetBounds(preset, timezone ?? 'UTC')
  return storedEpochs(bounds.from, bounds.to)
}

const resolvedEpochs = (
  range: ResolvableDateRangeV2,
  timezone: TimeZoneId | undefined,
  now: Date
): readonly [number, number] | undefined => {
  try {
    const resolved = resolveDateRangeV2At({ range, timezone }, now)
    return [resolved.from.getTime(), resolved.to.getTime()]
  } catch {
    return undefined
  }
}

const withZone = (text: string, zone: string, showTimezone: boolean): string =>
  showTimezone ? `${text} · ${formatTimeZoneOffset(zone)}` : text

const assembleLabel = (
  title: string,
  dates: string,
  zone: string,
  showTimezone: boolean,
  wrapTitle: boolean
): DateRangeV2Label => ({
  title,
  caption: withZone(dates, zone, showTimezone),
  buttonText: wrapTitle ? `${title} (${dates})` : dates
})

export interface DateRangeV2LabelOptions {
  presets?: readonly Pick<DateRangeV2Preset, 'value' | 'label' | 'getRange'>[]
  triggerLabelConfig?: DateRangeV2TriggerLabelConfig
  now?: Date
  /** Epochs to show. When omitted, a preset uses `from`/`to` and then `getRange`. */
  bounds?: readonly [number, number]
  /** Show HH:mm:ss even when both ends are the start and end of a day. */
  exactTime?: boolean
}

type LabelValue = Pick<DateRangeV2Value, 'range' | 'from' | 'to' | 'timezone'>

const epochsFor = (value: LabelValue, options: DateRangeV2LabelOptions): readonly [number, number] | undefined => {
  const given = options.bounds ?? storedEpochs(value.from, value.to)
  if (given) return given
  if (value.range.kind === 'preset') return presetEpochs(value.range.preset, options.presets, value.timezone)
  return resolvedEpochs(value.range, value.timezone, options.now ?? new Date())
}

const datesFor = (epochs: readonly [number, number], zone: string, options: DateRangeV2LabelOptions): string => {
  const triggerLabelConfig = options.triggerLabelConfig ?? {}
  return formatBounds(
    epochs[0],
    epochs[1],
    zone,
    triggerLabelConfig.showTime ?? true,
    triggerLabelConfig.showSeconds ?? false,
    options.exactTime ?? false
  )
}

/**
 * Label for a stored value or a draft preview.
 * Presets use their configured name. Pass `from` and `to`, or `bounds`, to reuse epochs that are already resolved.
 * A fixed range whose start and end are the same moment labels that single moment.
 */
export const formatDateRangeV2Label = (value: LabelValue, options: DateRangeV2LabelOptions = {}): DateRangeV2Label => {
  const { range, timezone } = value
  const zone = resolveTimeZone(timezone)
  const showTimezone = options.triggerLabelConfig?.showTimezone ?? true
  const epochs = epochsFor(value, options)

  if (range.kind === 'preset') {
    const title = configuredPresetLabel(range.preset, options.presets)?.trim() || range.preset
    if (!epochs) return { title: title || 'Fixed range', caption: '', buttonText: title }
    return assembleLabel(title || 'Fixed range', datesFor(epochs, zone, options), zone, showTimezone, Boolean(title))
  }

  const { title } = describeDateRangeV2(range)
  return assembleLabel(
    title,
    epochs ? datesFor(epochs, zone, options) : title,
    zone,
    showTimezone,
    range.kind !== 'fixed'
  )
}
