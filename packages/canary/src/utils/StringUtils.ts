export const getInitials = (name: string, length?: number) => {
  const words = name.split(' ').filter(Boolean)
  const initials = words.map(word => word[0].toUpperCase()).join('')
  return length ? initials.slice(0, length) : initials
}
