import * as React from 'react'
import { DraggableSidebarDivider, Text } from '@harnessio/ui'

function Shell({ initialWidth }: { initialWidth: number }) {
  const [width, setWidth] = React.useState(initialWidth)
  return (
    <div style={{ display: 'flex', height: 260, width: 640, border: '1px solid var(--cn-border-3, #ddd)' }}>
      <div style={{ width, padding: 16, flex: 'none' }}>
        <Text className="block">Pipelines</Text>
        <Text className="block">Executions</Text>
        <Text className="block">Secrets</Text>
      </div>
      <DraggableSidebarDivider width={width} setWidth={setWidth} minWidth={160} maxWidth={360} />
      <div style={{ padding: 16, flex: 1 }}>
        <Text className="block">Main content: {width}px sidebar</Text>
      </div>
    </div>
  )
}

export function Default() {
  return <div style={{ padding: 16 }}><Shell initialWidth={220} /></div>
}

export function Wide() {
  return <div style={{ padding: 16 }}><Shell initialWidth={320} /></div>
}
