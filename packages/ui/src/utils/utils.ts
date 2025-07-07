import { Children, createElement, isValidElement, ReactElement, ReactNode } from 'react'

import { TimeAgoCard } from '@/components'
import { formatDistanceToNow } from 'date-fns'

import { LOCALE } from './TimeUtils'

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

/**
 * Formats timestamp to relative time (e.g., "1 hour ago")
 * @param timestamp - Unix timestamp in milliseconds
 * @param dateTimeFormatOptions - Configuration options for DateTime result string format
 * @param cutoffDays - Days within which to use relative time (default: 8)
 * @returns formatted relative time string
 * @example
 * timeAgo(1708113838167) // Returns "1 hour ago"
 */
export const timeAgo = (
  timestamp?: string | number | null,
  dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  },
  cutoffDays: number = 8
): ReactNode => {
  if (timestamp === null || timestamp === undefined) {
    return 'Unknown time'
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000

  const timestampDate = new Date(timestamp)
  const nowDate = new Date()

  const differenceInMilliseconds = nowDate.getTime() - timestampDate.getTime()
  const cutoffDaysMilliseconds = cutoffDays * millisecondsPerDay

  const isBeyondCutoffDays = differenceInMilliseconds > cutoffDaysMilliseconds

  if (isBeyondCutoffDays) {
    const formattedDate = new Intl.DateTimeFormat(LOCALE, dateTimeFormatOptions).format(timestampDate)

    return createElement(TimeAgoCard, { formattedDate, timeStamp: timestampDate.getTime() })
  }

  try {
    const formattedDate = formatDistanceToNow(timestamp, {
      addSuffix: true,
      includeSeconds: true
    })
    return createElement(TimeAgoCard, { formattedDate, timeStamp: timestampDate.getTime() })
  } catch (error) {
    console.error(`Failed to format time ago: ${error}`)
    return 'Unknown time'
  }
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
