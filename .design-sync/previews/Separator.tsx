import * as React from 'react'
import { Separator, Text } from '@harnessio/ui'

export function Horizontal() {
  return (
    <div style={{ width: 360, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Text>Build #482 passed</Text>
      <Separator />
      <Text>Deploy to staging pending approval</Text>
    </div>
  )
}

export function Vertical() {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center', height: 32 }}>
      <Text>main</Text>
      <Separator orientation="vertical" />
      <Text>12 commits</Text>
      <Separator orientation="vertical" />
      <Text>3 contributors</Text>
    </div>
  )
}
