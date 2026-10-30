import * as React from 'react'
import { CommitCopyActions } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16 }}>
      <CommitCopyActions sha="9a7f7f906c1d2e3b4a5f60718293a4b5c6d7e8f9" toCommitDetails={({ sha }) => `/commits/${sha}`} />
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, alignItems: 'flex-start' }}>
      <CommitCopyActions size="sm" sha="b8e819db3a1c2d3e4f5a60718293a4b5c6d7e8f9" />
      <CommitCopyActions size="xs" sha="8ce2d891a1c2d3e4f5a60718293a4b5c6d7e8f9a0" />
    </div>
  )
}
