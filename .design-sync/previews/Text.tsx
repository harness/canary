import * as React from 'react'
import { Text } from '@harnessio/ui'

export function Headings() {
  return (
    <div className="flex flex-col gap-3 p-4 w-[560px]">
      <Text variant="heading-hero">Release orchestration</Text>
      <Text variant="heading-section">Deployments this week</Text>
      <Text variant="heading-default">Production environment</Text>
      <Text variant="heading-subsection">Recent failures</Text>
      <Text variant="heading-base">Pipeline settings</Text>
      <Text variant="heading-small">Notifications</Text>
    </div>
  )
}

export function Body() {
  return (
    <div className="flex flex-col gap-3 p-4 w-[560px]">
      <Text variant="body-normal">Pipelines run on every merge to main. Failed stages notify the owning team.</Text>
      <Text variant="body-strong">Pipelines run on every merge to main.</Text>
      <Text variant="body-code">harness pipeline run --branch main</Text>
      <Text variant="caption-normal">Updated 4 minutes ago by Priya Nair</Text>
      <Text variant="caption-strong">Last run</Text>
    </div>
  )
}

export function Colors() {
  return (
    <div className="flex flex-col gap-2 p-4 w-[560px]">
      <Text color="foreground-1">Primary text</Text>
      <Text color="foreground-2">Secondary text</Text>
      <Text color="foreground-3">Tertiary text</Text>
      <Text color="success">Deployment succeeded</Text>
      <Text color="danger">Deployment failed</Text>
      <Text color="warning">Approval required</Text>
      <Text color="brand">Open in Harness</Text>
    </div>
  )
}

export function Truncation() {
  return (
    <div className="flex flex-col gap-3 p-4 w-[280px]">
      <Text truncate>feat: add canary verification step to the production deployment pipeline</Text>
      <Text lineClamp={2}>feat: add canary verification step to the production deployment pipeline and wire it to the rollback policy</Text>
    </div>
  )
}
