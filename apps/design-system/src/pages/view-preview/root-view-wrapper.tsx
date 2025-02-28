import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import { noop, useThemeStore, useTranslationStore } from '@utils/viewUtils'

import { Breadcrumb, MoreSubmenu, Navbar, NavbarItemType, SettingsMenu, Topbar } from '@harnessio/ui/components'
import { cn, SandboxLayout } from '@harnessio/ui/views'

import { useRootViewWrapperStore } from './root-view-wrapper-store'

const RootViewWrapper: FC<PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild = false }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [pinnedMenu, setPinnedMenu] = useState<NavbarItemType[]>([])
  const [recentMenu] = useState<NavbarItemType[]>([])
  const { moreMenu, settingsMenu } = useRootViewWrapperStore()
  const [isInset, setIsInset] = useState<boolean>(() => sessionStorage.getItem('view-preview-is-inset') === 'true')

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

  useEffect(() => {
    const handleStorageChange = () => {
      const storedValue = sessionStorage.getItem('view-preview-is-inset') === 'true'
      setIsInset(storedValue)
    }

    const originalSetItem = sessionStorage.setItem
    sessionStorage.setItem = function (key, value) {
      originalSetItem.call(this, key, value)
      if (key === 'view-preview-is-inset') handleStorageChange()
    }

    return () => {
      sessionStorage.setItem = originalSetItem
    }
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

            <div className={cn({ 'overflow-hidden h-screen p-3 bg-sidebar-background-1': isInset })}>
              <div className={cn('flex flex-col', { 'h-full rounded-xl overflow-auto bg-background-1': isInset })}>
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
