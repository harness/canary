import {
  fixedRangeFromBounds,
  formatDateRangeV2Preset,
  parseDateRangeV2Preset,
  presetBounds
} from './date-range-v2-preset'
import { resolveDateRangeV2 } from './resolve-date-range-v2'
import type {
  DateRangeV2Config,
  DateRangeV2FilterValue,
  DateRangeV2Preset,
  ResolvableDateRangeV2,
  TimeZoneId
} from './types'

const DEFAULT_TIME_ZONE: TimeZoneId = 'UTC'

const isTimezone = (value: string): value is TimeZoneId => value.length > 0

const timezoneOf = (timezone?: TimeZoneId): TimeZoneId => timezone || DEFAULT_TIME_ZONE

const parseEpoch = (token: string): number | undefined => {
  if (!/^-?\d+$/.test(token)) return undefined
  const value = Number(token)
  return Number.isSafeInteger(value) ? value : undefined
}

const resolvedEpochs = (range: ResolvableDateRangeV2, timezone: TimeZoneId | undefined, now: Date) => {
  const resolved = resolveDateRangeV2({ range, timezone }, now)
  return { from: resolved.from, to: resolved.to, range: resolved.range, timezone: resolved.timezone }
}

export const dateRangeV2FilterParser = {
  parse: (serialized: string, now: Date = new Date()): DateRangeV2FilterValue | undefined => {
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
      const timezone = parts.length === 3 ? DEFAULT_TIME_ZONE : fourth
      if (parts.length === 3) {
        const range = fixedRangeFromBounds(new Date(fromMs), new Date(toMs), DEFAULT_TIME_ZONE)
        return resolvedEpochs(range, DEFAULT_TIME_ZONE, now)
      }
      if (parts.length !== 4 || !timezone || !isTimezone(timezone)) return undefined
      const range = fixedRangeFromBounds(new Date(fromMs), new Date(toMs), timezone)
      return resolvedEpochs(range, timezone, now)
    }

    if (parts.length > 2) return undefined
    const timezone = parts.length === 1 ? DEFAULT_TIME_ZONE : second
    const range = parseDateRangeV2Preset(preset)
    if (!timezone || !isTimezone(timezone) || !range) return undefined
    return resolvedEpochs(range, timezone, now)
  },
  serialize: (value: DateRangeV2FilterValue): string => {
    const timezone = timezoneOf(value.timezone)
    if (value.range.kind === 'preset') return `${value.range.preset}|${timezone}`
    if (value.range.kind === 'fixed') {
      const resolved = resolvedEpochs(value.range, timezone, new Date())
      return `FIXED|${resolved.from.getTime()}|${resolved.to.getTime()}|${timezone}`
    }
    return `${formatDateRangeV2Preset(value.range)}|${timezone}`
  }
}

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
 * Presets on `{ mode: 'presets', presets }` reload through `getRange({ timezone })`.
 * Every other value uses `dateRangeV2FilterParser`.
 */
export const createDateRangeV2FilterParser = (config?: DateRangeV2Config) => {
  const presets = config?.modes?.find(mode => mode.mode === 'presets')?.presets
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
          const { from, to } = presetBounds(preset, timezone)
          return { from, to, range: { kind: 'preset', preset: preset.value }, timezone }
        }
      }
      return dateRangeV2FilterParser.parse(serialized, now)
    },
    serialize: (value: DateRangeV2FilterValue): string => {
      if (value.range.kind === 'preset') {
        const preset = matchPreset(value.range.preset)
        return `${preset?.value ?? value.range.preset}|${timezoneOf(value.timezone)}`
      }
      return dateRangeV2FilterParser.serialize(value)
    }
  }
}
