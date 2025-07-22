export function createRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function escapeSingleQuote(str: string) {
  return str.replace(`'`, `&#39;`)
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

/**
 * Formats ISO format date string to human-readable duration format.
 * For e.g., "2024-09-10T13:38:55-07:00" is formatted as "1 hour ago".
 * @param timestamp
 * @returns formatted duration string
 */
export const timeAgoFromISOTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  // Always treat time differences as past events
  const absDiffInSeconds = Math.abs(diffInSeconds)
  return formatRelativeTime(absDiffInSeconds)
}
