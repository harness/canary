import { FC, PropsWithChildren, useCallback, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { noop, useThemeStore, useTranslationsStore } from '@utils/viewUtils'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Navbar,
  NavbarItemType,
  Topbar
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

const RootViewWrapper: FC<PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild = false }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [pinnedMenu, setPinnedMenu] = useState<NavbarItemType[]>([])
  const [recentMenu] = useState<NavbarItemType[]>([])

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
          <SandboxLayout.Root>
            <SandboxLayout.LeftPanel>
              <Navbar
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
                useThemeStore={useThemeStore}
                useTranslationStore={useTranslationsStore}
              />
            </SandboxLayout.LeftPanel>
            <div className="flex flex-col">
              <div className="bg-background-1 sticky top-0 z-40">
                <Topbar.Root>
                  <Topbar.Left>
                    <Breadcrumb className="select-none">
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">Lorem</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">Ipsum</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>Dolor</BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </Topbar.Left>
                </Topbar.Root>
              </div>
              <Outlet />
            </div>
          </SandboxLayout.Root>
        }
      >
        {asChild ? children : <Route path="*" element={children} />}
      </Route>
    </Routes>
  )
}

export default RootViewWrapper
