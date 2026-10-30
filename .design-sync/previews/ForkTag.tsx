import * as React from 'react'
import { ForkTag } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16 }}>
      <ForkTag repoIdentifier="web-app" repoPath="acme/web-app" branchName="main" />
    </div>
  )
}

export function Variants() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <ForkTag repoIdentifier="payments" repoPath="acme/payments" branchName="release/2.4" variant="outline" />
      <ForkTag repoIdentifier="payments" repoPath="acme/payments" branchName="release/2.4" theme="purple" size="sm" hideCopyButton />
    </div>
  )
}
