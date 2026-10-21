import { formatDateRangeV2Preset, parseDateRangeV2Preset, refreshDateRangeV2Value } from './date-range-v2-preset'
import type { DateRangeV2FilterValue, DateRangeV2Preset, TimeZoneId, Weekday } from './types'

const DEFAULT_TIME_ZONE: TimeZoneId = 'UTC'

const isTimezone = (value: string): value is TimeZoneId => value.length > 0

const timezoneSuffix = (timezone?: TimeZoneId): string => `|${timezone || DEFAULT_TIME_ZONE}`

const parseEpoch = (token: string): number | undefined => {
  if (!/^-?\d+$/.test(token)) return undefined
  const value = Number(token)
  return Number.isSafeInteger(value) ? value : undefined
}

export const dateRangeV2FilterParser = {
  parse: (
    serialized: string,
    now: Date = new Date(),
    weekStartsOn: Weekday = 1
  ): DateRangeV2FilterValue | undefined => {
    if (!serialized) return undefined
    let parts: string[]
    try {
      parts = decodeURIComponent(serialized).split('|')
    } catch {
      return undefined
    }
    const [presetToken, second, third, fourth, ...rest] = parts
    if (!presetToken || rest.length > 0) return undefined

    const preset = presetToken.trim().toUpperCase()
    if (preset === 'FIXED') {
      const fromMs = second ? parseEpoch(second) : undefined
      const toMs = third ? parseEpoch(third) : undefined
      if (fromMs === undefined || toMs === undefined) return undefined
      if (parts.length === 3) {
        return refreshDateRangeV2Value(
          { from: new Date(fromMs), to: new Date(toMs), preset: 'FIXED', timezone: DEFAULT_TIME_ZONE },
          now,
          weekStartsOn
        )
      }
      if (parts.length !== 4 || !fourth || !isTimezone(fourth)) return undefined
      return refreshDateRangeV2Value(
        { from: new Date(fromMs), to: new Date(toMs), preset: 'FIXED', timezone: fourth },
        now,
        weekStartsOn
      )
    }

    if (parts.length > 2) return undefined
    const timezone = parts.length === 1 ? DEFAULT_TIME_ZONE : second
    if (!timezone || !isTimezone(timezone) || !parseDateRangeV2Preset(preset)) return undefined
    return refreshDateRangeV2Value({ from: now, to: now, preset, timezone }, now, weekStartsOn)
  },
  serialize: (value: DateRangeV2FilterValue): string => {
    const preset = value.preset?.trim().toUpperCase() || 'FIXED'
    const suffix = timezoneSuffix(value.timezone)
    const range = preset === 'FIXED' ? undefined : parseDateRangeV2Preset(preset)
    if (range) return `${formatDateRangeV2Preset(range)}${suffix}`
    return `FIXED|${value.from.getTime()}|${value.to.getTime()}${suffix}`
  }
}

const isWeekday = (value: number | undefined): value is Weekday =>
  value !== undefined && Number.isInteger(value) && value >= 0 && value <= 6

const splitQuery = (serialized: string): string[] | undefined => {
  if (!serialized) return undefined
  try {
    return decodeURIComponent(serialized).split('|')
  } catch {
    return undefined
  }
}

const presetKey = (value: string): string => value.trim().toUpperCase()

/**
 * Filter parser for one DateRangeV2 option.
 * A preset id in `presets` reloads through that preset's `getRange({ timezone })`.
 * Every other value uses `dateRangeV2FilterParser`.
 */
export const createDateRangeV2FilterParser = (presets?: readonly DateRangeV2Preset[], weekStartsOn?: number) => {
  const weekday = isWeekday(weekStartsOn) ? weekStartsOn : 1
  const configured = (presets ?? []).filter(preset => preset.value.trim() && typeof preset.getRange === 'function')
  const matchPreset = (token: string): DateRangeV2Preset | undefined => {
    const key = presetKey(token)
    // `FIXED` is the fixed-range query. A preset with that id would replace those bounds.
    if (key === 'FIXED') return undefined
    return configured.find(preset => presetKey(preset.value) === key)
  }

  return {
    parse: (serialized: string, now: Date = new Date()): DateRangeV2FilterValue | undefined => {
      const parts = splitQuery(serialized)
      if (parts && parts.length <= 2) {
        const [presetToken, timezoneToken] = parts
        const preset = presetToken ? matchPreset(presetToken) : undefined
        if (preset) {
          const timezone = timezoneToken || DEFAULT_TIME_ZONE
          const { from, to } = preset.getRange({ timezone })
          const [start, end] = from <= to ? [from, to] : [to, from]
          return { from: start, to: end, preset: preset.value, timezone }
        }
      }
      return dateRangeV2FilterParser.parse(serialized, now, weekday)
    },
    serialize: (value: DateRangeV2FilterValue): string => {
      const preset = value.preset ? matchPreset(value.preset) : undefined
      if (preset) return `${preset.value}|${value.timezone || DEFAULT_TIME_ZONE}`
      return dateRangeV2FilterParser.serialize(value)
    }
  }
}
