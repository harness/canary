import * as React from 'react'
import { Button, Sheet, Text } from '@harnessio/ui'

export function Right() {
  return (
    <Sheet.Root open>
      <Sheet.Content side="right" hideCloseButton>
        <Sheet.Header>
          <Sheet.Title>Execution #482</Sheet.Title>
          <Sheet.Description>deploy-api on main, triggered by webhook</Sheet.Description>
        </Sheet.Header>
        <div style={{ padding: 16 }}><Text>Stage 2 of 4: integration tests running.</Text></div>
        <Sheet.Footer>
          <Button variant="outline">Abort</Button>
          <Button>View logs</Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  )
}

export function Left() {
  return (
    <Sheet.Root open>
      <Sheet.Content side="left" hideCloseButton>
        <Sheet.Header>
          <Sheet.Title>Filters</Sheet.Title>
          <Sheet.Description>Narrow the pipeline list</Sheet.Description>
        </Sheet.Header>
        <div style={{ padding: 16 }}><Text>Status, branch, and author filters.</Text></div>
      </Sheet.Content>
    </Sheet.Root>
  )
}
