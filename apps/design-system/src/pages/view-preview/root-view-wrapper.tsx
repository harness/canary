import { FC, PropsWithChildren, useCallback, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { noop, useThemeStore, useTranslationStore } from '@utils/viewUtils'

import { Breadcrumb, MoreSubmenu, Navbar, NavbarItemType, SettingsMenu, Topbar } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

import { useRootViewWrapperStore } from './root-view-wrapper-store'

const RootViewWrapper: FC<PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild = false }) => {
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
                useTranslationStore={useTranslationStore}
              />
              <MoreSubmenu showMoreMenu={showMoreMenu} handleMoreMenu={onToggleMoreMenu} items={moreMenu} />
              <SettingsMenu
                showSettingMenu={showSettingsMenu}
                handleSettingsMenu={onToggleSettingsMenu}
                items={settingsMenu}
              />
            </SandboxLayout.LeftPanel>
            <div className="flex flex-col">
              <div className="bg-background-1 sticky top-0 z-40">
                <Topbar.Root>
                  <Topbar.Left>
                    <Breadcrumb.Root className="select-none">
                      <Breadcrumb.List>
                        <Breadcrumb.Item>
                          <Breadcrumb.Link href="#">Lorem</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                          <Breadcrumb.Link href="#">Ipsum</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>Dolor</Breadcrumb.Item>
                      </Breadcrumb.List>
                    </Breadcrumb.Root>
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
