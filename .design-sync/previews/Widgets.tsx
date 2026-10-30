import * as React from 'react'
import { Widgets, Text } from '@harnessio/ui'

export function Single() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <Widgets.Root>
        <Widgets.Item title="Recent executions">
          <Text>build-and-deploy #1284 passed 4 minutes ago.</Text>
        </Widgets.Item>
        <Widgets.Item title="Open pull requests">
          <Text>12 open, 3 awaiting your review.</Text>
        </Widgets.Item>
      </Widgets.Root>
    </div>
  )
}

export function TwoColumn() {
  return (
    <div style={{ width: 760, padding: 16 }}>
      <Widgets.Root isTwoColumn>
        <Widgets.Item title="Deployments">
          <Text>prod-us-east is on v2.14.0.</Text>
        </Widgets.Item>
        <Widgets.Item title="Failing pipelines">
          <Text>2 pipelines failed in the last 24 hours.</Text>
        </Widgets.Item>
      </Widgets.Root>
    </div>
  )
}
