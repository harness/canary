import { useEffect, useState, type FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Sidebar, TooltipProvider } from '@harnessio/ui/components'
import { defaultTheme, DialogProvider, ThemeProvider, TranslationProvider, type FullTheme } from '@harnessio/ui/context'

import { AppRouterProvider } from './app-router-provider'
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
              <AppRouterProvider>
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
              </AppRouterProvider>
            </BrowserRouter>
          </DialogProvider>
        </TooltipProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export type {
  AppNavContentProps,
  AppNavFixedItem,
  AppNavFixedItemMore,
  AppNavFixedItemRow,
  AppNavFixedItemRowWithSortable,
  AppNavMoreItemGroup,
  AppNavProps,
  AppNavRecentSection
} from '../types/app-nav-types'
export { DEFAULT_MORE_DRAWER_PREVIEW_COUNT } from '../types/app-nav-types'

export type { DefaultAppNavPropsBase } from '../default-app-nav-config'
export { defaultAppNavFixedHome, defaultAppNavFixedMore, defaultAppNavProps } from '../default-app-nav-config'
export { useDemoAppNavFooterItem } from './use-demo-app-nav-footer-item'
export { getSidebarItemForPathname } from '../nav-path-to-item'
export {
  useRecentNavItems,
  type RecentNavStorageEntry,
  type UseRecentNavItemsOptions,
  type UseRecentNavItemsResult
} from '../use-recent-nav-items'
export {
  buildsNav,
  demoAppNavHeaderItem,
  demoItems,
  infrastructureNav,
  pinnedHomeItem,
  recentSectionLabel
} from '../data/app-nav-demo-data'

export { AppNav } from './app-nav'
export { AppShell } from './app-shell'
export type { AppProps } from '../types/app-shell-types'
export { App, SidebarDemo } from './sidebar-demo'
