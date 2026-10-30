import * as React from 'react'
import { Avatar } from '@harnessio/ui'

const row: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', padding: 16 }

export function Sizes() {
  return (
    <div style={row}>
      <Avatar name="Priya Raman" size="xs" />
      <Avatar name="Priya Raman" size="sm" />
      <Avatar name="Priya Raman" size="md" />
      <Avatar name="Priya Raman" size="lg" />
    </div>
  )
}

export function Rounded() {
  return (
    <div style={row}>
      <Avatar name="Marcus Lee" rounded size="md" />
      <Avatar name="Dana Whitfield" rounded size="md" />
      <Avatar name="Tomas Novak" rounded size="lg" />
    </div>
  )
}

export function Fallbacks() {
  return (
    <div style={row}>
      <Avatar size="md" />
      <Avatar name="platform-team" isGroup size="md" />
      <Avatar icon="pipeline" size="md" />
    </div>
  )
}
