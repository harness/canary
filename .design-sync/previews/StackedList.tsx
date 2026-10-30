import * as React from 'react'
import { StackedList, StatusBadge } from '@harnessio/ui'

const rows = [
  { name: 'payments-service', desc: 'Build and deploy payments API', status: 'Succeeded', theme: 'success' as const },
  { name: 'web-frontend', desc: 'Lint, test, and publish bundle', status: 'Running', theme: 'info' as const },
  { name: 'data-pipeline', desc: 'Nightly ETL to warehouse', status: 'Failed', theme: 'danger' as const }
]

export function Pipelines() {
  return (
    <div style={{ padding: 16, width: 640 }}>
      <StackedList.Root>
        <StackedList.Header>
          <StackedList.Field title="Pipelines" description="3 pipelines in this project" />
        </StackedList.Header>
        {rows.map((r) => (
          <StackedList.Item key={r.name}>
            <StackedList.Field title={r.name} description={r.desc} />
            <StackedList.Field right title={<StatusBadge variant="status" theme={r.theme}>{r.status}</StatusBadge>} />
          </StackedList.Item>
        ))}
      </StackedList.Root>
    </div>
  )
}

export function Simple() {
  return (
    <div style={{ padding: 16, width: 480 }}>
      <StackedList.Root border>
        <StackedList.Item>
          <StackedList.Field title="main" description="Updated 2 hours ago" />
        </StackedList.Item>
        <StackedList.Item>
          <StackedList.Field title="release/2.14" description="Updated yesterday" />
        </StackedList.Item>
        <StackedList.Item>
          <StackedList.Field title="feature/oauth-device-flow" description="Updated 3 days ago" />
        </StackedList.Item>
      </StackedList.Root>
    </div>
  )
}
