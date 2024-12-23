/**
 * Formats ISO format date string to human-readable duration format.
 * For e.g., "2024-09-10T13:38:55-07:00" is formatted as "1 hour ago".
 * @param timestamp
 * @returns formatted duration string
 */
export const timeAgoFromISOTime = (timestamp: string, maxDiff: number = 2): string => {
  const date = new Date(timestamp)
  const now = new Date()

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const diffInDays = diffInSeconds / (3600 * 24)

  if (diffInDays <= maxDiff) {
    return formatRelativeTime(diffInSeconds)
  } else {
    return date.toLocaleDateString('en', { dateStyle: 'medium' })
  }
}

/**
 * Formats epoch timestamp to human-readable duration format.
 * For e.g. "1726260316887" is formatted as "1 hour ago".
 * @param timestamp
 * @returns formatted duration string
 */
export const timeAgoFromEpochTime = (timestamp: number, maxDiff: number = 2): string => {
  const now = Date.now()
  const diffInSeconds = Math.floor((now - timestamp) / 1000)
  const diffInDays = diffInSeconds / (3600 * 24)

  if (diffInDays <= maxDiff) {
    return formatRelativeTime(diffInSeconds)
  } else {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en', { dateStyle: 'medium' })
  }
}

const formatRelativeTime = (diffInSeconds: number): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute')
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour')
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day')
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month')
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return rtf.format(-diffInYears, 'year')
}

export const getDuration = (startTime?: number, endTime?: number): number => {
  if (!endTime || !startTime) return 0
  if (startTime > endTime) return 0
  return endTime - startTime
}

/**
 * Formats duration in milliseconds to human-readable duration format.
 * For 3723000 is formatted as "1h 2m 3s".
 * @param durationInMs
 * @returns
 */
export const formatDuration = (durationInMs: number): string => {
  const seconds = Math.floor(durationInMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const remainingSeconds = seconds % 60
  const remainingMinutes = minutes % 60
  const formatted = []

  if (hours > 0) {
    formatted.push(new Intl.NumberFormat().format(hours) + 'h')
  }
  if (remainingMinutes > 0) {
    formatted.push(new Intl.NumberFormat().format(remainingMinutes) + 'm')
  }
  if (remainingSeconds > 0) {
    formatted.push(new Intl.NumberFormat().format(remainingSeconds) + 's')
  }

  return formatted.join(' ')
}
