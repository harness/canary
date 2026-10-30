import * as React from 'react'
import { Checkbox } from '@harnessio/ui'

const col = { display: 'flex', flexDirection: 'column' as const, gap: 16, padding: 16, width: 360 }

export function States() {
  return (
    <div style={col}>
      <Checkbox label="Run on pull request" defaultChecked />
      <Checkbox label="Run on push to main" />
      <Checkbox label="Run nightly regression" checked="indeterminate" />
    </div>
  )
}

export function WithCaption() {
  return (
    <div style={col}>
      <Checkbox
        label="Enable build cache"
        caption="Reuses layers from previous executions to speed up Docker builds."
        defaultChecked
      />
      <Checkbox label="Send failure notifications" caption="Notify #deployments in Slack when a stage fails." />
    </div>
  )
}

export function RequiredAndError() {
  return (
    <div style={col}>
      <Checkbox label="I accept the deployment policy" required error caption="You must accept before promoting to production." />
      <Checkbox label="Tag release automatically" showOptionalLabel />
    </div>
  )
}
