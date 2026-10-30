import * as React from 'react'
import { StickyListSection, Text } from '@harnessio/ui'

const item = { padding: '8px 12px' }

export function Grouped() {
  return (
    <div style={{ padding: 16, width: 420, height: 320, overflow: 'auto' }}>
      <StickyListSection.Root>
        <StickyListSection.Header>Today</StickyListSection.Header>
        <StickyListSection.Content>
          <div style={item}><Text>Deployed payments-service v2.14.0</Text></div>
          <div style={item}><Text>Merged PR #4821: Add retry policy</Text></div>
        </StickyListSection.Content>
      </StickyListSection.Root>
      <StickyListSection.Root>
        <StickyListSection.Header>Yesterday</StickyListSection.Header>
        <StickyListSection.Content>
          <div style={item}><Text>Pipeline nightly-etl failed</Text></div>
          <div style={item}><Text>Rotated access token for build-agent</Text></div>
          <div style={item}><Text>Opened PR #4815: Bump base image</Text></div>
        </StickyListSection.Content>
      </StickyListSection.Root>
    </div>
  )
}

export function Contained() {
  return (
    <div style={{ padding: 16, width: 420 }}>
      <StickyListSection.Root contained>
        <StickyListSection.Header>Environments</StickyListSection.Header>
        <StickyListSection.Content>
          <div style={item}><Text>production</Text></div>
          <div style={item}><Text>staging</Text></div>
          <div style={item}><Text>qa</Text></div>
        </StickyListSection.Content>
      </StickyListSection.Root>
    </div>
  )
}
