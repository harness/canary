import * as React from 'react'
import { Topbar, Button, Text } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 720 }}>
      <Topbar.Root>
        <Topbar.Left>
          <Text variant="heading-base">canary / pipelines</Text>
        </Topbar.Left>
        <Topbar.Center>
          <Text color="foreground-3">main</Text>
        </Topbar.Center>
        <Topbar.Right>
          <Button variant="outline" size="sm">Run pipeline</Button>
        </Topbar.Right>
      </Topbar.Root>
    </div>
  )
}

export function LeftRight() {
  return (
    <div style={{ width: 720 }}>
      <Topbar.Root>
        <Topbar.Left>
          <Text variant="heading-base">Pull request #482</Text>
        </Topbar.Left>
        <Topbar.Right>
          <Button variant="outline" size="sm">Review</Button>
          <Button size="sm">Merge</Button>
        </Topbar.Right>
      </Topbar.Root>
    </div>
  )
}
