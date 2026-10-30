import * as React from 'react'
import { Button, DropdownMenu } from '@harnessio/ui'

function Frame({ children }: { children: React.ReactNode }) {
  return <div style={{ width: 360, height: 300, padding: 16 }}>{children}</div>
}

export function Actions() {
  return (
    <Frame>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">Pipeline actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <DropdownMenu.Item title="Run pipeline" shortcut="R" />
          <DropdownMenu.Item title="Edit YAML" />
          <DropdownMenu.Item title="Clone" />
          <DropdownMenu.Separator />
          <DropdownMenu.Item title="Delete" disabled />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Frame>
  )
}

export function Checkboxes() {
  return (
    <Frame>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">Columns</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <DropdownMenu.CheckboxItem title="Status" checked />
          <DropdownMenu.CheckboxItem title="Branch" checked />
          <DropdownMenu.CheckboxItem title="Duration" />
          <DropdownMenu.CheckboxItem title="Triggered by" />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Frame>
  )
}

export function WithHeaderAndFooter() {
  return (
    <Frame>
      <DropdownMenu.Root open modal={false}>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">Environment</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <DropdownMenu.Header>Deploy target</DropdownMenu.Header>
          <DropdownMenu.Item title="production" description="us-east-1" />
          <DropdownMenu.Item title="staging" description="us-west-2" />
          <DropdownMenu.Item title="preview" description="ephemeral" />
          <DropdownMenu.Footer>3 environments</DropdownMenu.Footer>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Frame>
  )
}
