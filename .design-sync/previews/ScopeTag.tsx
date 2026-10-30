import * as React from 'react'
import { ScopeTag } from '@harnessio/ui'

const ScopeType = { Account: 'Account', Organization: 'Organization', Project: 'Project', Repository: 'Repository' } as any

export function Scopes() {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <ScopeTag scopeType={ScopeType.Account} />
      <ScopeTag scopeType={ScopeType.Organization} scopedPath="platform-eng" />
      <ScopeTag scopeType={ScopeType.Project} scopedPath="platform-eng/payments-api" />
      <ScopeTag scopeType={ScopeType.Repository} scopedPath="platform-eng/payments-api/gateway" />
    </div>
  )
}

export function Small() {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <ScopeTag size="sm" scopeType={ScopeType.Organization} scopedPath="platform-eng" />
      <ScopeTag size="sm" scopeType={ScopeType.Project} scopedPath="platform-eng/payments-api" />
    </div>
  )
}
