import * as React from 'react'
import { IconWithTooltip } from '@harnessio/ui'

export function Open() {
  return (
    <div style={{ padding: '70px 16px 16px 16px' }}>
      <IconWithTooltip iconProps={{ name: 'info-circle' } as any} content="Failed steps are retried up to 3 times." title="Retry policy" open side="top" />
    </div>
  )
}
export function Closed() {
  return (
    <div style={{ display: 'flex', gap: 16, padding: 16 }}>
      <IconWithTooltip iconProps={{ name: 'info-circle' } as any} content="Runs on every push to main." />
      <IconWithTooltip iconProps={{ name: 'warning-triangle', color: 'warning' } as any} content="Delegate is out of date." />
    </div>
  )
}
