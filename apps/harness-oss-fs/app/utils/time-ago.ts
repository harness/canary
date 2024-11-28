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
