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
 * Converts comma-separated values to a structured object with metadata
 * @param inputValue The comma-separated string (e.g., "a,b,c" or "a:1,a:2,a:3")
 * @returns Object with data and metadata about key-value pairs
 */
export const csvToObject = (
  inputValue: string
): { data: Record<string, string>; metadata: Record<string, boolean> } => {
  if (!inputValue?.trim()) return { data: {}, metadata: {} }

  // Split by comma, trim whitespace, and filter out empty strings
  const parts = inputValue
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0)

  // Early return if no valid parts
  if (parts.length === 0) return { data: {}, metadata: {} }

  // Key-based deduplication - last occurrence wins
  const data: Record<string, string> = {}
  const metadata: Record<string, boolean> = {}

  for (const part of parts) {
    if (part.includes(':')) {
      const colonIndex = part.indexOf(':')
      const key = part.substring(0, colonIndex)
      const value = part.substring(colonIndex + 1)
      if (key && key.trim()) {
        const trimmedKey = key.trim()
        data[trimmedKey] = value ? value.trim() : ''
        metadata[trimmedKey] = true // This was a key-value pair
      } else {
        // If key is empty (like ":a"), treat as simple tag
        data[part] = part
        metadata[part] = false
      }
    } else {
      data[part] = part
      metadata[part] = false // This was a simple tag
    }
  }

  return { data, metadata }
}
