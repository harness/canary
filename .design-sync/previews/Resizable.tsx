import * as React from 'react'
import { Resizable, Text } from '@harnessio/ui'

const pane = { padding: 16, height: '100%' } as const

export function Horizontal() {
  return (
    <div style={{ width: 640, height: 220, border: '1px solid var(--cn-border-3)', borderRadius: 6 }}>
      <Resizable.PanelGroup direction="horizontal">
        <Resizable.Panel defaultSize={35} minSize={20}>
          <div style={pane}><Text>Files changed (14)</Text></div>
        </Resizable.Panel>
        <Resizable.Handle withHandle />
        <Resizable.Panel defaultSize={65}>
          <div style={pane}><Text>src/pipeline/executor.ts</Text></div>
        </Resizable.Panel>
      </Resizable.PanelGroup>
    </div>
  )
}

export function Vertical() {
  return (
    <div style={{ width: 640, height: 280, border: '1px solid var(--cn-border-3)', borderRadius: 6 }}>
      <Resizable.PanelGroup direction="vertical">
        <Resizable.Panel defaultSize={60}>
          <div style={pane}><Text>Pipeline graph: build, test, deploy</Text></div>
        </Resizable.Panel>
        <Resizable.Handle withHandle />
        <Resizable.Panel defaultSize={40}>
          <div style={pane}><Text>Logs: step 3 of 5, running unit tests</Text></div>
        </Resizable.Panel>
      </Resizable.PanelGroup>
    </div>
  )
}
