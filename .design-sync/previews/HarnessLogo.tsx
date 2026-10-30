import * as React from 'react'
import { HarnessLogo } from '@harnessio/ui'

export function Symbol() {
  return <div style={{ padding: 16 }}><HarnessLogo size={32} /></div>
}

export function Full() {
  return <div style={{ padding: 16 }}><HarnessLogo full size={32} /></div>
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 16 }}>
      <HarnessLogo size={16} />
      <HarnessLogo size={24} />
      <HarnessLogo size={48} />
      <HarnessLogo full size={20} />
    </div>
  )
}
