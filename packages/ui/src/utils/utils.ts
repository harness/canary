import { createElement, ReactNode } from 'react'

import { TimeAgoHoverCard } from '@/components'
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
      second: '2-digit',
      hour12: true
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
