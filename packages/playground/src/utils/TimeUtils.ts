/**
 * @param startTs
 * @param endTs
 * @returns duration in "1h 2m 3s" format
 */
export const getFormattedDuration = (startTs: number, endTs: number): string => {
  if (startTs > endTs) return '0s'
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
