import { Children, type FC, type ReactNode } from 'react'

import { Layout, useSidebar } from '@harnessio/ui/components'

import { AppShellContent } from './app-content'
import { AppNav } from './app-nav'
import { AppShellHeader } from './app-shell-header'

const appShellMainClass = 'app-shell-main'
const appShellRootClass = 'app-shell'
const appShellBodyClass = 'app-shell-body'

const AppShellLayout: FC<{ header?: ReactNode; children: ReactNode }> = ({ header, children }) => {
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === 'collapsed'

  const bodyGridColumns = isSidebarCollapsed
    ? 'var(--cn-sidebar-container-min-width) 1fr'
    : 'var(--cn-sidebar-container-full-width) 1fr'

  const childList = Children.toArray(children)
  const [navColumn, contentColumn] = childList

  return (
    <div className={`${appShellRootClass} bg-cn-0 flex h-screen min-h-0 w-full flex-col`}>
      {header}
      <Layout.Grid
        columns={bodyGridColumns}
        className={`${appShellBodyClass} min-h-0 w-full flex-1 transition-all duration-200 ease-in-out`}
      >
        {navColumn}
        <div className={`${appShellMainClass} flex h-full min-h-0 min-w-0 flex-col`}>{contentColumn}</div>
      </Layout.Grid>
    </div>
  )
}

export const AppShell = Object.assign(AppShellLayout, {
  Layout: AppShellLayout,
  Nav: AppNav,
  Content: AppShellContent,
  Header: AppShellHeader
})
