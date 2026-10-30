import * as React from 'react'
import { CopyTag } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 16 }}>
      <CopyTag value="v2.14.0" />
      <CopyTag value="9a7f7f9" icon="git-commit" />
    </div>
  )
}

export function WithLabel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, alignItems: 'flex-start' }}>
      <CopyTag label="Branch" value="feature/pipeline-retry" theme="blue" />
      <CopyTag label="Image" value="harness/delegate:25.10.1" theme="purple" variant="outline" />
      <CopyTag label="Env" value="production" theme="green" size="sm" />
    </div>
  )
}
