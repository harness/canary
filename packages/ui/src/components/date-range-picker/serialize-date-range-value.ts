import { normalizeDateRangeValue } from './normalize-date-range-value'
import { resolveDateRange } from './resolve-date-range'
import {
  CalendarPeriod,
  DATE_RANGE_CODEC_VERSION,
  DateRangeInput,
  DateRangeUnit,
  DateRangeValue,
  DEFAULT_TIME_ZONE,
  TimeZoneId,
  Weekday
} from './types'

const parseEndpoint = (value: string): { date: string; time?: string } => {
  const [date, time] = value.split('T')
  return { date, ...(time ? { time } : {}) }
}

const parseAdjustment = (parts: string[], start: number): unknown => {
  const type = parts[start]
  if (!type) return undefined
  if (type === 'off' && parts.length === start + 3) {
    return {
      type: 'offset',
      offset: { amount: Number(parts[start + 1]), unit: parts[start + 2] }
    }
  }
  if (type === 'ex' && parts.length === start + 3) {
    const weekdays = parts[start + 2] === '' ? [] : parts[start + 2].split(',').map(day => Number(day) as Weekday)
    return {
      type: 'exclude',
      exclude: { incompleteInterval: parts[start + 1] === '1', weekdays }
    }
  }
  return Symbol.for('invalid-date-range-adjustment')
}

const parseVersionOne = (value: string, fallbackTimeZone: TimeZoneId): DateRangeValue | undefined => {
  const parts = value.split('~')
  const kind = parts[1]
  let candidate: unknown

  if (kind === 'rel' && parts.length >= 6) {
    const adjustment = parseAdjustment(parts, 6)
    if (typeof adjustment === 'symbol') return undefined
    candidate = {
      kind: 'relative',
      direction: parts[2],
      amount: Number(parts[3]),
      unit: parts[4] as DateRangeUnit,
      timeZone: parts[5],
      ...(adjustment ? { adjustment } : {})
    }
  } else if (kind === 'cal' && parts.length === 5) {
    candidate = {
      kind: 'calendar',
      period: parts[2] as CalendarPeriod,
      extent: parts[3],
      timeZone: parts[4]
    }
  } else if (kind === 'abs' && parts.length === 5) {
    candidate = {
      kind: 'absolute',
      from: parseEndpoint(parts[2]),
      to: parseEndpoint(parts[3]),
      timeZone: parts[4]
    }
  } else {
    return undefined
  }

  const normalized = normalizeDateRangeValue(candidate, fallbackTimeZone)
  if (!normalized) return undefined
  try {
    resolveDateRange(normalized)
    return normalized
  } catch {
    return undefined
  }
}

export const parseDateRangeValue = (
  serialized: string,
  fallbackTimeZone: TimeZoneId = DEFAULT_TIME_ZONE
): DateRangeValue | undefined => {
  if (typeof serialized !== 'string' || serialized.length === 0) return undefined

  try {
    const decoded = decodeURIComponent(serialized)
    if (decoded.startsWith(`${DATE_RANGE_CODEC_VERSION}~`)) {
      return parseVersionOne(decoded, fallbackTimeZone)
    }
    if (/^\d+,\d+$/.test(decoded)) {
      const [from, to] = decoded.split(',').map(Number)
      return normalizeDateRangeValue({ from, to }, fallbackTimeZone)
    }
    const parsed = JSON.parse(decoded)
    return normalizeDateRangeValue(parsed, fallbackTimeZone)
  } catch {
    return undefined
  }
}

const serializeEndpoint = ({ date, time }: { date: string; time?: string }): string =>
  `${date}${time ? `T${time}` : ''}`

export const serializeDateRangeValue = (input: DateRangeInput): string => {
  const value = normalizeDateRangeValue(input)
  if (!value) throw new TypeError('Cannot serialize an invalid date range value')
  resolveDateRange(value)

  if (value.kind === 'relative') {
    const base = [DATE_RANGE_CODEC_VERSION, 'rel', value.direction, value.amount, value.unit, value.timeZone].join('~')
    if (!value.adjustment) return base
    if (value.adjustment.type === 'offset') {
      return `${base}~off~${value.adjustment.offset.amount}~${value.adjustment.offset.unit}`
    }
    const weekdays = [...new Set(value.adjustment.exclude.weekdays ?? [])].sort().join(',')
    return `${base}~ex~${value.adjustment.exclude.incompleteInterval ? 1 : 0}~${weekdays}`
  }

  if (value.kind === 'calendar') {
    return [
      DATE_RANGE_CODEC_VERSION,
      'cal',
      value.period,
      value.period.startsWith('this_') ? (value.extent ?? 'full') : 'full',
      value.timeZone
    ].join('~')
  }

  return [
    DATE_RANGE_CODEC_VERSION,
    'abs',
    serializeEndpoint(value.from),
    serializeEndpoint(value.to),
    value.timeZone
  ].join('~')
}

export const dateRangeValueParser = {
  parse: (value: string): DateRangeValue => {
    const parsed = parseDateRangeValue(value)
    if (!parsed) throw new TypeError('Cannot parse an invalid date range value')
    return parsed
  },
  serialize: serializeDateRangeValue
}
