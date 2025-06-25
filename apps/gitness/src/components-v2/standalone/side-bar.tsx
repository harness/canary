import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  ManageNavigation,
  MenuGroupType,
  MenuGroupTypes,
  MoreSubmenu,
  NavbarItemType,
  SettingsMenu,
  Sidebar
} from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { SidebarView } from '@harnessio/ui/views'

import { useNav } from '../../components/stores/recent-pinned-nav-links.store'
import { getNavbarMenuData } from '../../data/navbar-menu-data'
import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useSelectedSpaceId } from '../../framework/hooks/useSelectedSpaceId'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'

const AppSideBar: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  const { changeLanguage, i18n } = useTranslationStore()
  const { currentUser } = useAppContext()
  const { spaceId, repoId } = useParams<PathParams>()
  const selectedSpaceId = useSelectedSpaceId(spaceId)
  const spaceIdPathParam = spaceId ?? selectedSpaceId ?? ''
  const routes = useRoutes()
  const navigate = useNavigate()
  const location = useLocation()
  const { pinnedMenu, recentMenu, setPinned, setRecent, setNavLinks } = useNav()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingMenu, setShowSettingMenu] = useState(false)
  const [showCustomNav, setShowCustomNav] = useState(false)

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

  return (
    <>
      <SidebarView
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
        changeLanguage={changeLanguage}
        lang={i18n.language}
      />

      <Sidebar.Inset>
        {children}
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
      </Sidebar.Inset>
    </>
  )
}

export { AppSideBar }
