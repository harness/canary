import { FC, PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { AppSidebar, MoreSubmenu, NavbarItemType, SettingsMenu, Sidebar } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

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
  const [isInset, setIsInset] = useState<boolean>(false)

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

  /**
   * Set inset on mount and listen for changes in ViewSettings
   */
  useEffect(() => {
    const setInset = () => {
      const inset = sessionStorage.getItem('view-preview-is-inset')
      setIsInset(inset === 'true')
    }

    setInset()
    window.addEventListener('storageChange', setInset)

    return () => window.removeEventListener('storageChange', setInset)
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
            />
            <Sidebar.Inset>
              <div className={cn('h-full', { 'overflow-hidden h-screen p-2 bg-sidebar-background-1': isInset })}>
                <div className={cn('h-full flex flex-col', { 'rounded-md overflow-auto bg-background-1': isInset })}>
                  <div className="layer-high bg-background-1 sticky top-0">{breadcrumbs}</div>
                  <Outlet />
                </div>
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
