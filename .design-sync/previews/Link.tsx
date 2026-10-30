import * as React from 'react'
import { Link } from '@harnessio/ui'

const box = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, padding: 16 } as React.CSSProperties

export function Variants() {
  return <div style={box}><Link to="#">View execution</Link><Link to="#" variant="secondary">Pipeline settings</Link><Link to="#" size="sm">Small link</Link></div>
}
export function WithIcons() {
  return <div style={box}><Link to="#" prefixIcon>Back to repositories</Link><Link to="#" suffixIcon>Open in docs</Link><Link href="https://harness.io" external>harness.io</Link></div>
}
export function Disabled() {
  return <div style={box}><Link to="#" disabled>Rollback unavailable</Link><Link to="#" noHoverUnderline>No underline</Link></div>
}
