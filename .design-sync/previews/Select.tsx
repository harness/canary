import * as React from 'react'
import { Select } from '@harnessio/ui'

const envs = [
  { label: 'Development', value: 'dev' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'prod' }
]

export function Default() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <Select label="Environment" options={envs} defaultValue="staging" />
    </div>
  )
}

export function WithCaptionAndError() {
  return (
    <div style={{ width: 320, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Select label="Target branch" caption="Merges land here" options={[{ label: 'main', value: 'main' }, { label: 'develop', value: 'develop' }]} defaultValue="main" />
      <Select label="Region" error="Select a region" options={[{ label: 'us-east-1', value: 'use1' }, { label: 'eu-west-1', value: 'euw1' }]} />
    </div>
  )
}

export function Small() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <Select size="sm" options={envs} defaultValue="dev" clearable />
    </div>
  )
}
