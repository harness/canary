import * as React from 'react'
import { SeveritySlider } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 420, padding: 24 }}>
      <SeveritySlider label="Vulnerability severity" defaultValue={[1, 3]} min={0} max={4} step={1} labels={['Info', 'Low', 'Medium', 'High', 'Critical']} />
    </div>
  )
}

export function Disabled() {
  return (
    <div style={{ width: 420, padding: 24 }}>
      <SeveritySlider label="Fail build at severity" defaultValue={[2, 4]} min={0} max={4} step={1} labels={['Info', 'Low', 'Medium', 'High', 'Critical']} disabled />
    </div>
  )
}
