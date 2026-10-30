import * as React from 'react'
import { Button, Popover, Text } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 360, height: 220, padding: 16 }}>
      <Popover.Root defaultOpen>
        <Popover.Trigger><Button variant="outline">Build info</Button></Popover.Trigger>
        <Popover.Content title="Build #482" description="Triggered by push to main. Passed in 6m 16s." />
      </Popover.Root>
    </div>
  )
}
export function WithCustomContent() {
  return (
    <div style={{ width: 360, height: 220, padding: 16 }}>
      <Popover.Root defaultOpen>
        <Popover.Trigger><Button variant="outline">Environment</Button></Popover.Trigger>
        <Popover.Content side="bottom">
          <Text className="block">staging-us-east</Text>
          <Text color="foreground-3" className="block">Last deployed 12 minutes ago</Text>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
