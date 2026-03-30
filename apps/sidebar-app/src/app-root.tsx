import { useEffect, useState, type FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Sidebar, TooltipProvider } from '@harnessio/ui/components'
import { defaultTheme, DialogProvider, ThemeProvider, TranslationProvider, type FullTheme } from '@harnessio/ui/context'

import { SidebarDemo } from './sidebar-demo'

const LIGHT_THEME = 'light-std-std' as FullTheme

export const AppRoot: FC = () => {
  const [theme, setTheme] = useState<FullTheme>(defaultTheme)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  return (
    <ThemeProvider theme={theme} setTheme={setTheme} isLightTheme={theme === LIGHT_THEME}>
      <TranslationProvider>
        <TooltipProvider>
          <DialogProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="*"
                  element={
                    <Sidebar.Provider>
                      <SidebarDemo />
                    </Sidebar.Provider>
                  }
                />
              </Routes>
            </BrowserRouter>
          </DialogProvider>
        </TooltipProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export type {
  AppNavFixedItem,
  AppNavFixedItemMore,
  AppNavFixedItemRow,
  AppNavFixedItemRowWithSortable,
  AppNavMoreItemGroup,
  AppNavProps,
  AppNavRecentSection
} from './types/app-nav-types'
export { DEFAULT_MORE_DRAWER_PREVIEW_COUNT } from './types/app-nav-types'

export { defaultAppNavFixedHome, defaultAppNavFixedMore, defaultAppNavProps } from './default-app-nav-config'
export { getSidebarItemForPathname } from './nav-path-to-item'
export {
  useRecentNavItems,
  type RecentNavStorageEntry,
  type UseRecentNavItemsOptions,
  type UseRecentNavItemsResult
} from './use-recent-nav-items'
export {
  buildsNav,
  demoItems,
  infrastructureNav,
  pinnedHomeItem,
  recentSectionLabel,
  workspaceSwitcher
} from './data/app-nav-demo-data'

export { AppNav } from './app-nav'
export { AppShell } from './app-shell'
export { App } from './App'
export { SidebarDemo } from './sidebar-demo'
