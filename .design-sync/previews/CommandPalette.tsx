import * as React from 'react'
import { CommandPalette } from '@harnessio/ui'

export function Dialog() {
  return (
    <CommandPalette.Root>
      <CommandPalette.Dialog open onOpenChange={() => {}}>
        <CommandPalette.Input placeholder="Search or jump to..." />
        <CommandPalette.List>
          <CommandPalette.Empty>No results found.</CommandPalette.Empty>
          <CommandPalette.Group heading="Pipelines">
            <CommandPalette.Item>build-and-test<CommandPalette.Shortcut>⌘1</CommandPalette.Shortcut></CommandPalette.Item>
            <CommandPalette.Item>deploy-staging</CommandPalette.Item>
          </CommandPalette.Group>
          <CommandPalette.Separator />
          <CommandPalette.Group heading="Repositories">
            <CommandPalette.Item>harness-core</CommandPalette.Item>
            <CommandPalette.Item>platform-ui</CommandPalette.Item>
          </CommandPalette.Group>
        </CommandPalette.List>
      </CommandPalette.Dialog>
    </CommandPalette.Root>
  )
}
