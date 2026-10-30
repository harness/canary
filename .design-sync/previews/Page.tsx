import * as React from 'react'
import { Button, Page, Text } from '@harnessio/ui'

export function WithHeader() {
  return (
    <div style={{ width: 720 }}>
      <Page.Root>
        <Page.Header title="build-and-deploy" description="Runs on every push to main" actions={<Button>Run pipeline</Button>} />
        <Page.Content>
          <Text>Last execution passed in 6m 16s.</Text>
        </Page.Content>
      </Page.Root>
    </div>
  )
}
export function HeaderV2() {
  return (
    <div style={{ width: 720 }}>
      <Page.Root>
        <Page.HeaderV2 title="Repositories" description="All repositories in this project" />
        <Page.Content>
          <Text>harness-core, platform-ui, canary</Text>
        </Page.Content>
      </Page.Root>
    </div>
  )
}
