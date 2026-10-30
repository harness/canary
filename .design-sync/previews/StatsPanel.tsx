import * as React from 'react'
import { StatsPanel, StatusBadge, Text } from '@harnessio/ui'

const data = [
  { label: 'Status', value: <StatusBadge variant="status" theme="success">Succeeded</StatusBadge> },
  { label: 'Duration', value: <Text>4m 32s</Text> },
  { label: 'Triggered by', value: <Text>jane.doe</Text> },
  { label: 'Branch', value: <Text>main</Text> },
  { label: 'Commit', value: <Text>a1b2c3d</Text> }
]

export function ExecutionSummary() {
  return (
    <div style={{ padding: 16, width: 640 }}>
      <StatsPanel data={data} />
    </div>
  )
}

export function Loading() {
  return (
    <div style={{ padding: 16, width: 640 }}>
      <StatsPanel data={data} isLoading />
    </div>
  )
}

export function MissingValues() {
  return (
    <div style={{ padding: 16, width: 640 }}>
      <StatsPanel
        data={[
          { label: 'Owner', value: <Text>platform-team</Text> },
          { label: 'Last deployed' },
          { label: 'Environment' }
        ]}
      />
    </div>
  )
}
