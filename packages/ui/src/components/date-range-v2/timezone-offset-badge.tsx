import { ReactNode, useMemo } from 'react'

import { StatusBadge } from '../status-badge/status-badge'
import { Text } from '../text'
import { resolveTimeZone } from './resolve-date-range-v2'
import { formatTimeZoneOffset } from './timezone-utils'

/** Offset badge for controls that combine a date range and a timezone. */
export function TimezoneOffsetBadge({ displayTimezone }: { displayTimezone: string }) {
  const offset = useMemo(() => formatTimeZoneOffset(resolveTimeZone(displayTimezone)), [displayTimezone])
  return (
    <StatusBadge variant="secondary" size="sm">
      {offset}
    </StatusBadge>
  )
}

export function TimezoneOptionLabel({ displayTimezone, children }: { displayTimezone: string; children: ReactNode }) {
  return (
    <Text
      as="div"
      variant="body-single-line-normal"
      color="foreground-1"
      className="flex w-full items-center justify-between gap-cn-xs"
    >
      <TimezoneOffsetBadge displayTimezone={displayTimezone} />
      <span className="min-w-0 truncate">{children}</span>
    </Text>
  )
}
