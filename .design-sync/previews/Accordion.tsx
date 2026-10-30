import * as React from 'react'
import { Accordion, Text } from '@harnessio/ui'

const wrap: React.CSSProperties = { width: 520, padding: 16 }

export function Single() {
  return (
    <div style={wrap}>
      <Accordion.Root type="single" defaultValue="build" collapsible>
        <Accordion.Item value="build">
          <Accordion.Trigger>Build stage</Accordion.Trigger>
          <Accordion.Content><Text>Compiles the service and runs unit tests on every push to main.</Text></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="deploy">
          <Accordion.Trigger>Deploy stage</Accordion.Trigger>
          <Accordion.Content><Text>Rolls out to staging, then production after approval.</Text></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="verify">
          <Accordion.Trigger>Verify stage</Accordion.Trigger>
          <Accordion.Content><Text>Runs smoke tests against the new release.</Text></Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

export function Multiple() {
  return (
    <div style={wrap}>
      <Accordion.Root type="multiple" defaultValue={['env', 'secrets']} size="sm" indicatorPosition="left">
        <Accordion.Item value="env">
          <Accordion.Trigger>Environment variables</Accordion.Trigger>
          <Accordion.Content><Text>NODE_ENV, REGION and 4 more are set for this pipeline.</Text></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="secrets">
          <Accordion.Trigger>Secrets</Accordion.Trigger>
          <Accordion.Content><Text>3 secrets referenced from the org secret manager.</Text></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="triggers">
          <Accordion.Trigger>Triggers</Accordion.Trigger>
          <Accordion.Content><Text>Webhook and nightly schedule.</Text></Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

export function Card() {
  return (
    <div style={wrap}>
      <Accordion.Root type="single" variant="card" defaultValue="a" collapsible>
        <Accordion.Item value="a">
          <Accordion.Trigger>Rollback policy</Accordion.Trigger>
          <Accordion.Content><Text>Automatically roll back when error rate exceeds 2% for 5 minutes.</Text></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>Approval gates</Accordion.Trigger>
          <Accordion.Content><Text>Two approvers required for production.</Text></Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}
