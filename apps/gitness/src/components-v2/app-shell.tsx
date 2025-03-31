import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  AppSidebar,
  ManageNavigation,
  MenuGroupType,
  MenuGroupTypes,
  MoreSubmenu,
  NavbarItemType,
  SettingsMenu,
  Sidebar
} from '@harnessio/ui/components'
import { MainContentLayout } from '@harnessio/ui/views'

import { useNav } from '../components/stores/recent-pinned-nav-links.store'
import { getNavbarMenuData } from '../data/navbar-menu-data'
import { getPinnedMenuItemsData } from '../data/pinned-menu-items-data'
import { useAppContext } from '../framework/context/AppContext'
import { useRoutes } from '../framework/context/NavigationContext'
import { useLocationChange } from '../framework/hooks/useLocationChange'
import { useRepoImportEvents } from '../framework/hooks/useRepoImportEvent'
import { useSelectedSpaceId } from '../framework/hooks/useSelectedSpaceId'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { PathParams } from '../RouteDefinitions'
import Breadcrumbs from './breadcrumbs/breadcrumbs'
import BreadcrumbsMFE from './breadcrumbs/breadcrumbs-mfe'
import { Toaster } from './toaster'

interface NavLinkStorageInterface {
  state: {
    recent: NavbarItemType[]
    pinned: NavbarItemType[]
  }
}

export const AppShell = () => {
  const routes = useRoutes()
  const { currentUser } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const { pinnedMenu, recentMenu, setPinned, setRecent, setNavLinks } = useNav()
  const { t } = useTranslationStore()
  const { spaceId, repoId } = useParams<PathParams>()
  const selectedSpaceId = useSelectedSpaceId(spaceId)
  const spaceIdPathParam = spaceId ?? selectedSpaceId ?? ''

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
  }, [spaceIdPathParam])

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
  const handleMoreMenu = useCallback((state?: boolean) => {
    setShowSettingMenu(false)
    setShowMoreMenu(prevState => state ?? !prevState)
  }, [])

  /**
   * Toggle system settings menu
   */
  const handleSettingsMenu = useCallback((state?: boolean) => {
    setShowMoreMenu(false)
    setShowSettingMenu(prevState => state ?? !prevState)
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
    <>
      <Sidebar.Provider>
        <AppSidebar
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
          useTranslationStore={useTranslationStore}
        />

        <Sidebar.Inset>
          <MainContentLayout breadcrumbs={<Breadcrumbs />}>
            <Outlet />
          </MainContentLayout>

          <MoreSubmenu showMoreMenu={showMoreMenu} handleMoreMenu={handleMoreMenu} items={moreMenu} />
          <SettingsMenu
            showSettingMenu={showSettingMenu}
            handleSettingsMenu={handleSettingsMenu}
            items={settingsMenu}
          />
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
        </Sidebar.Inset>
      </Sidebar.Provider>
      <Toaster />
    </>
  )
}

export const AppShellMFE = memo(() => {
  useRepoImportEvents()

  return (
    <>
      <MainContentLayout breadcrumbs={<BreadcrumbsMFE />} className="text-foreground-2 min-h-screen">
        <Outlet />
      </MainContentLayout>
      <Toaster />
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
