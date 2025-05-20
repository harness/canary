import { FC, PropsWithChildren, ReactNode, useCallback, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { noop } from '@utils/viewUtils'

import { MoreSubmenu, NavbarItemType, SettingsMenu, Sidebar } from '@harnessio/ui/components'
import { MainContentLayout, SidebarView } from '@harnessio/ui/views'

import { useRootViewWrapperStore } from './root-view-wrapper-store'

export interface AppViewWrapperProps {
  asChild?: boolean
  breadcrumbs?: ReactNode
  childrenWrapperClassName?: string
}

export const AppViewWrapper: FC<PropsWithChildren<AppViewWrapperProps>> = ({
  children,
  breadcrumbs,
  childrenWrapperClassName,
  asChild = false
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [pinnedMenu, setPinnedMenu] = useState<NavbarItemType[]>([
    {
      id: 0,
      iconName: 'repositories-gradient',
      title: 'Repositories',
      description: 'Integrated & familiar git experience.',
      to: '/pixel/repos',
      permanentlyPinned: true
    },
    {
      id: 1,
      iconName: 'pipelines-gradient',
      title: 'Pipelines',
      description: 'Up to 4X faster than other solutions.',
      to: '/pipelines',
      permanentlyPinned: true
    },
    {
      id: 3,
      iconName: 'database-gradient',
      title: 'Databases',
      description: 'Manage all your infrastructure.',
      to: '/databases'
    },
    {
      id: 7,
      iconName: 'dev-portal-gradient',
      title: 'Developer Portal',
      description: 'Built for developers, onboard in minutes.',
      to: '/developer/portal'
    },
    {
      id: 32,
      iconName: 'user',
      title: 'Users',
      to: '/admin/default-settings'
    },
    {
      id: 9,
      iconName: 'dev-insights-gradient',
      title: 'Developer Insights',
      description: 'Actionable insights on SDLC.',
      to: '/developer/insights'
    }
  ])
  const [recentMenu] = useState<NavbarItemType[]>([])
  const { moreMenu, settingsMenu } = useRootViewWrapperStore()

  const setPinned = useCallback((item: NavbarItemType, pin: boolean) => {
    setPinnedMenu(current => (pin ? [...current, item] : current.filter(pinnedItem => pinnedItem !== item)))
  }, [])

  const onToggleMoreMenu = useCallback(() => {
    setShowSettingsMenu(false)
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
            <SidebarView
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
            />
            <Sidebar.Inset>
              {breadcrumbs}
              <MainContentLayout className={childrenWrapperClassName} withBreadcrumbs>
                <Outlet />
              </MainContentLayout>
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
