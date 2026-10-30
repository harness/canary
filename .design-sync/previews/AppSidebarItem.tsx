import * as React from 'react'
import { Sidebar, AppSidebarItem } from '@harnessio/ui'

const noop = () => {}
const wrap: React.CSSProperties = { width: 260, padding: 8 }

export function Default() {
  return (
    <div style={wrap}>
      <Sidebar.Provider><Sidebar.Root><Sidebar.Content><Sidebar.Group>
      <AppSidebarItem
        item={{ id: 'pipelines', title: 'Pipelines', iconName: 'pipeline', to: '/pipelines' } as any}
        handleChangePinnedMenuItem={noop}
        handleRemoveRecentMenuItem={noop}
        handleCustomNav={noop}
      />
      </Sidebar.Group></Sidebar.Content></Sidebar.Root></Sidebar.Provider>
    </div>
  )
}

export function Active() {
  return (
    <div style={wrap}>
      <Sidebar.Provider><Sidebar.Root><Sidebar.Content><Sidebar.Group>
      <AppSidebarItem
        active
        item={{ id: 'repositories', title: 'Repositories', iconName: 'repository', to: '/repos' } as any}
        handleChangePinnedMenuItem={noop}
        handleRemoveRecentMenuItem={noop}
        handleCustomNav={noop}
      />
      </Sidebar.Group></Sidebar.Content></Sidebar.Root></Sidebar.Provider>
    </div>
  )
}

export function Disabled() {
  return (
    <div style={wrap}>
      <Sidebar.Provider><Sidebar.Root><Sidebar.Content><Sidebar.Group>
      <AppSidebarItem
        disabled
        item={{ id: 'artifacts', title: 'Artifacts', iconName: 'package', to: '/artifacts' } as any}
        handleChangePinnedMenuItem={noop}
        handleRemoveRecentMenuItem={noop}
        handleCustomNav={noop}
      />
      </Sidebar.Group></Sidebar.Content></Sidebar.Root></Sidebar.Provider>
    </div>
  )
}
