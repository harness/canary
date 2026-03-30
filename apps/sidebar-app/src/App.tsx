import '@harnessio/ui/styles.css'
import './App.css'

import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

import { Layout, Sidebar, TooltipProvider, useSidebar, type SidebarItemProps } from '@harnessio/ui/components'
import {
  defaultTheme,
  DialogProvider,
  RouterContextProvider,
  ThemeProvider,
  TranslationProvider,
  type FullTheme
} from '@harnessio/ui/context'

import { recentSectionLabel } from './data/app-nav-demo-data'
import { AppContent } from './app-content'
import { AppNav } from './app-nav'
import type { AppNavFixedItem, AppNavProps } from './types/app-nav-types'
import {
  defaultAppNavFixedHome,
  defaultAppNavFixedMore,
  defaultAppNavProps
} from './default-app-nav-config'
import { getSidebarItemForPathname } from './nav-path-to-item'
import { useRecentNavItems } from './use-recent-nav-items'

const LIGHT_THEME = 'light-std-std' as FullTheme

const appShellMainClass = 'app-shell-main'
const appShellRootClass = 'app-shell'
const appShellBodyClass = 'app-shell-body'

const recentNavMaxItems = 5
const recentNavStorageKey = 'sidebar-app-recent-nav-v1'
const recentPinAriaLabel = 'Pin'
const pinnedUnpinAriaLabel = 'Unpin'

const defaultFixedNavPath =
  defaultAppNavFixedHome.type === 'item' &&
  'to' in defaultAppNavFixedHome.item &&
  typeof defaultAppNavFixedHome.item.to === 'string'
    ? defaultAppNavFixedHome.item.to
    : null

function sidebarItemWithoutRowActions(item: SidebarItemProps): SidebarItemProps {
  const { actionButtons: _actionButtons, active: _active, ...rest } = item as SidebarItemProps & {
    actionButtons?: unknown
    active?: boolean
  }
  return rest as SidebarItemProps
}

/** Wires router → recents (cap + optional persistence) on the app side, then renders `AppShell`. */
const SidebarAppShell: FC = () => {
  const location = useLocation()
  const [pinnedFromRecents, setPinnedFromRecents] = useState<SidebarItemProps[]>([])

  const pinnedPaths = useMemo(
    () =>
      pinnedFromRecents
        .map(p => ('to' in p && typeof p.to === 'string' ? p.to : '') as string)
        .filter(Boolean),
    [pinnedFromRecents]
  )

  const { recentItems, removeRecentByTo, prependRecentItem } = useRecentNavItems({
    maxItems: recentNavMaxItems,
    storageKey: recentNavStorageKey,
    getItemForPath: getSidebarItemForPathname,
    excludeFromRecents: pinnedPaths
  })

  const handlePinFromRecents = useCallback(
    (item: SidebarItemProps) => {
      if (!('to' in item) || typeof item.to !== 'string') return
      const to = item.to
      const clean = sidebarItemWithoutRowActions(item)
      setPinnedFromRecents(prev => {
        if (prev.some(p => 'to' in p && p.to === to)) return prev
        return [...prev, clean]
      })
      removeRecentByTo(to)
    },
    [removeRecentByTo]
  )

  const handleReorderPinned = useCallback((orderedIds: string[]) => {
    setPinnedFromRecents(prev => {
      const byTo = new Map(
        prev.map(p => {
          const to = 'to' in p && typeof p.to === 'string' ? p.to : ''
          return [to, p] as const
        }).filter((e): e is readonly [string, SidebarItemProps] => e[0] !== '')
      )
      return orderedIds.map(id => byTo.get(id)).filter((p): p is SidebarItemProps => p != null)
    })
  }, [])

  const handleUnpinToRecents = useCallback(
    (item: SidebarItemProps) => {
      if (!('to' in item) || typeof item.to !== 'string') return
      const to = item.to
      setPinnedFromRecents(prev => prev.filter(p => !('to' in p) || p.to !== to))
      prependRecentItem(sidebarItemWithoutRowActions(item))
    },
    [prependRecentItem]
  )

  const fixedItems = useMemo<AppNavFixedItem[]>(() => {
    const pinRows: AppNavFixedItem[] = pinnedFromRecents.map(p => {
      const base = sidebarItemWithoutRowActions(p)
      const to = 'to' in base && typeof base.to === 'string' ? base.to : null
      return {
        type: 'item' as const,
        item: {
          ...base,
          active: 'to' in base && base.to === location.pathname,
          actionButtons: to
            ? [
                {
                  iconName: 'pin-slash' as const,
                  iconOnly: true,
                  onClick: () => {
                    handleUnpinToRecents(p)
                  },
                  'aria-label': pinnedUnpinAriaLabel
                }
              ]
            : undefined
        },
        ...(to ? { sortableId: to } : {})
      }
    })
    return [defaultAppNavFixedHome, ...pinRows, defaultAppNavFixedMore]
  }, [handleUnpinToRecents, pinnedFromRecents, location.pathname])

  const nav: AppNavProps = useMemo(
    () => ({
      ...defaultAppNavProps,
      fixedItems,
      onReorderSortableFixedItems: handleReorderPinned,
      showFixedItemDragGrip: row => Boolean(row.sortableId),
      recentSection:
        recentItems.length > 0
          ? {
              label: recentSectionLabel,
              items: recentItems.map(item => {
                const row: SidebarItemProps = {
                  ...item,
                  active: 'to' in item && item.to === location.pathname
                }
                const isAlreadyDefaultFixed =
                  defaultFixedNavPath != null &&
                  'to' in item &&
                  item.to === defaultFixedNavPath
                if (isAlreadyDefaultFixed) {
                  return row
                }
                return {
                  ...row,
                  actionButtons: [
                    {
                      iconName: 'pin' as const,
                      iconOnly: true,
                      onClick: () => {
                        handlePinFromRecents(item)
                      },
                      'aria-label': recentPinAriaLabel
                    }
                  ]
                }
              })
            }
          : undefined
    }),
    [fixedItems, handlePinFromRecents, handleReorderPinned, recentItems, location.pathname]
  )

  return <AppShell nav={nav} />
}

const AppShell: FC<{ nav?: AppNavProps }> = ({ nav = defaultAppNavProps }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === 'collapsed'

  const shellBodyColumns = isSidebarCollapsed
    ? 'var(--cn-sidebar-container-min-width) 1fr'
    : 'var(--cn-sidebar-container-full-width) 1fr'

  return (
    <RouterContextProvider
      Link={Link}
      NavLink={NavLink}
      Outlet={Outlet}
      location={location}
      navigate={navigate}
      useSearchParams={useSearchParams}
      useMatches={useMatches}
      useParams={useParams}
    >
      <div className={`${appShellRootClass} bg-cn-0 flex h-screen min-h-0 w-full flex-col`}>
        <Layout.Grid
          columns={shellBodyColumns}
          className={`${appShellBodyClass} min-h-0 w-full flex-1 transition-all duration-200 ease-in-out`}
        >
          <AppNav {...nav} />
          <div className={`${appShellMainClass} flex h-full min-h-0 min-w-0 flex-col`}>
            <AppContent />
          </div>
        </Layout.Grid>
      </div>
    </RouterContextProvider>
  )
}

type AppNamespace = FC & {
  Shell: FC<{ nav?: AppNavProps }>
  Nav: FC<AppNavProps>
  Content: FC
}

const AppRoot: FC = () => {
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
                      <SidebarAppShell />
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

const App = Object.assign(AppRoot, {
  Shell: AppShell,
  Nav: AppNav,
  Content: AppContent
}) as AppNamespace

export default App

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

export {
  defaultAppNavFixedHome,
  defaultAppNavFixedMore,
  defaultAppNavProps
} from './default-app-nav-config'
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
export { AppContent } from './app-content'
