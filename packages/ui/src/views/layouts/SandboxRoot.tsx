import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ManageNavigation, MoreSubmenu, Navbar, SettingsMenu } from '@/components'
import { navbarMenuData } from '@/data/navbar-menu-data'
import { pinnedMenuItemsData } from '@/data/pinned-menu-items-data'
import { MenuGroupType, MenuGroupTypes, NavbarItemType } from '@components/navbar/types'

import { SandboxLayout } from '../index'
import type { TypesUser } from './types'

interface SandboxRootProps {
  currentUser: TypesUser | undefined
  pinnedMenu: NavbarItemType[] | null
  recentMenu?: NavbarItemType[]
  logout?: () => void
  changePinnedMenu: (items: NavbarItemType[]) => void
  changeRecentMenu: (items: NavbarItemType[]) => void
}

export const SandboxRoot = ({
  currentUser,
  pinnedMenu,
  recentMenu,
  logout,
  changePinnedMenu,
  changeRecentMenu
}: SandboxRootProps) => {
  const location = useLocation()
  const [recentMenuItems, setRecentMenuItems] = useState<NavbarItemType[]>(recentMenu || [])
  const [pinnedMenuItems, setPinnedMenuItems] = useState<NavbarItemType[]>(pinnedMenu || pinnedMenuItemsData)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingMenu, setShowSettingMenu] = useState(false)
  const [showCustomNav, setShowCustomNav] = useState(false)

  /**
   * Update pinned manu
   */
  useEffect(() => {
    setPinnedMenuItems(pinnedMenu || pinnedMenuItemsData)
  }, [pinnedMenu])

  /**
   * Update recent menu
   */
  useEffect(() => {
    setRecentMenuItems(recentMenu || [])
  }, [recentMenu])

  /**
   * Map mock data menu by type to Settings and More
   */
  const { moreMenu, settingsMenu } = useMemo(() => {
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
  }, [])

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
  const handleSave = (recentItems: NavbarItemType[], currentPinnedItems: NavbarItemType[]) => {
    changeRecentMenu(recentItems)
    changePinnedMenu(currentPinnedItems)
    // TODO: Remove when `changeRecentMenu` and `changePinnedMenu` are passed to the component
    setRecentMenuItems(recentItems)
    setPinnedMenuItems(currentPinnedItems)
  }

  /**
   * Remove recent menu item
   */
  const handleRemoveRecentMenuItem = useCallback(
    (item: NavbarItemType) => {
      const data = recentMenuItems.filter(recentMenuItem => recentMenuItem.id !== item.id)
      changeRecentMenu(data)

      // TODO: Remove when `changeRecentMenu` and `changePinnedMenu` are passed to the component
      setRecentMenuItems(prevState => prevState.filter(prevStateItem => prevStateItem.id !== item.id))
    },
    [recentMenuItems, changeRecentMenu]
  )

  /**
   * Change pinned menu items
   */
  const handleChangePinnedMenuItem = useCallback(
    (item: NavbarItemType) => {
      const getPinnedItems = (data: NavbarItemType[]) => {
        const isPinned = data.some(pinned => pinned.id === item.id)

        if (isPinned) {
          return data.filter(pinned => pinned.id !== item.id)
        }

        // If pin item, remove it from recent
        handleRemoveRecentMenuItem(item)

        return [...data, item]
      }

      changePinnedMenu(getPinnedItems(pinnedMenuItems))

      // TODO: Remove when `changeRecentMenu` and `changePinnedMenu` are passed to the component
      setPinnedMenuItems(prevState => getPinnedItems(prevState))
    },
    [handleRemoveRecentMenuItem, pinnedMenuItems, changePinnedMenu]
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
          recentMenuItems={recentMenuItems}
          pinnedMenuItems={pinnedMenuItems}
          handleChangePinnedMenuItem={handleChangePinnedMenuItem}
          handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
        />
      </SandboxLayout.LeftPanel>
      <Outlet />
      <MoreSubmenu showMoreMenu={showMoreMenu} handleMoreMenu={handleMoreMenu} items={moreMenu} />
      <SettingsMenu showSettingMenu={showSettingMenu} handleSettingsMenu={handleSettingsMenu} items={settingsMenu} />
      <ManageNavigation
        pinnedItems={pinnedMenuItems}
        recentItems={recentMenuItems}
        navbarMenuData={navbarMenuData}
        showManageNavigation={showCustomNav}
        isSubmitting={false}
        submitted={false}
        onSave={handleSave}
        onClose={handleCustomNav}
      />
    </SandboxLayout.Root>
  )
}
