import { Children, isValidElement, ReactElement, ReactNode } from 'react'

import { get } from 'lodash-es'

export const INITIAL_ZOOM_LEVEL = 1
export const ZOOM_INC_DEC_LEVEL = 0.1

export interface Violation {
  violation: string
}

/**
 * Generate a random alphanumeric hash of a given length
 * @param length - The length of the hash to generate
 * @returns A random alphanumeric hash of the given length
 */
export function generateAlphaNumericHash(length: number) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export const filterChildrenByDisplayNames = (
  children: ReactNode,
  displayNames: string[],
  exclude?: true
): ReactElement[] => {
  return Children.toArray(children).filter((child): child is ReactElement => {
    if (!isValidElement(child) || !child.type || typeof child.type === 'string') {
      return false
    }

    const childDisplayName = (child.type as any).displayName
    return exclude ? !displayNames.includes(childDisplayName) : displayNames.includes(childDisplayName)
  })
}

export const getErrorMessage = (error: Error | string | null, defaultMessage: string): string => {
  if (!error) {
    return defaultMessage
  }

  if (typeof error === 'string' && error.length > 0) {
    return error
  }

  return (
    (get(error, 'data.error', get(error, 'data.message', get(error, 'message', error))) as string) || defaultMessage
  )
}
