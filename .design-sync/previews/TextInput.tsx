import * as React from 'react'
import { TextInput } from '@harnessio/ui'

const col = { padding: 16, width: 400, display: 'flex', flexDirection: 'column' as const, gap: 16 }

export function Basic() {
  return (
    <div style={col}>
      <TextInput label="Pipeline name" placeholder="e.g. build-and-deploy" />
      <TextInput label="Repository" defaultValue="acme/payments-service" caption="Format: owner/name" />
      <TextInput label="Webhook secret" optional placeholder="Optional" />
    </div>
  )
}

export function Themes() {
  return (
    <div style={col}>
      <TextInput label="Branch" defaultValue="main" theme="success" caption="Branch exists" />
      <TextInput label="Timeout" defaultValue="-5" error="Timeout must be a positive number" />
      <TextInput label="Image tag" defaultValue="latest" warning="Avoid using the latest tag in production" />
    </div>
  )
}

export function Sizes() {
  return (
    <div style={col}>
      <TextInput size="sm" label="Small" defaultValue="payments-service" />
      <TextInput size="md" label="Medium" defaultValue="payments-service" />
      <TextInput label="Disabled" defaultValue="read-only-value" disabled />
    </div>
  )
}

export function WithAffixes() {
  return (
    <div style={col}>
      <TextInput label="Service URL" prefix="https://" defaultValue="api.acme.io" />
      <TextInput label="Memory limit" defaultValue="512" suffix="MiB" />
    </div>
  )
}
