import * as React from 'react'
import { HighlightText } from '@harnessio/ui'

const box = { display: 'flex', flexDirection: 'column', gap: 12, padding: 16, fontSize: 14 } as React.CSSProperties

export function SearchMatch() {
  return (
    <div style={box}>
      <HighlightText text="deploy-to-production" match="deploy" />
      <HighlightText text="build-and-test-service" match="test" />
      <HighlightText text="release/2.4.0-rc1" match="rc" />
    </div>
  )
}

export function NoMatch() {
  return (
    <div style={box}>
      <HighlightText text="canary-rollout-pipeline" match="staging" />
      <HighlightText text="canary-rollout-pipeline" />
    </div>
  )
}
