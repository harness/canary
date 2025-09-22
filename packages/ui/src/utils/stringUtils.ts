export const getInitials = (name: string, length = 2) => {
  // Split the name into an array of words, ignoring empty strings
  const words = name.split(' ').filter(Boolean)

  // Get the initials from the words
  const initials = words
    .map(word => word[0].toUpperCase()) // Get the first letter of each word
    .join('')

  // If length is provided, truncate the initials to the desired length
  return length ? initials.slice(0, length) : initials
}

/**
 * Converts comma-separated values to a generic object with key-based deduplication
 * @param inputValue The comma-separated string (e.g., "a,b,c" or "a:1,a:2,a:3")
 * @returns Record<string, string> with deduplication applied (last occurrence wins)
 */
export const csvToObject = (inputValue: string): Record<string, string> => {
  if (!inputValue?.trim()) return {}

  // Split by comma, trim whitespace, and filter out empty strings
  const parts = inputValue
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0)

  // Early return if no valid parts
  if (parts.length === 0) return {}

  // Key-based deduplication - last occurrence wins
  const result: Record<string, string> = {}
  for (const part of parts) {
    if (part.includes(':')) {
      const [key, value] = part.split(':', 2)
      if (key && key.trim()) {
        result[key.trim()] = value ? value.trim() : ''
      }
    } else {
      result[part] = part
    }
  }

  return result
}
