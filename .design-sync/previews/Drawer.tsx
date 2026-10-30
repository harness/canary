import * as React from 'react'
import { Button, Drawer, Text } from '@harnessio/ui'

export function RunDetails() {
  return (
    <Drawer.Root open direction="right">
      <Drawer.Content size="md">
        <Drawer.Header>
          <Drawer.Title>Execution #1284</Drawer.Title>
          <Drawer.Description>build-and-deploy on main, triggered by a push</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Text className="block">Stage build finished in 3m 12s. Stage deploy-staging is waiting on approval from the release manager.</Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>Close</Drawer.Close>
          <Button>Approve</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  )
}

export function HeaderV2() {
  return (
    <Drawer.Root open direction="right">
      <Drawer.Content size="lg">
        <Drawer.HeaderV2 title="Connector settings" description="Configure the GitHub connector used by pipelines in this project." icon="key" />
        <Drawer.Body>
          <Text className="block">Authentication uses a personal access token stored in the project secret manager.</Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>Cancel</Drawer.Close>
          <Button>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  )
}
