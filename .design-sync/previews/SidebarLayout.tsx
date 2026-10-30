import * as React from 'react'
import { Sidebar, SidebarLayout, Text } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ height: 360, width: 640 }}>
      <Sidebar.Provider>
        <SidebarLayout
          sidebar={<div style={{ padding: 16 }}><Text>Navigation</Text></div>}
          chat={<div style={{ padding: 16 }}><Text>Assistant: the build failed on the lint step.</Text></div>}
          mainContent={<div style={{ padding: 16 }}><Text>Pipeline executions</Text></div>}
        />
      </Sidebar.Provider>
    </div>
  )
}
