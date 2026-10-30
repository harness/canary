import * as React from 'react'
import { Command } from '@harnessio/ui'

function List() {
  return (
    <Command.List>
      <Command.Empty>No results found.</Command.Empty>
      <Command.Group heading="Pipelines">
        <Command.Item>build-and-test<Command.Shortcut>⌘1</Command.Shortcut></Command.Item>
        <Command.Item>deploy-staging</Command.Item>
        <Command.Item>nightly-regression</Command.Item>
      </Command.Group>
      <Command.Separator />
      <Command.Group heading="Repositories">
        <Command.Item>harness-core</Command.Item>
        <Command.Item>platform-ui</Command.Item>
      </Command.Group>
    </Command.List>
  )
}

export function Inline() {
  return (
    <div style={{ width: 420, padding: 16 }}>
      <Command.Root>
        <Command.Input placeholder="Search pipelines and repos..." />
        <List />
      </Command.Root>
    </div>
  )
}

export function Selected() {
  return (
    <div style={{ width: 420, padding: 16 }}>
      <Command.Root value="deploy-staging">
        <Command.Input placeholder="Search pipelines and repos..." />
        <List />
      </Command.Root>
    </div>
  )
}

export function NoResults() {
  return (
    <div style={{ width: 420, padding: 16 }}>
      <Command.Root>
        <Command.Input placeholder="Search..." value="zzzz" />
        <List />
      </Command.Root>
    </div>
  )
}
