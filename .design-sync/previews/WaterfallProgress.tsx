import * as React from 'react'
import { WaterfallProgress } from '@harnessio/ui'

export function Stages() {
  return (
    <div style={{ width: 520, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <WaterfallProgress label="Checkout" value={10} theme="success" />
      <WaterfallProgress label="Build" value={35} startOffset={10} theme="success" />
      <WaterfallProgress label="Test" value={25} startOffset={45} theme="danger" />
      <WaterfallProgress label="Deploy" value={20} startOffset={70} theme="info" inProgress />
    </div>
  )
}

export function Themes() {
  return (
    <div style={{ width: 520, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <WaterfallProgress label="Queued" value={30} theme="muted" />
      <WaterfallProgress label="Retrying" value={40} startOffset={30} theme="warning" />
      <WaterfallProgress label="Done" value={30} startOffset={70} theme="success" />
    </div>
  )
}
