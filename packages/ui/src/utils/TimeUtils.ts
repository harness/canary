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
