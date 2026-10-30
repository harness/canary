import * as React from 'react'
import { StatusBadge } from '@harnessio/ui'

const row = { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: 12, padding: 16 }

export function Themes() {
  return (
    <div style={row}>
      <StatusBadge variant="status" theme="success">Succeeded</StatusBadge>
      <StatusBadge variant="status" theme="danger">Failed</StatusBadge>
      <StatusBadge variant="status" theme="warning">Pending approval</StatusBadge>
      <StatusBadge variant="status" theme="info">Running</StatusBadge>
      <StatusBadge variant="status" theme="merged">Merged</StatusBadge>
      <StatusBadge variant="status" theme="muted">Skipped</StatusBadge>
      <StatusBadge variant="status" theme="risk">At risk</StatusBadge>
    </div>
  )
}

export function Variants() {
  return (
    <div style={row}>
      <StatusBadge variant="primary" theme="success">Open</StatusBadge>
      <StatusBadge variant="secondary" theme="success">Open</StatusBadge>
      <StatusBadge variant="outline" theme="success">Open</StatusBadge>
      <StatusBadge variant="ghost" theme="success">Open</StatusBadge>
    </div>
  )
}

export function WithIconAndPulse() {
  return (
    <div style={row}>
      <StatusBadge variant="status" theme="info" icon="clock" pulse>Deploying</StatusBadge>
      <StatusBadge variant="outline" theme="danger" icon="xmark-circle">Rollback</StatusBadge>
      <StatusBadge variant="secondary" theme="merged" icon="git-merge">Merged</StatusBadge>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={row}>
      <StatusBadge variant="status" theme="success" size="sm">Passed</StatusBadge>
      <StatusBadge variant="status" theme="success" size="md">Passed</StatusBadge>
    </div>
  )
}
