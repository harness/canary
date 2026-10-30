import * as React from 'react'
import { Button, Tooltip } from '@harnessio/ui'

export function Basic() {
  return (
    <div style={{ padding: '56px 120px' }}>
      <Tooltip open content="Re-run the failed stages only" side="top">
        <Button variant="outline">Re-run failed</Button>
      </Tooltip>
    </div>
  )
}

export function WithTitle() {
  return (
    <div style={{ padding: '56px 120px' }}>
      <Tooltip open title="Pipeline paused" content="Waiting for manual approval from the release-managers group." side="bottom">
        <Button variant="outline">build-and-deploy</Button>
      </Tooltip>
    </div>
  )
}

export function Right() {
  return (
    <div style={{ padding: '24px 24px 24px 24px' }}>
      <Tooltip open content="Last run 4 minutes ago on main" side="right">
        <Button variant="outline">Run</Button>
      </Tooltip>
    </div>
  )
}
