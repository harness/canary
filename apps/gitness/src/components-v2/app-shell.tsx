import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { cn } from '@harnessio/canary'
import {
  ManageNavigation,
  MenuGroupType,
  MenuGroupTypes,
  MoreSubmenu,
  Navbar,
  NavbarItemType,
  SettingsMenu
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

import { useNav } from '../components/stores/recent-pinned-nav-links.store'
import { getNavbarMenuData } from '../data/navbar-menu-data'
import { getPinnedMenuItemsData } from '../data/pinned-menu-items-data'
import { useAppContext } from '../framework/context/AppContext'
import { useRoutes } from '../framework/context/NavigationContext'
import { useThemeStore } from '../framework/context/ThemeContext'
import { useLocationChange } from '../framework/hooks/useLocationChange'
import { useRepoImportEvents } from '../framework/hooks/useRepoImportEvent'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { PathParams } from '../RouteDefinitions'
import Breadcrumbs from './breadcrumbs/breadcrumbs'
import { Toaster } from './toaster'

interface NavLinkStorageInterface {
  state: {
    recent: NavbarItemType[]
    pinned: NavbarItemType[]
  }
}

export const AppShell = () => {
  const routes = useRoutes()
  const { currentUser, spaces } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const { pinnedMenu, recentMenu, setPinned, setRecent, setNavLinks } = useNav()
  const { t } = useTranslationStore()
  const { spaceId, repoId } = useParams<PathParams>()
  const spaceIdPathParam = spaceId ?? spaces[0]?.path ?? ''

  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingMenu, setShowSettingMenu] = useState(false)
  const [showCustomNav, setShowCustomNav] = useState(false)

  const pinnedMenuItemsData = useMemo(
    () => getPinnedMenuItemsData({ t, routes, spaceId: spaceIdPathParam }),
    [t, routes, spaceIdPathParam]
  )

  useLocationChange({ t, onRouteChange: setRecent })

  useEffect(() => {
    const linksFromStorage = localStorage.getItem('nav-items')
    let parsedLinksFromStorage: NavLinkStorageInterface | undefined

    if (linksFromStorage) {
      parsedLinksFromStorage = JSON.parse(linksFromStorage)
    }

    /**
     * Logic for setting initial pinned links
     *
     * setting initial pinned link only if no pinned links are stored in local storage.
     * Pinned links cannot be empty as we will have some links permanantly.
     */
    if (parsedLinksFromStorage && !parsedLinksFromStorage?.state?.pinned?.length) {
      const pinnedItems = pinnedMenu.filter(
        item => !pinnedMenuItemsData.some(staticPinned => staticPinned.id === item.id)
      )
      setNavLinks({ pinnedMenu: [...pinnedMenuItemsData, ...pinnedItems] })
    }
  }, [])

  /**
   * Map mock data menu by type to Settings and More
   */
  const { moreMenu, settingsMenu } = useMemo(() => {
    const navbarMenuData = getNavbarMenuData({
      t,
      routes,
      spaceId: spaceIdPathParam,
      repoId
    })
    return navbarMenuData.reduce<{
      moreMenu: MenuGroupType[]
      settingsMenu: MenuGroupType[]
    }>(
      (acc, item) => {
        if (item.type === MenuGroupTypes.SETTINGS) {
          acc.settingsMenu.push(item)
        } else {
          acc.moreMenu.push(item)
        }

        return acc
      },
      {
        moreMenu: [],
        settingsMenu: []
      }
    )
  }, [t, routes, spaceIdPathParam, repoId])

  /**
   * Handle logout
   */
  const handleLogOut = () => navigate(routes.toLogout())

  /**
   * Toggle show more menu
   */
  const handleMoreMenu = useCallback(() => {
    setShowSettingMenu(false)
    setShowMoreMenu(prevState => !prevState)
  }, [])

  /**
   * Toggle system settings menu
   */
  const handleSettingsMenu = useCallback(() => {
    setShowMoreMenu(false)
    setShowSettingMenu(prevState => !prevState)
  }, [])

  /**
   * Toggle custom navigation modal
   */
  const handleCustomNav = useCallback(() => {
    setShowCustomNav(prevState => !prevState)
  }, [])

  /**
   * Close all menu when location changed
   */
  useEffect(() => {
    setShowMoreMenu(false)
    setShowSettingMenu(false)
    setShowCustomNav(false)
  }, [location])

  /**
   * Handle save recent and pinned items
   */
  const handleSave = (nextRecentItems: NavbarItemType[], nextPinnedItems: NavbarItemType[]) => {
    setNavLinks({
      pinnedMenu: nextPinnedItems,
      recentMenu: nextRecentItems
    })
  }

  /**
   * Remove recent menu item
   */
  const handleRemoveRecentMenuItem = useCallback(
    (item: NavbarItemType) => {
      setRecent(item, true)
    },
    [setRecent]
  )

  /**
   * Change pinned menu items
   */
  const handleChangePinnedMenuItem = useCallback(
    (item: NavbarItemType, pin: boolean) => {
      setPinned(item, pin)
    },
    [setPinned]
  )
  useRepoImportEvents()

  return (
    <SandboxLayout.Root>
      <SandboxLayout.LeftPanel>
        <Navbar
          showMoreMenu={showMoreMenu}
          showSettingMenu={showSettingMenu}
          handleMoreMenu={handleMoreMenu}
          handleSettingsMenu={handleSettingsMenu}
          currentUser={currentUser}
          handleCustomNav={handleCustomNav}
          handleLogOut={handleLogOut}
          recentMenuItems={recentMenu}
          pinnedMenuItems={pinnedMenu}
          handleChangePinnedMenuItem={handleChangePinnedMenuItem}
          handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
          useThemeStore={useThemeStore}
          useTranslationStore={useTranslationStore}
        />
      </SandboxLayout.LeftPanel>

      <BreadcrumbsAndOutlet />

      <MoreSubmenu showMoreMenu={showMoreMenu} handleMoreMenu={handleMoreMenu} items={moreMenu} />
      <SettingsMenu showSettingMenu={showSettingMenu} handleSettingsMenu={handleSettingsMenu} items={settingsMenu} />
      <ManageNavigation
        pinnedItems={pinnedMenu}
        recentItems={recentMenu}
        navbarMenuData={getNavbarMenuData({ t, routes, spaceId: spaceIdPathParam, repoId })}
        showManageNavigation={showCustomNav}
        isSubmitting={false}
        submitted={false}
        onSave={handleSave}
        onClose={handleCustomNav}
      />
      <Toaster />
    </SandboxLayout.Root>
  )
}

export const AppShellMFE = () => {
  return <BreadcrumbsAndOutlet className="min-h-screen text-foreground-2" />
}

function BreadcrumbsAndOutlet({ className }: { className?: string }) {
  useRepoImportEvents()

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="layer-high sticky top-0 bg-background-1">
        <Breadcrumbs />
      </div>
      <Outlet />
      <Toaster />
    </div>
  )
}
