import * as React from 'react'
import { BranchTag } from '@harnessio/ui'

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, padding: 16, alignItems: 'flex-start' }

export function Default() {
  return (
    <div style={col}>
      <BranchTag branchName="main" />
      <BranchTag branchName="feature/PIPE-2231-retry-stage" />
    </div>
  )
}

export function Variants() {
  return (
    <div style={col}>
      <BranchTag branchName="release/2.14" variant="secondary" theme="purple" />
      <BranchTag branchName="hotfix/token-refresh" variant="outline" theme="red" />
      <BranchTag branchName="main" variant="outline" size="sm" hideCopyButton />
    </div>
  )
}
