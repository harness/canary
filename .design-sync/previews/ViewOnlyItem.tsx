import * as React from 'react'
import { ViewOnlyItem } from '@harnessio/ui'

export function Horizontal() {
  return (
    <div style={{ width: 360, padding: 16 }}>
      <ViewOnlyItem label="Environment" value="prod-us-east" />
    </div>
  )
}

export function Vertical() {
  return (
    <div style={{ width: 360, padding: 16 }}>
      <ViewOnlyItem label="Last deployed by" value="Priya Nair" itemLayout="vertical" />
    </div>
  )
}
