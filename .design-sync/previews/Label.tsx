import * as React from 'react'
import { Label } from '@harnessio/ui'

const box = { display: 'flex', flexDirection: 'column', gap: 14, padding: 16 } as React.CSSProperties

export function Basic() {
  return <div style={box}><Label>Pipeline name</Label><Label optional>Description</Label><Label disabled>Repository (locked)</Label></div>
}
export function WithTooltip() {
  return (
    <div style={box}>
      <Label tooltipContent="Branch the pipeline runs against by default.">Default branch</Label>
      <Label optional tooltipContent="Used for audit logs only.">Change reason</Label>
    </div>
  )
}
