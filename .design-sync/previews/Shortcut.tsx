import * as React from 'react'
import { Shortcut, Text } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
      <Shortcut>⌘K</Shortcut>
      <Shortcut>⌘⇧P</Shortcut>
      <Shortcut>Esc</Shortcut>
    </div>
  )
}

export function InContext() {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
      <Text>Search pipelines</Text>
      <Shortcut>⌘K</Shortcut>
    </div>
  )
}
