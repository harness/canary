import * as React from 'react'
import { CopyButton, Text } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16 }}>
      <Text className="font-body-code">git clone https://git.harness.io/acme/harness-core.git</Text>
      <CopyButton name="git clone https://git.harness.io/acme/harness-core.git" />
    </div>
  )
}

export function Variants() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
      <CopyButton name="a1b2c3d" buttonVariant="outline" />
      <CopyButton name="a1b2c3d" buttonVariant="secondary" size="sm" />
      <CopyButton name="a1b2c3d" buttonVariant="ghost" size="md" />
    </div>
  )
}
