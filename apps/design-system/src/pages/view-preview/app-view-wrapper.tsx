import { FC, PropsWithChildren, ReactNode, useCallback, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { useThemeStore } from '@utils/theme-utils'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { AppSidebar, MoreSubmenu, NavbarItemType, SettingsMenu, Sidebar } from '@harnessio/ui/components'

import { useRootViewWrapperStore } from './root-view-wrapper-store'

export interface AppViewWrapperProps {
  asChild?: boolean
  breadcrumbs?: ReactNode
}

export const AppViewWrapper: FC<PropsWithChildren<AppViewWrapperProps>> = ({
  children,
  breadcrumbs,
  asChild = false
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [pinnedMenu, setPinnedMenu] = useState<NavbarItemType[]>([])
  const [recentMenu] = useState<NavbarItemType[]>([])
  const { moreMenu, settingsMenu } = useRootViewWrapperStore()

  const setPinned = useCallback((item: NavbarItemType, pin: boolean) => {
    setPinnedMenu(current => (pin ? [...current, item] : current.filter(pinnedItem => pinnedItem !== item)))
  }, [])

  const onToggleMoreMenu = useCallback(() => {
    setShowSettingsMenu(false)
    console.log('open more menu')
    setShowMoreMenu(current => !current)
  }, [])

  const onToggleSettingsMenu = useCallback(() => {
    setShowMoreMenu(false)
    setShowSettingsMenu(current => !current)
  }, [])

  return (
    <Routes>
      <Route
        path="*"
        element={
          <Sidebar.Provider>
            <AppSidebar
              showMoreMenu={showMoreMenu}
              showSettingMenu={showSettingsMenu}
              handleMoreMenu={onToggleMoreMenu}
              handleSettingsMenu={onToggleSettingsMenu}
              currentUser={undefined}
              handleCustomNav={noop}
              handleLogOut={noop}
              recentMenuItems={recentMenu}
              pinnedMenuItems={pinnedMenu}
              handleChangePinnedMenuItem={setPinned}
              handleRemoveRecentMenuItem={noop}
              useTranslationStore={useTranslationStore}
              useThemeStore={useThemeStore}
            />
            <Sidebar.Inset>
              <div className="h-full flex flex-col">
                {breadcrumbs}
                <Outlet />
              </div>
              <MoreSubmenu showMoreMenu={showMoreMenu} handleMoreMenu={onToggleMoreMenu} items={moreMenu} />
              <SettingsMenu
                showSettingMenu={showSettingsMenu}
                handleSettingsMenu={onToggleSettingsMenu}
                items={settingsMenu}
              />
            </Sidebar.Inset>
          </Sidebar.Provider>
        }
      >
        {asChild ? children : <Route path="*" element={children} />}
      </Route>
    </Routes>
  )
}
