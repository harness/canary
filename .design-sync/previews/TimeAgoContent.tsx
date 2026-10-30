import * as React from 'react'
import { TimeAgoContent } from '@harnessio/ui'

export function MultiZone() {
  return (
    <div style={{ padding: 16 }}>
      <TimeAgoContent
        formattedFullArray={[
          { label: 'UTC', date: 'Oct 29, 2026', time: '14:32:08' },
          { label: 'PDT', date: 'Oct 29, 2026', time: '07:32:08' }
        ]}
      />
    </div>
  )
}

export function SingleZone() {
  return (
    <div style={{ padding: 16 }}>
      <TimeAgoContent formattedFullArray={[{ label: 'UTC', date: 'Oct 12, 2026', time: '03:05:41' }]} />
    </div>
  )
}

export function Empty() {
  return (
    <div style={{ padding: 16 }}>
      <TimeAgoContent formattedFullArray={[]} />
    </div>
  )
}
