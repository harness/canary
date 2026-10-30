import * as React from 'react'
import { TimeAgoCard } from '@harnessio/ui'

const now = Date.now()
const row = { padding: 16, display: 'flex', flexDirection: 'column' as const, gap: 12 }

export function Recent() {
  return (
    <div style={row}>
      <TimeAgoCard timestamp={now - 5 * 60 * 1000} />
      <TimeAgoCard timestamp={now - 3 * 60 * 60 * 1000} />
      <TimeAgoCard timestamp={now - 2 * 24 * 60 * 60 * 1000} />
    </div>
  )
}

export function WithPrefix() {
  return (
    <div style={row}>
      <TimeAgoCard prefix="Updated" timestamp={now - 45 * 60 * 1000} />
      <TimeAgoCard prefix="Deployed" timestamp={now - 26 * 24 * 60 * 60 * 1000} />
    </div>
  )
}
