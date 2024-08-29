export const getInitials = (name: string) => {
  // Split the name into an array of words
  const words = name.split(' ')
  // Map over the words to get the first letter of each
  const initials = words.map(word => word[0].toUpperCase()).join('')
  // Return the initials
  return initials
}

const LOCALE = Intl.NumberFormat().resolvedOptions?.().locale || 'en-US'

/**
 * Format a timestamp to medium format date (i.e: Jan 1, 2021)
 * @param timestamp Timestamp
 * @param dateStyle Optional DateTimeFormat's `dateStyle` option.
 */
export function formatDate(timestamp: number | string, dateStyle = 'medium'): string {
  return timestamp
    ? new Intl.DateTimeFormat(LOCALE, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: TS built-in type for DateTimeFormat is not correct
        dateStyle
      }).format(new Date(timestamp))
    : ''
}
