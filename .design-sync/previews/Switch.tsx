import * as React from 'react'
import { Switch } from '@harnessio/ui'

const col = { padding: 16, width: 380, display: 'flex', flexDirection: 'column' as const, gap: 16 }

export function States() {
  return (
    <div style={col}>
      <Switch defaultChecked label="Auto-deploy on merge" />
      <Switch label="Require approval" />
      <Switch disabled label="Branch protection" />
      <Switch disabled defaultChecked label="Audit logging" />
    </div>
  )
}

export function WithCaption() {
  return (
    <div style={col}>
      <Switch defaultChecked label="Notify on failure" caption="Send a Slack message to #deployments when a pipeline fails." />
      <Switch label="Cache dependencies" caption="Speeds up builds by restoring node_modules." />
    </div>
  )
}
