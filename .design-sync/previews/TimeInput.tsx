import * as React from 'react'
import { TimeInput } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <TimeInput label="Deploy window start" defaultValue="02:30" />
    </div>
  )
}

export function WithCaption() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <TimeInput label="Nightly build time" caption="Runs in the pipeline's configured timezone." defaultValue="23:00" />
    </div>
  )
}

export function WithError() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <TimeInput label="Freeze window end" defaultValue="23:59" error="Enter a valid time." />
    </div>
  )
}
