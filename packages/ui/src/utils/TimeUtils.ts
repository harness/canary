import { formatDistance } from 'date-fns'

/**
 * @param startTs
 * @param endTs
 * @returns duration in "1h 2m 3s" format
 */
export const getFormattedDuration = (startTs = 0, endTs = 0): string => {
  if (startTs >= endTs) return '0s'
  const totalSeconds = Math.floor((endTs - startTs) / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []

  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`)
  }

  return parts.join(' ')
}

/**
 * Formats duration in milliseconds or nanoseconds to human-readable duration format.
 * For 3723000 is formatted as "1h 2m 3s".
 * @param durationInMs
 * @param unit
 * @returns
 */

export const formatDuration = (duration: number, unit: 'ms' | 'ns' = 'ms'): string => {
  if (!duration) return '0s'

  let totalSeconds: number
  let remainingMs = 0

  if (unit === 'ms') {
    totalSeconds = Math.floor(duration / 1000)
    if (totalSeconds === 0) remainingMs = duration
  } else {
    totalSeconds = Math.floor(duration / 1e9)
    if (totalSeconds === 0) remainingMs = (duration % 1e9) / 1e6
  }

  if (totalSeconds === 0) {
    return remainingMs > 0 ? new Intl.NumberFormat().format(remainingMs) + 'ms' : '0s'
  }

  const hours = Math.floor(totalSeconds / 3600)
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60)
  const remainingSeconds = totalSeconds % 60

  const formatted = []
  if (hours > 0) formatted.push(new Intl.NumberFormat().format(hours) + 'h')
  if (remainingMinutes > 0) formatted.push(new Intl.NumberFormat().format(remainingMinutes) + 'm')
  if (remainingSeconds > 0) formatted.push(new Intl.NumberFormat().format(remainingSeconds) + 's')

  return formatted.join(' ') || '0s'
}

/**
 * Formats an epoch timestamp into a string in the format "HH:mm:ss.SSS".
 *
 * @param epoch - The epoch timestamp (milliseconds since January 1, 1970).
 * @returns A formatted string representing the time in "HH:mm:ss.SSS" format.
 */
export const formatTimestamp = (epoch: number): string => {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false
  }).format(new Date(epoch))
}

// Constants
export const LOCALE = Intl.NumberFormat().resolvedOptions?.().locale || 'en-US'

/**
 * Format a timestamp to a localized date string
 * @param timestamp - Unix timestamp in milliseconds or ISO date string
 * @param dateStyle - DateTimeFormat style: 'full' | 'long' | 'medium' | 'short'
 * @returns Formatted date string or empty string if timestamp is falsy
 * @example
 * formatDate(1642774800000) // Returns "Jan 21, 2024"
 * formatDate("2022-01-21", "full") // Returns "Friday, January 21, 2024"
 */
export function formatDate(
  timestamp: number | string,
  dateStyle: Intl.DateTimeFormatOptions['dateStyle'] = 'medium'
): string {
  if (!timestamp) return ''

  try {
    return new Intl.DateTimeFormat(LOCALE, { dateStyle }).format(new Date(timestamp))
  } catch (error) {
    console.error(`Failed to format date: ${error}`)
    return ''
  }
}

/**
 * Calculate human-readable time distance between two dates
 * @param date1 - First date in milliseconds
 * @param date2 - Second date in milliseconds (defaults to 0)
 * @param onlyHighestDenomination - If true, returns only the highest unit (e.g., "2 days" instead of "2 days 3 hours")
 * @returns Formatted distance string
 */
export const timeDistance = (date1 = 0, date2 = 0, onlyHighestDenomination = false): string => {
  if (!date1 && !date2) return '0 seconds'

  const fullDistance = formatDistance(date1, date2, {
    includeSeconds: true,
    addSuffix: false
  })

  if (onlyHighestDenomination) {
    // Take only the first part of the string (e.g., from "2 days 3 hours" we get "2 days")
    return fullDistance.split(' ').slice(0, 2).join(' ')
  }

  return fullDistance
}

/**
 * Format a number with current locale.
 * @param num number
 * @returns Formatted string.
 */
export function formatNumber(num: number | bigint): string {
  return num ? new Intl.NumberFormat(LOCALE).format(num) : ''
}
