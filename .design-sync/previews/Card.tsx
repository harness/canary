import * as React from 'react'
import { Card } from '@harnessio/ui'

const wrap: React.CSSProperties = { width: 360, padding: 16 }

export function Default() {
  return (
    <div style={wrap}>
      <Card.Root>
        <Card.Title>payments-api</Card.Title>
        <Card.Content>Last deployed 2 hours ago to production. 14 successful runs this week.</Card.Content>
      </Card.Root>
    </div>
  )
}

export function Interactive() {
  return (
    <div style={wrap}>
      <Card.Root interactive>
        <Card.Title>Node service template</Card.Title>
        <Card.Content>Build, test and deploy a Node.js service to Kubernetes.</Card.Content>
      </Card.Root>
    </div>
  )
}

export function Selected() {
  return (
    <div style={wrap}>
      <Card.Root interactive selected>
        <Card.Title>Canary deployment</Card.Title>
        <Card.Content>Shift traffic gradually with automatic rollback.</Card.Content>
      </Card.Root>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={wrap}>
      <Card.Root disabled>
        <Card.Title>Blue-green deployment</Card.Title>
        <Card.Content>Not available on the free plan.</Card.Content>
      </Card.Root>
    </div>
  )
}
