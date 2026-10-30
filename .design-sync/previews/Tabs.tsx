import * as React from 'react'
import { Tabs, Text } from '@harnessio/ui'

export function Underlined() {
  return (
    <div className="w-[520px] p-4">
      <Tabs.Root defaultValue="executions">
        <Tabs.List variant="underlined">
          <Tabs.Trigger value="executions">Executions</Tabs.Trigger>
          <Tabs.Trigger value="inputs">Inputs</Tabs.Trigger>
          <Tabs.Trigger value="triggers">Triggers</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="executions">
          <Text className="block pt-4">Last 20 executions for this pipeline.</Text>
        </Tabs.Content>
        <Tabs.Content value="inputs">
          <Text className="block pt-4">Runtime inputs.</Text>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export function Ghost() {
  return (
    <div className="w-[520px] p-4">
      <Tabs.Root defaultValue="overview">
        <Tabs.List variant="ghost">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="commits">Commits</Tabs.Trigger>
          <Tabs.Trigger value="files">Files</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">
          <Text className="block pt-4">Pull request summary and activity.</Text>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export function WithCounters() {
  return (
    <div className="w-[520px] p-4">
      <Tabs.Root defaultValue="open">
        <Tabs.List variant="outlined">
          <Tabs.Trigger value="open" counter={12}>Open</Tabs.Trigger>
          <Tabs.Trigger value="merged" counter={48}>Merged</Tabs.Trigger>
          <Tabs.Trigger value="closed" counter={3}>Closed</Tabs.Trigger>
          <Tabs.Trigger value="drafts" disabled>Drafts</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="open">
          <Text className="block pt-4">12 open pull requests.</Text>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
