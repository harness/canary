import * as React from 'react'
import { Tag } from '@harnessio/ui'

const row = { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: 12, padding: 16 }

export function Themes() {
  return (
    <div style={row}>
      <Tag value="production" theme="red" />
      <Tag value="staging" theme="orange" />
      <Tag value="qa" theme="yellow" />
      <Tag value="stable" theme="green" />
      <Tag value="canary" theme="blue" />
      <Tag value="experimental" theme="purple" />
      <Tag value="legacy" theme="gray" />
    </div>
  )
}

export function KeyValue() {
  return (
    <div style={row}>
      <Tag label="env" value="production" theme="blue" />
      <Tag label="team" value="platform" theme="purple" variant="outline" />
      <Tag label="region" value="us-east-1" theme="cyan" />
    </div>
  )
}

export function WithIconAndAction() {
  return (
    <div style={row}>
      <Tag value="backend" icon="tag" theme="indigo" />
      <Tag value="needs-review" theme="orange" actionIcon="xmark" onActionClick={() => {}} />
      <Tag value="rounded" theme="green" rounded />
    </div>
  )
}

export function Sizes() {
  return (
    <div style={row}>
      <Tag value="small" size="sm" theme="blue" />
      <Tag value="medium" size="md" theme="blue" />
      <Tag value="disabled" theme="blue" disabled />
    </div>
  )
}
