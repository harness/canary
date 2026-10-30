import * as React from 'react'
import { Table, StatusBadge, Text } from '@harnessio/ui'

const rows = [
  { name: 'payments-service', branch: 'main', status: 'Succeeded', theme: 'success' as const, dur: '4m 32s' },
  { name: 'web-frontend', branch: 'feature/dark-mode', status: 'Running', theme: 'info' as const, dur: '1m 05s' },
  { name: 'data-pipeline', branch: 'main', status: 'Failed', theme: 'danger' as const, dur: '12m 48s' },
  { name: 'auth-gateway', branch: 'release/2.14', status: 'Pending', theme: 'warning' as const, dur: '-' }
]

export function Executions() {
  return (
    <div style={{ padding: 16, width: 720 }}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Pipeline</Table.Head>
            <Table.Head>Branch</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Duration</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.name}>
              <Table.Cell><Text>{r.name}</Text></Table.Cell>
              <Table.Cell><Text color="foreground-3">{r.branch}</Text></Table.Cell>
              <Table.Cell><StatusBadge variant="status" theme={r.theme}>{r.status}</StatusBadge></Table.Cell>
              <Table.Cell><Text>{r.dur}</Text></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export function SortableCompact() {
  return (
    <div style={{ padding: 16, width: 720 }}>
      <Table.Root size="compact">
        <Table.Header>
          <Table.Row>
            <Table.Head sortable sortDirection="asc">Pipeline</Table.Head>
            <Table.Head sortable sortDirection={false}>Duration</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.slice(0, 3).map((r) => (
            <Table.Row key={r.name} selected={r.name === 'web-frontend'}>
              <Table.Cell><Text>{r.name}</Text></Table.Cell>
              <Table.Cell><Text>{r.dur}</Text></Table.Cell>
              <Table.Cell><StatusBadge variant="status" theme={r.theme}>{r.status}</StatusBadge></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
