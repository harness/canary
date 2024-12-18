import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { IThemeStore, ManageNavigation, MoreSubmenu, Navbar, SettingsMenu } from '@/components'
import { getNavbarMenuData } from '@/data/navbar-menu-data'
import { getPinnedMenuItemsData } from '@/data/pinned-menu-items-data'
import type { TypesUser } from '@/types'
import { MenuGroupType, MenuGroupTypes, NavbarItemType, NavState } from '@components/navbar/types'
import { useLocationChange } from '@hooks/use-location-change'

import { SandboxLayout, TranslationStore } from '../index'

interface NavLinkStorageInterface {
  state: {
    recent: NavbarItemType[]
    pinned: NavbarItemType[]
  }
}

export interface SandboxRootProps {
  currentUser: TypesUser | undefined
  logout?: () => void
  useNav: () => NavState
  useThemeStore: () => IThemeStore
  useTranslationStore: () => TranslationStore
}

export const SandboxRoot = ({ currentUser, useNav, logout, useThemeStore, useTranslationStore }: SandboxRootProps) => {
  const location = useLocation()
  const { pinnedMenu, recentMenu, setPinned, setRecent, setNavLinks } = useNav()
  const { t } = useTranslationStore()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingMenu, setShowSettingMenu] = useState(false)
  const [showCustomNav, setShowCustomNav] = useState(false)

  const pinnedMenuItemsData = useMemo(() => getPinnedMenuItemsData(t), [t])

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
    const navbarMenuData = getNavbarMenuData(t)
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
  }, [t])

  /**
   * Handle logout
   */
  const handleLogOut = useCallback(() => {
    logout?.()
  }, [logout])

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
      <div className="flex flex-col">
        <Outlet />
      </div>
      <MoreSubmenu showMoreMenu={showMoreMenu} handleMoreMenu={handleMoreMenu} items={moreMenu} />
      <SettingsMenu showSettingMenu={showSettingMenu} handleSettingsMenu={handleSettingsMenu} items={settingsMenu} />
      <ManageNavigation
        pinnedItems={pinnedMenu}
        recentItems={recentMenu}
        navbarMenuData={getNavbarMenuData(t)}
        showManageNavigation={showCustomNav}
        isSubmitting={false}
        submitted={false}
        onSave={handleSave}
        onClose={handleCustomNav}
      />
    </SandboxLayout.Root>
  )
}
