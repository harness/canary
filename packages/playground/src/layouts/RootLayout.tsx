import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ManageNavigation } from '../components/manage-navigation'
import { MoreSubmenu } from '../components/more-submenu'
import { Navbar } from '../components/navbar'
import { MenuGroupType, MenuGroupTypes, NavbarItemType } from '../components/navbar/types'
import { SettingsMenu } from '../components/settings-menu'
import { navbarMenuData } from '../data/mockNavbarMenuData'
import { pinnedMenuItemsData, recentMenuItemsData } from '../data/mockPinnedAndRecentMenuData'
import { TypesUser } from './types'

interface RootLayoutProps {
  currentUser: TypesUser | undefined
}

export const RootLayout = ({ currentUser }: RootLayoutProps) => {
  const location = useLocation()
  const [recentMenuItems, setRecentMenuItems] = useState<NavbarItemType[]>(recentMenuItemsData)
  const [pinnedMenuItems, setPinnedMenuItems] = useState<NavbarItemType[]>(pinnedMenuItemsData)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingMenu, setShowSettingMenu] = useState(false)
  const [showCustomNav, setShowCustomNav] = useState(false)

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

  // TODO: add log out func
  const handleLogOut = useCallback(() => {}, [])

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
    setRecentMenuItems(recentItems)
    setPinnedMenuItems(currentPinnedItems)
  }

  /**
   * Remove recent menu item
   */
  const handleRemoveRecentMenuItem = useCallback((item: NavbarItemType) => {
    setRecentMenuItems(prevState => prevState.filter(prevStateItem => prevStateItem.id !== item.id))
  }, [])

  /**
   * Change pinned menu items
   */
  const handleChangePinnedMenuItem = useCallback(
    (item: NavbarItemType) => {
      setPinnedMenuItems(prevState => {
        const isPinned = prevState.some(pinned => pinned.id === item.id)

        if (isPinned) {
          return prevState.filter(pinned => pinned.id !== item.id)
        }

        // If pin item, remove it from recent
        handleRemoveRecentMenuItem(item)

        return [...prevState, item]
      })
    },
    [handleRemoveRecentMenuItem]
  )

  return (
    <>
      <div className="min-w-screen grid md:grid-cols-[220px_minmax(900px,_1fr)]">
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
        <main className="col-start-2 box-border min-h-screen overflow-x-hidden overflow-y-scroll">
          <Outlet />
        </main>
      </div>
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
    </>
  )
}
