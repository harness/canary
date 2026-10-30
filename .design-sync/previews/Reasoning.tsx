import * as React from 'react'
import { Reasoning } from '@harnessio/ui'

export function Open() {
  return (
    <div style={{ width: 480, padding: 16 }}>
      <Reasoning.Root defaultOpen duration={6}>
        <Reasoning.Trigger />
        <Reasoning.Content>Checked the last three executions. The deploy-staging stage times out while connecting to the cluster, so credentials are the likely cause.</Reasoning.Content>
      </Reasoning.Root>
    </div>
  )
}
export function Streaming() {
  return (
    <div style={{ width: 480, padding: 16 }}>
      <Reasoning.Root isStreaming defaultOpen>
        <Reasoning.Trigger />
        <Reasoning.Content>Reading pipeline logs...</Reasoning.Content>
      </Reasoning.Root>
    </div>
  )
}
export function Collapsed() {
  return (
    <div style={{ width: 480, padding: 16 }}>
      <Reasoning.Root open={false} duration={12}>
        <Reasoning.Trigger />
        <Reasoning.Content>Hidden until expanded.</Reasoning.Content>
      </Reasoning.Root>
    </div>
  )
}
