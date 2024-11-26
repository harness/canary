import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ManageNavigation, MoreSubmenu, Navbar, SettingsMenu } from '@/components'
import { getNavbarMenuData } from '@/data/navbar-menu-data'
import { getPinnedMenuItemsData } from '@/data/pinned-menu-items-data'
import type { TypesUser } from '@/types'
import { MenuGroupType, MenuGroupTypes, NavbarItemIdType, NavbarItemType } from '@components/navbar/types'

import { SandboxLayout } from '../index'

/**
 * Returns the complete menu model based on an array of IDs,
 * using the navbarMenuData variable as a reference.
 * @param data
 */
const getArrayOfNavItems = (data: NavbarItemIdType[]) => {
  if (!data.length) return []

  const navbarMenuData = getNavbarMenuData()

  return navbarMenuData.reduce<NavbarItemType[]>((acc, { items }) => {
    const currentIndex = items.findIndex(item => data.includes(item.id))

    if (currentIndex > -1) {
      acc.push(items[currentIndex])
    }

    return acc
  }, [])
}

interface SandboxRootProps {
  currentUser: TypesUser | undefined
  // If the user hasn't interacted with the pinned menu items yet,
  // return null — this will ensure the default pinned items are applied.
  //
  // However, if the user has manually selected or removed all pinned items
  // (i.e., taken any action with the pinned menu),
  // then you should return an array of IDs or an empty array.
  pinnedMenu: NavbarItemIdType[] | null
  recentMenu: NavbarItemIdType[]
  logout?: () => void
  changePinnedMenu: (items: NavbarItemIdType[]) => void
  changeRecentMenu: (items: NavbarItemIdType[]) => void
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
  const [recentMenuItems, setRecentMenuItems] = useState<NavbarItemType[]>([])
  const [pinnedMenuItems, setPinnedMenuItems] = useState<NavbarItemType[]>([])
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingMenu, setShowSettingMenu] = useState(false)
  const [showCustomNav, setShowCustomNav] = useState(false)

  const pinnedMenuItemsData = getPinnedMenuItemsData()

  /**
   * Update pinned manu
   */
  useLayoutEffect(() => {
    if (!pinnedMenu) {
      setPinnedMenuItems(pinnedMenuItemsData)
      return
    }

    setPinnedMenuItems(getArrayOfNavItems(pinnedMenu))
  }, [pinnedMenu])

  /**
   * Update recent menu
   */
  useLayoutEffect(() => {
    setRecentMenuItems(getArrayOfNavItems(recentMenu))
  }, [recentMenu])

  /**
   * Map mock data menu by type to Settings and More
   */
  const { moreMenu, settingsMenu } = useMemo(() => {
    const navbarMenuData = getNavbarMenuData()
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
    changeRecentMenu(recentItems.map(item => item.id))
    changePinnedMenu(currentPinnedItems.map(item => item.id))
    // TODO: Remove when `changeRecentMenu` and `changePinnedMenu` are passed to the component
    setRecentMenuItems(recentItems)
    setPinnedMenuItems(currentPinnedItems)
  }

  /**
   * Remove recent menu item
   */
  const handleRemoveRecentMenuItem = useCallback(
    (item: NavbarItemType) => {
      const data = recentMenuItems.reduce<NavbarItemIdType[]>((acc, recentMenuItem) => {
        if (recentMenuItem.id !== item.id) {
          acc.push(recentMenuItem.id)
        }

        return acc
      }, [])
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

      changePinnedMenu(getPinnedItems(pinnedMenuItems).map(it => it.id))

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
        navbarMenuData={getNavbarMenuData()}
        showManageNavigation={showCustomNav}
        isSubmitting={false}
        submitted={false}
        onSave={handleSave}
        onClose={handleCustomNav}
      />
    </SandboxLayout.Root>
  )
}
