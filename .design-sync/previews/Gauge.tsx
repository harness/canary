import * as React from 'react'
import { Gauge } from '@harnessio/ui'

const row = { display: 'flex', flexWrap: 'wrap', gap: 32, padding: 16 } as React.CSSProperties

export function Statuses() {
  return (
    <div style={row}>
      <Gauge value={92} status="auto" label="Coverage" />
      <Gauge value={64} status="auto" label="Coverage" />
      <Gauge value={31} status="auto" label="Coverage" />
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ ...row, alignItems: 'flex-end' }}>
      <Gauge value={80} size="sm" label="Build health" />
      <Gauge value={80} size="md" label="Build health" />
      <Gauge value={80} size="lg" label="Build health" />
    </div>
  )
}

export function Formats() {
  return (
    <div style={row}>
      <Gauge value={7} max={10} valueFormat="fraction" label="Checks passed" status="good" />
      <Gauge value={8.2} max={10} valueFormat="score" label="Security score" status="auto" />
    </div>
  )
}
