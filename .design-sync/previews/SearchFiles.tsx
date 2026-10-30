import * as React from 'react'
import { SearchFiles } from '@harnessio/ui'

const files = ['src/pipeline/executor.ts', 'src/pipeline/stages.ts', 'src/repo/branches.tsx', 'README.md', 'package.json', '.harness/ci.yaml']

export function Default() {
  return (
    <div style={{ width: 420, padding: 16 }}>
      <SearchFiles navigateToFile={() => {}} filesList={files} />
    </div>
  )
}

export function Small() {
  return (
    <div style={{ width: 420, padding: 16 }}>
      <SearchFiles searchInputSize="sm" navigateToFile={() => {}} filesList={files} />
    </div>
  )
}
