import * as React from 'react'
import { TimezoneOffsetBadge } from '@harnessio/ui'

export function Zones() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 16, alignItems: 'center' }}>
      <TimezoneOffsetBadge displayTimezone="America/Los_Angeles" />
      <TimezoneOffsetBadge displayTimezone="UTC" />
      <TimezoneOffsetBadge displayTimezone="Asia/Kolkata" />
    </div>
  )
}
