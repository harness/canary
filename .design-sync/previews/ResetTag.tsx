import * as React from 'react'
import { ResetTag } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <ResetTag label="Branch" value="main" onReset={() => {}} />
      <ResetTag label="Status" value="Failed" theme="red" onReset={() => {}} />
      <ResetTag label="Environment" value="production" theme="green" onReset={() => {}} />
    </div>
  )
}

export function Variants() {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <ResetTag variant="secondary" label="Author" value="priya.s" onReset={() => {}} />
      <ResetTag variant="outline" label="Author" value="priya.s" onReset={() => {}} />
      <ResetTag size="sm" label="Pipeline" value="deploy-api" onReset={() => {}} />
      <ResetTag rounded label="Trigger" value="Webhook" theme="purple" onReset={() => {}} />
    </div>
  )
}
