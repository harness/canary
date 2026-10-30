import * as React from 'react'
import { Shimmer } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Shimmer>Analyzing pipeline failure...</Shimmer>
      <Shimmer color="brand">Generating deployment plan...</Shimmer>
      <Shimmer color="foreground-3">Waiting for approval</Shimmer>
    </div>
  )
}
