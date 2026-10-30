import * as React from 'react'
import { CounterBadge, Text } from '@harnessio/ui'

const row = { display: 'flex', gap: 12, alignItems: 'center', padding: 16 }

export function Themes() {
  return (
    <div style={row}>
      <CounterBadge>12</CounterBadge>
      <CounterBadge theme="info">8</CounterBadge>
      <CounterBadge theme="success">24</CounterBadge>
      <CounterBadge theme="danger">3</CounterBadge>
    </div>
  )
}

export function Outline() {
  return (
    <div style={row}>
      <CounterBadge variant="outline">12</CounterBadge>
      <CounterBadge variant="outline" theme="info">8</CounterBadge>
      <CounterBadge variant="outline" theme="success">24</CounterBadge>
      <CounterBadge variant="outline" theme="danger">3</CounterBadge>
    </div>
  )
}

export function InLabel() {
  return (
    <div style={row}>
      <Text>Open pull requests</Text>
      <CounterBadge>42</CounterBadge>
      <Text>Failed executions</Text>
      <CounterBadge theme="danger">5</CounterBadge>
    </div>
  )
}
