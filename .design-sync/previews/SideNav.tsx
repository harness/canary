import * as React from 'react'
import { Sidebar, SideNav } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ height: 520, display: 'flex' }}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <SideNav />
        </Sidebar.Root>
      </Sidebar.Provider>
    </div>
  )
}
