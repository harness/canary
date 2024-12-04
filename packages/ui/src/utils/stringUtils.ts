export const getInitials = (name: string, length?: number) => {
  // Split the name into an array of words, ignoring empty strings
  const words = name.split(' ').filter(Boolean)

  // Get the initials from the words
  const initials = words
    .map(word => word[0].toUpperCase()) // Get the first letter of each word
    .join('')

  // If length is provided, truncate the initials to the desired length
  return length ? initials.slice(0, length) : initials
}
