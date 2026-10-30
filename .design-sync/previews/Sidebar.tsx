import * as React from 'react'
import { Sidebar, Text } from '@harnessio/ui'

export function Expanded() {
  return (
    <div style={{ height: 320, display: 'flex' }}>
      <Sidebar.Provider>
        <Sidebar.Root style={{ width: 220 }}>
          <Sidebar.Header><Text variant="heading-base">Harness</Text></Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Item icon="pipeline" title="Pipelines" active />
              <Sidebar.Item icon="repository" title="Repos" />
              <Sidebar.Item icon="rocket" title="Deploys" />
              <Sidebar.Item icon="settings" title="Settings" />
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
    </div>
  )
}
