import * as React from 'react'
import { Slider } from '@harnessio/ui'

const wrap = { padding: 16, width: 380 }

export function Basic() {
  return (
    <div style={wrap}>
      <Slider label="Parallel stages" defaultValue={[4]} min={1} max={10} step={1} showValue />
    </div>
  )
}

export function WithMinMax() {
  return (
    <div style={wrap}>
      <Slider
        label="Canary traffic"
        caption="min-max"
        minLabel="0%"
        maxLabel="100%"
        defaultValue={[25]}
        min={0}
        max={100}
        showValue
        formatValue={(v) => `${v[0]}%`}
      />
    </div>
  )
}

export function Range() {
  return (
    <div style={wrap}>
      <Slider
        label="Build duration (minutes)"
        caption="description"
        description="Filter executions by how long they ran."
        defaultValue={[5, 30]}
        min={0}
        max={60}
        showValue
        formatValue={(v) => `${v[0]} - ${v[1]} min`}
      />
    </div>
  )
}

export function Disabled() {
  return (
    <div style={wrap}>
      <Slider label="Replica count" defaultValue={[3]} min={1} max={8} disabled showValue />
    </div>
  )
}
