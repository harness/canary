import * as React from 'react'
import { FormSeparator, Text } from '@harnessio/ui'

const box = { display: 'flex', flexDirection: 'column', gap: 12, padding: 16, width: 360 } as React.CSSProperties

export function Solid() {
  return <div style={box}><Text>Pipeline settings</Text><FormSeparator /><Text>Trigger settings</Text></div>
}
export function Dashed() {
  return <div style={box}><Text>Pipeline settings</Text><FormSeparator dashed /><Text>Trigger settings</Text></div>
}
export function Dotted() {
  return <div style={box}><Text>Pipeline settings</Text><FormSeparator dotted /><Text>Trigger settings</Text></div>
}
