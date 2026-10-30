import * as React from 'react'
import { ScrollArea, Text } from '@harnessio/ui'

const lines = Array.from({ length: 30 }, (_, i) => `[12:04:${String(i).padStart(2, '0')}] step build-image: layer ${i + 1}/30 cached`)

export function Vertical() {
  return (
    <div style={{ width: 480, padding: 16 }}>
      <ScrollArea className="h-[200px] border border-cn-3 rounded-3">
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {lines.map(l => <Text key={l} variant="body-normal">{l}</Text>)}
        </div>
      </ScrollArea>
    </div>
  )
}

export function Horizontal() {
  return (
    <div style={{ width: 480, padding: 16 }}>
      <ScrollArea className="border border-cn-3 rounded-3">
        <div style={{ padding: 12, width: 1200 }}>
          <Text>feat: add canary rollout strategy with automated rollback on failed health checks across regions us-east-1, eu-west-1, ap-south-1</Text>
        </div>
      </ScrollArea>
    </div>
  )
}
