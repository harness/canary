import * as React from 'react'
import { Toggle } from '@harnessio/ui'

export function States() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 16 }}>
      <Toggle text="Failed only" />
      <Toggle text="Failed only" selected />
      <Toggle text="My pipelines" selected selectedVariant="primary" />
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 16, alignItems: 'center' }}>
      <Toggle text="Extra small" size="xs" />
      <Toggle text="Small" size="sm" />
      <Toggle text="Medium" size="md" selected />
    </div>
  )
}

export function WithIcon() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 16 }}>
      <Toggle text="Filter" prefixIcon="filter" />
      <Toggle text="Tags" prefixIcon="tag" selected />
      <Toggle text="Rounded" rounded variant="ghost" />
    </div>
  )
}
