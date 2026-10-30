import * as React from 'react'
import { Caption } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 360, padding: 16 }}>
      <Caption>Branch names may contain letters, numbers, and dashes.</Caption>
    </div>
  )
}

export function Short() {
  return (
    <div style={{ width: 360, padding: 16 }}>
      <Caption>Used as the pipeline identifier in URLs.</Caption>
    </div>
  )
}
