import * as React from 'react'
import { AvatarWithTooltip } from '@harnessio/ui'

const row: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', padding: 16 }

export function Default() {
  return (
    <div style={row}>
      <AvatarWithTooltip name="Priya Raman" size="md" />
      <AvatarWithTooltip name="Marcus Lee" size="md" rounded />
      <AvatarWithTooltip name="Dana Whitfield" size="lg" />
    </div>
  )
}

export function Group() {
  return (
    <div style={row}>
      <AvatarWithTooltip name="platform-team" isGroup size="md" />
      <AvatarWithTooltip name="release-managers" isGroup size="lg" />
    </div>
  )
}
