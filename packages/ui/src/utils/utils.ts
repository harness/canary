import { createElement, ReactNode } from 'react'

import { TimeAgoHoverCard } from '@/components'
import { formatDistance, formatDistanceToNow } from 'date-fns'

export const INITIAL_ZOOM_LEVEL = 1
export const ZOOM_INC_DEC_LEVEL = 0.1

const LOCALE = Intl.NumberFormat().resolvedOptions?.().locale || 'en-US'

/**
 * Format a timestamp to a localized date string
 * @param timestamp - Unix timestamp in milliseconds or ISO date string
 * @param dateStyle - DateTimeFormat style: 'full' | 'long' | 'medium' | 'short'
 * @returns Formatted date string or empty string if timestamp is falsy
 * @example
 * formatDate(1642774800000) // Returns "Jan 21, 2024"
 * formatDate("2022-01-21", "full") // Returns "Friday, January 21, 2024"
 */
export function formatDate(
  timestamp: number | string,
  dateStyle: Intl.DateTimeFormatOptions['dateStyle'] = 'medium'
): string {
  if (!timestamp) return ''

  try {
    return new Intl.DateTimeFormat(LOCALE, { dateStyle }).format(new Date(timestamp))
  } catch (error) {
    console.error(`Failed to format date: ${error}`)
    return ''
  }
}

/**
 * Calculate human-readable time distance between two dates
 * @param date1 - First date in milliseconds
 * @param date2 - Second date in milliseconds (defaults to 0)
 * @param onlyHighestDenomination - If true, returns only the highest unit (e.g., "2 days" instead of "2 days 3 hours")
 * @returns Formatted distance string
 */
export const timeDistance = (date1 = 0, date2 = 0, onlyHighestDenomination = false): string => {
  if (!date1 && !date2) return '0 seconds'

  const fullDistance = formatDistance(date1, date2, {
    includeSeconds: true,
    addSuffix: false
  })

  if (onlyHighestDenomination) {
    // Take only the first part of the string (e.g., from "2 days 3 hours" we get "2 days")
    return fullDistance.split(' ').slice(0, 2).join(' ')
  }

  return fullDistance
}

/**
 * Formats timestamp to relative time (e.g., "1 hour ago")
 * @param timestamp - Unix timestamp in milliseconds
 * @param cutoffDays - Days within which to use relative time (default: 3)
 * @returns formatted relative time string
 * @example
 * timeAgo(1708113838167) // Returns "1 hour ago"
 */

export const timeAgo = (timestamp?: number | null, cutoffDays: number = 3): ReactNode => {
  if (timestamp === null || timestamp === undefined) {
    return 'Unknown time'
  }

  const now = Date.now()
  const daysMs = cutoffDays * 24 * 60 * 60 * 1000
  const isOld = now - timestamp > daysMs

  if (isOld) {
    const date = new Date(timestamp)
    const formattedDate = new Intl.DateTimeFormat(LOCALE, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date)

    return createElement(TimeAgoHoverCard, { formattedDate, timeStamp: timestamp })
  }

  try {
    const formattedDate = formatDistanceToNow(timestamp, {
      addSuffix: true,
      includeSeconds: true
    })
    return createElement(TimeAgoHoverCard, { formattedDate, timeStamp: timestamp })
  } catch (error) {
    console.error(`Failed to format time ago: ${error}`)
    return 'Unknown time'
  }
}

/**
 * Format a number with current locale.
 * @param num number
 * @returns Formatted string.
 */
export function formatNumber(num: number | bigint): string {
  return num ? new Intl.NumberFormat(LOCALE).format(num) : ''
}

export interface Violation {
  violation: string
}

/**
 * Helps to construct conditional objects like this: {a: b, ...(some ? c : {}), z: x}
 */
export const wrapConditionalObjectElement = <T>(element: T, isPassing: boolean) => {
  if (!element || !isPassing) {
    return {} as T
  }

  return element
}

/**
 * Helps to construct conditional arrays like this: [item1, condition && item2, item3].filter(item => !!item)
 */
export const wrapConditionalArrayElements = <T>(elements: T[], isPassing: boolean) => {
  if (!elements || !isPassing) {
    return []
  }

  return elements
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
