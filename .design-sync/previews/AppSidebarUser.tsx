import * as React from 'react'
import { Sidebar, AppSidebarUser } from '@harnessio/ui'

const noop = () => {}

export function Default() {
  return (
    <div style={{ width: 260, padding: 8 }}>
      <Sidebar.Provider><Sidebar.Root><Sidebar.Content><Sidebar.Group>
      <AppSidebarUser
        user={{ display_name: 'Priya Raman', email: 'priya.raman@acme.dev', uid: 'priya' } as any}
        openThemeDialog={noop}
        openLanguageDialog={noop}
        handleLogOut={noop}
      />
      </Sidebar.Group></Sidebar.Content></Sidebar.Root></Sidebar.Provider>
    </div>
  )
}

export function UidOnly() {
  return (
    <div style={{ width: 260, padding: 8 }}>
      <Sidebar.Provider><Sidebar.Root><Sidebar.Content><Sidebar.Group>
      <AppSidebarUser
        user={{ uid: 'build-bot', email: 'build-bot@acme.dev' } as any}
        openThemeDialog={noop}
        openLanguageDialog={noop}
        handleLogOut={noop}
      />
      </Sidebar.Group></Sidebar.Content></Sidebar.Root></Sidebar.Provider>
    </div>
  )
}
