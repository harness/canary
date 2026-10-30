import * as React from 'react'
import { ViewOnly } from '@harnessio/ui'

const data = [
  { label: 'Pipeline', value: 'build-and-deploy' },
  { label: 'Branch', value: 'main' },
  { label: 'Trigger', value: 'Push to main' },
  { label: 'Duration', value: '4m 32s' }
]

export function Columns() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <ViewOnly title="Execution details" data={data} layout="columns" />
    </div>
  )
}

export function SingleColumnVertical() {
  return (
    <div style={{ width: 360, padding: 16 }}>
      <ViewOnly title="Repository" layout="singleColumn" itemLayout="vertical" data={[
        { label: 'Name', value: 'canary' },
        { label: 'Default branch', value: 'main' },
        { label: 'Visibility', value: 'Private' }
      ]} />
    </div>
  )
}
