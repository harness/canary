import { isValidElement, ReactNode } from 'react'

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

export const extractTextFromReactNode = (node: ReactNode): string => {
  // Handle string/number directly
  if (typeof node === 'string' || typeof node === 'number') return String(node)

  // Handle arrays by recursively extracting and joining with newlines
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join('\n')
  }

  // Handle React elements by extracting their children
  if (isValidElement(node)) {
    return extractTextFromReactNode(node.props.children)
  }

  // Handle null/undefined/boolean
  return ''
}
