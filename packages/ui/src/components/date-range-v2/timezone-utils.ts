import { formatInTimeZone, fromZonedTime, getTimezoneOffset, toZonedTime } from 'date-fns-tz'

import type { CivilDate, CivilDateTime, CivilTime, TimeZoneId } from './types'

const DEFAULT_TIME_ZONE: TimeZoneId = 'UTC'
const CIVIL_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const CIVIL_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/
const CIVIL_DATE_TIME_PATTERN = /^(\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))T([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/

const isValidTimeZone = (timeZone: unknown): timeZone is TimeZoneId => {
  if (typeof timeZone !== 'string' || timeZone.length === 0 || timeZone === 'LOCALE') return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format()
    return true
  } catch {
    return false
  }
}

export const normalizeTimeZone = (timeZone: unknown): TimeZoneId =>
  isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIME_ZONE

export const isCivilDate = (value: unknown): value is CivilDate => {
  if (typeof value !== 'string' || !CIVIL_DATE_PATTERN.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export const isCivilTime = (value: unknown): value is CivilTime =>
  typeof value === 'string' && CIVIL_TIME_PATTERN.test(value)

export const isCivilDateTime = (value: unknown): value is CivilDateTime => {
  if (typeof value !== 'string' || !CIVIL_DATE_TIME_PATTERN.test(value)) return false
  return isCivilDate(value.slice(0, 10))
}

export const zonedCivilToUtc = (
  date: CivilDate,
  time: CivilTime = '00:00',
  timeZone: TimeZoneId = DEFAULT_TIME_ZONE
): Date => fromZonedTime(`${date}T${time}:00.000`, normalizeTimeZone(timeZone))

/** The string is the exact local second. It has no offset of its own. */
export const zonedCivilDateTimeToUtc = (value: CivilDateTime, timeZone: TimeZoneId = DEFAULT_TIME_ZONE): Date =>
  fromZonedTime(`${value}.000`, normalizeTimeZone(timeZone))

export const utcToCivilDate = (date: Date, timeZone: TimeZoneId = DEFAULT_TIME_ZONE): CivilDate =>
  formatInTimeZone(date, normalizeTimeZone(timeZone), 'yyyy-MM-dd') as CivilDate

export const utcToCivilTime = (date: Date, timeZone: TimeZoneId = DEFAULT_TIME_ZONE): CivilTime =>
  formatInTimeZone(date, normalizeTimeZone(timeZone), 'HH:mm') as CivilTime

export const utcToCivilDateTime = (date: Date, timeZone: TimeZoneId = DEFAULT_TIME_ZONE): CivilDateTime =>
  formatInTimeZone(date, normalizeTimeZone(timeZone), "yyyy-MM-dd'T'HH:mm:ss") as CivilDateTime

/** Moves the civil clock by whole hours. The browser zone never changes the result. */
export const shiftCivilDateTimeHours = (value: CivilDateTime, hours: number): CivilDateTime => {
  const [date, time] = value.split('T')
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute, second] = time.split(':').map(Number)
  const next = new Date(Date.UTC(year, month - 1, day, hour + hours, minute, second))
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}T${pad(next.getUTCHours())}:${pad(next.getUTCMinutes())}:${pad(next.getUTCSeconds())}` as CivilDateTime
}

export const formatTimeZoneOffset = (timeZone: TimeZoneId, at: Date = new Date()): string => {
  const offsetMinutes = Math.round(getTimezoneOffset(normalizeTimeZone(timeZone), at) / 60_000)
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absoluteMinutes = Math.abs(offsetMinutes)
  return `UTC${sign}${String(Math.floor(absoluteMinutes / 60)).padStart(2, '0')}:${String(
    absoluteMinutes % 60
  ).padStart(2, '0')}`
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

export const getSupportedTimeZones = (): TimeZoneId[] => {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] }
  const zones = intl.supportedValuesOf?.('timeZone') ?? FALLBACK_TIME_ZONES
  return [DEFAULT_TIME_ZONE, ...new Set(zones.filter(zone => zone !== DEFAULT_TIME_ZONE && isValidTimeZone(zone)))]
}

export const getBrowserTimeZone = (): TimeZoneId => normalizeTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)

export const toZonedWallTime = (instant: Date, timeZone: TimeZoneId): Date =>
  toZonedTime(instant, normalizeTimeZone(timeZone))

export const fromZonedWallTime = (wallTime: Date, timeZone: TimeZoneId): Date =>
  fromZonedTime(wallTime, normalizeTimeZone(timeZone))
