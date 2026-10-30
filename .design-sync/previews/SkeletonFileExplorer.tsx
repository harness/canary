import * as React from 'react'
import { SkeletonFileExplorer } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16, width: 280 }}>
      <SkeletonFileExplorer linesCount={6} />
    </div>
  )
}

export function ManyLines() {
  return (
    <div style={{ padding: 16, width: 280 }}>
      <SkeletonFileExplorer linesCount={10} />
    </div>
  )
}
