const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/** Binary (1024) units, e.g. 50 * 1024² → "50 MB". */
export function formatBytes(bytes: number): string {
  let n = Math.max(0, bytes)
  let i = 0
  while (n >= 1024 && i < UNITS.length - 1) {
    n /= 1024
    i++
  }
  const value = i === 0 ? Math.round(n) : Math.round(n * 10) / 10
  return `${value} ${UNITS[i]}`
}
