import * as React from 'react'
import { ButtonGroup } from '@harnessio/ui'

const wrap: React.CSSProperties = { padding: 16 }

export function Horizontal() {
  return (
    <div style={wrap}>
      <ButtonGroup
        buttonsProps={[
          { children: 'Squash and merge', variant: 'outline' },
          { children: 'Rebase and merge', variant: 'outline' },
          { children: 'Create merge commit', variant: 'outline' }
        ]}
      />
    </div>
  )
}

export function Vertical() {
  return (
    <div style={wrap}>
      <ButtonGroup
        orientation="vertical"
        buttonsProps={[
          { children: 'Run pipeline', variant: 'outline' },
          { children: 'Edit YAML', variant: 'outline' },
          { children: 'View history', variant: 'outline' }
        ]}
      />
    </div>
  )
}

export function Small() {
  return (
    <div style={wrap}>
      <ButtonGroup
        size="sm"
        buttonsProps={[
          { children: 'Day', variant: 'outline' },
          { children: 'Week', variant: 'outline' },
          { children: 'Month', variant: 'outline' }
        ]}
      />
    </div>
  )
}
