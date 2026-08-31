import { formatInTimeZone, fromZonedTime, getTimezoneOffset, toZonedTime } from 'date-fns-tz'

import { CivilDate, CivilTime, DEFAULT_TIME_ZONE, TimeZoneId } from './types'

const CIVIL_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const CIVIL_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const isValidTimeZone = (timeZone: unknown): timeZone is TimeZoneId => {
  if (typeof timeZone !== 'string' || timeZone.length === 0) return false

  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format()
    return true
  } catch {
    return false
  }
}

export const normalizeTimeZone = (timeZone: unknown, fallback: TimeZoneId = DEFAULT_TIME_ZONE): TimeZoneId =>
  isValidTimeZone(timeZone) ? timeZone : isValidTimeZone(fallback) ? fallback : DEFAULT_TIME_ZONE

export const isCivilDate = (value: unknown): value is CivilDate => {
  if (typeof value !== 'string' || !CIVIL_DATE_PATTERN.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export const isCivilTime = (value: unknown): value is CivilTime =>
  typeof value === 'string' && CIVIL_TIME_PATTERN.test(value)

export const zonedCivilToUtc = (
  date: CivilDate,
  time: CivilTime = '00:00',
  timeZone: TimeZoneId = DEFAULT_TIME_ZONE
): Date => fromZonedTime(`${date}T${time}:00.000`, normalizeTimeZone(timeZone))

export const utcToCivilDate = (date: Date, timeZone: TimeZoneId = DEFAULT_TIME_ZONE): CivilDate =>
  formatInTimeZone(date, normalizeTimeZone(timeZone), 'yyyy-MM-dd') as CivilDate

export const utcToCivilTime = (date: Date, timeZone: TimeZoneId = DEFAULT_TIME_ZONE): CivilTime =>
  formatInTimeZone(date, normalizeTimeZone(timeZone), 'HH:mm') as CivilTime

export const addCivilDays = (date: CivilDate, amount: number): CivilDate => {
  const [year, month, day] = date.split('-').map(Number)
  const result = new Date(Date.UTC(year, month - 1, day + amount))
  return [
    result.getUTCFullYear(),
    String(result.getUTCMonth() + 1).padStart(2, '0'),
    String(result.getUTCDate()).padStart(2, '0')
  ].join('-') as CivilDate
}

export const startOfZonedDay = (instant: Date, timeZone: TimeZoneId = DEFAULT_TIME_ZONE): Date =>
  zonedCivilToUtc(utcToCivilDate(instant, timeZone), '00:00', timeZone)

export const endExclusiveZonedDay = (instant: Date, timeZone: TimeZoneId = DEFAULT_TIME_ZONE): Date =>
  zonedCivilToUtc(addCivilDays(utcToCivilDate(instant, timeZone), 1), '00:00', timeZone)

export const formatTimeZoneOffset = (timeZone: TimeZoneId, at: Date = new Date()): string => {
  const safeTimeZone = normalizeTimeZone(timeZone)
  const offsetMinutes = Math.round(getTimezoneOffset(safeTimeZone, at) / 60_000)
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absoluteMinutes = Math.abs(offsetMinutes)
  const hours = Math.floor(absoluteMinutes / 60)
  const minutes = absoluteMinutes % 60
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export const formatTimeZoneLabel = (timeZone: unknown, at: Date = new Date()): string => {
  const safeTimeZone = normalizeTimeZone(timeZone)
  if (safeTimeZone === DEFAULT_TIME_ZONE) return DEFAULT_TIME_ZONE

  let shortName = safeTimeZone
  try {
    const part = new Intl.DateTimeFormat('en-US', {
      timeZone: safeTimeZone,
      timeZoneName: 'short'
    })
      .formatToParts(at)
      .find(item => item.type === 'timeZoneName')?.value
    if (part && !/^GMT[+-]/.test(part)) shortName = part
  } catch {
    // normalizeTimeZone already guarantees a usable fallback.
  }

  return `${shortName} (${formatTimeZoneOffset(safeTimeZone, at)})`
}

const FALLBACK_TIME_ZONES: TimeZoneId[] = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland'
]

/** Returns UTC first, followed by the runtime's complete IANA zone list when available. */
export const getSupportedTimeZones = (): TimeZoneId[] => {
  const intlWithSupportedValues = Intl as typeof Intl & {
    supportedValuesOf?: (key: 'timeZone') => string[]
  }
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const supported = intlWithSupportedValues.supportedValuesOf?.('timeZone') ?? FALLBACK_TIME_ZONES

  return [
    DEFAULT_TIME_ZONE,
    ...new Set([browserTimeZone, ...supported].filter(zone => zone !== DEFAULT_TIME_ZONE && isValidTimeZone(zone)))
  ]
}

/** The runtime's own zone, falling back to UTC when it reports an unusable one. */
export const getBrowserTimeZone = (): TimeZoneId => normalizeTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)

/**
 * The two zones people reach for most: UTC and their own. Callers list these
 * above the full zone list. Collapses to one entry when the browser is on UTC.
 */
export const getPreferredTimeZones = (): TimeZoneId[] => {
  const browserTimeZone = getBrowserTimeZone()
  return browserTimeZone === DEFAULT_TIME_ZONE ? [DEFAULT_TIME_ZONE] : [DEFAULT_TIME_ZONE, browserTimeZone]
}

/** A Date whose local fields represent the wall clock in timeZone. */
export const toZonedWallTime = (instant: Date, timeZone: TimeZoneId): Date =>
  toZonedTime(instant, normalizeTimeZone(timeZone))

/** Converts a wall-clock Date produced by date-fns back to a UTC instant. */
export const fromZonedWallTime = (wallTime: Date, timeZone: TimeZoneId): Date =>
  fromZonedTime(wallTime, normalizeTimeZone(timeZone))
