import * as React from 'react'
import { DataTable, Text, StatusBadge } from '@harnessio/ui'

type Run = { name: string; branch: string; status: 'Success' | 'Failed' | 'Running'; duration: string; author: string }

const data: Run[] = [
  { name: 'build-and-deploy', branch: 'main', status: 'Success', duration: '4m 12s', author: 'Priya Nair' },
  { name: 'nightly-regression', branch: 'main', status: 'Failed', duration: '18m 03s', author: 'Scheduler' },
  { name: 'feature-preview', branch: 'feature/retry', status: 'Running', duration: '1m 45s', author: 'Marcus Lee' },
  { name: 'release-2.14', branch: 'release/2.14', status: 'Success', duration: '9m 30s', author: 'Ana Souza' }
]

const columns: any[] = [
  { accessorKey: 'name', header: 'Pipeline', cell: ({ row }: any) => <Text variant="body-strong">{row.original.name}</Text> },
  { accessorKey: 'branch', header: 'Branch' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => (
      <StatusBadge variant="status" theme={row.original.status === 'Success' ? 'success' : row.original.status === 'Failed' ? 'danger' : 'warning'}>
        {row.original.status}
      </StatusBadge>
    )
  },
  { accessorKey: 'duration', header: 'Duration' },
  { accessorKey: 'author', header: 'Triggered by' }
]

export function Default() {
  return (
    <div style={{ width: 760, padding: 16 }}>
      <DataTable data={data} columns={columns} />
    </div>
  )
}

export function Compact() {
  return (
    <div style={{ width: 760, padding: 16 }}>
      <DataTable data={data} columns={columns} size="compact" />
    </div>
  )
}

export function Selectable() {
  return (
    <div style={{ width: 760, padding: 16 }}>
      <DataTable data={data} columns={columns} enableRowSelection getRowId={(r: Run) => r.name} defaultRowSelection={{ 'build-and-deploy': true }} />
    </div>
  )
}
