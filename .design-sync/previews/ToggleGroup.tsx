import * as React from 'react'
import { ToggleGroup } from '@harnessio/ui'

export function Single() {
  return (
    <div style={{ padding: 16 }}>
      <ToggleGroup.Root type="single" value="30d">
        <ToggleGroup.Item value="24h" text="24h" />
        <ToggleGroup.Item value="7d" text="7 days" />
        <ToggleGroup.Item value="30d" text="30 days" />
        <ToggleGroup.Item value="90d" text="90 days" />
      </ToggleGroup.Root>
    </div>
  )
}

export function Multiple() {
  return (
    <div style={{ padding: 16 }}>
      <ToggleGroup.Root type="multiple" value={['success', 'failed']} selectedVariant="primary">
        <ToggleGroup.Item value="success" text="Success" />
        <ToggleGroup.Item value="failed" text="Failed" />
        <ToggleGroup.Item value="running" text="Running" />
        <ToggleGroup.Item value="aborted" text="Aborted" disabled />
      </ToggleGroup.Root>
    </div>
  )
}

export function Small() {
  return (
    <div style={{ padding: 16 }}>
      <ToggleGroup.Root type="single" value="list" size="sm">
        <ToggleGroup.Item value="list" text="List" suffixIcon="list" />
        <ToggleGroup.Item value="tags" text="Tags" suffixIcon="tag" />
      </ToggleGroup.Root>
    </div>
  )
}
