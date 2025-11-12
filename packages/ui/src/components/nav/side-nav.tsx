import { useEffect, useMemo, useState } from 'react'

import {
  Drawer,
  ManageNavigation,
  Sidebar,
  useSidebar,
  type DrawerContentProps,
  type NavbarItemType
} from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { cn } from '@/utils'
import { noop } from 'lodash-es'

import { useLocationChange } from '../../hooks/useLocationChange'
import { useNav } from '../../hooks/useNav'
import { getNavbarMoreMenuData, NavItems } from './data/navbar-more-menu-items'
import { getNavbarSettingsMenuData } from './data/navbar-settings-menu-items'
import { getPinnedMenuItems } from './data/pinned-menu-items'
import SidebarGroupMenu from './sidebar-group-menu'
import SidebarItem from './sidebar-item'
import { NavEnum, RouteDefinitions } from './types'

interface NavLinkStorageInterface {
  state: {
    recentMenu: NavbarItemType[]
    pinnedMenu: NavbarItemType[]
  }
}

export const SideNav: React.FC<{ routes?: RouteDefinitions }> = ({ routes }) => {
  const { useParams } = useRouterContext()
  const params = useParams()
  const { recentMenu, setRecent, pinnedMenu, setNavLinks } = useNav()
  const { state } = useSidebar()
  const { t } = useTranslation()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)

  const [showManageNavigation, setShowManageNavigation] = useState(false)

  const collapsed = useMemo(() => state === 'collapsed', [state])

  const commonParams = { ...params, mode: 'all' }

  const moreMenuItems = useMemo(() => getNavbarMoreMenuData({ t, routes, params: commonParams }), [t])
  const settingsMenuItems = useMemo(() => getNavbarSettingsMenuData({ t, routes, params: commonParams }), [t])
  const pinnedMenuItems = useMemo(() => getPinnedMenuItems(t), [t])
  const combinedMenuItems = useMemo(
    () => [
      ...pinnedMenuItems,
      ...moreMenuItems.flatMap(item => item.items),
      ...settingsMenuItems.flatMap(item => item.items)
    ],
    [pinnedMenuItems, moreMenuItems, settingsMenuItems]
  )

  // --- Initialization: Load from localStorage ---
  useEffect(() => {
    const stored = localStorage.getItem('nav-items')
    let parsed: NavLinkStorageInterface | undefined
    try {
      parsed = stored ? JSON.parse(stored) : undefined
    } catch {
      // Invalid JSON, use defaults
      parsed = undefined
    }

    if (parsed) {
      setNavLinks({
        pinned: parsed.state?.pinnedMenu?.length ? parsed.state.pinnedMenu : pinnedMenuItems,
        recents: parsed.state?.recentMenu ?? []
      })
    } else {
      // First time: set default pinned
      setNavLinks({ pinned: pinnedMenuItems, recents: [] })
    }
  }, [setNavLinks])

  useLocationChange({ items: combinedMenuItems, onRouteChange: item => setRecent(item) })

  const drawerContentCommonProps: DrawerContentProps = useMemo(
    () => ({
      className: cn('cn-sidebar-drawer-content z-20 overflow-x-hidden rounded', {
        'cn-sidebar-menu-drawer-content-collapsed': collapsed
      }),
      overlayClassName: cn('bg-transparent z-20 opacity-0', {
        'cn-sidebar-drawer-overlay-collapsed': collapsed
      }),
      onOpenAutoFocus: (e: Event) => {
        const target = e.target instanceof HTMLElement && e.target.querySelector('.cn-sidebar-item-wrapper a')
        if (target instanceof HTMLElement) target.focus()
      }
    }),
    [collapsed]
  )

  /**
   * Handle save recent and pinned items
   */
  const handleSave = (nextRecentItems: NavbarItemType[], nextPinnedItems: NavbarItemType[]) => {
    setNavLinks({
      pinned: nextPinnedItems,
      recents: nextRecentItems
    })
  }

  return (
    <>
      <Sidebar.Root className="!z-30 cn-content-full-height">
        <Sidebar.Content>
          <Sidebar.Group>
            {/* 👉 Static pinned menu */}
            <SidebarItem isPinned item={{ ...NavItems.get(NavEnum.Home)!, to: routes?.toHome?.(params) || '' }} />
            <SidebarItem
              isPinned
              item={{ ...NavItems.get(NavEnum.Activities)!, to: routes?.Activities?.(params) || '' }}
            />

            {/* 👉 User pinned menu */}
            {pinnedMenu.map(item => (
              <SidebarItem isPinned key={item.id} item={item} />
            ))}

            {/* 👉 Settings menu */}
            <Drawer.Root direction="left" open={showSettingsMenu} onOpenChange={setShowSettingsMenu}>
              <Drawer.Trigger>
                <Sidebar.Item
                  withRightIndicator
                  title={NavItems.get(NavEnum.Settings)!.title}
                  icon={NavItems.get(NavEnum.Settings)!.iconName}
                  active={showSettingsMenu}
                />
              </Drawer.Trigger>

              <Drawer.Content
                {...drawerContentCommonProps}
                size="2xs"
                onPointerDownOutside={() => setShowSettingsMenu(false)}
              >
                <Drawer.Title className="sr-only">Settings menu</Drawer.Title>
                <Drawer.Description className="sr-only">Settings menu</Drawer.Description>
                <Drawer.Body>
                  <SidebarGroupMenu menuItems={settingsMenuItems} columns={1} />
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>

            {/* 👉 More menu */}
            <Drawer.Root direction="left" open={showMoreMenu} onOpenChange={setShowMoreMenu}>
              <Drawer.Trigger>
                <Sidebar.Item title="more" icon="menu-more-horizontal" withRightIndicator active={showMoreMenu} />
              </Drawer.Trigger>

              <Drawer.Content
                {...drawerContentCommonProps}
                size="xs"
                onPointerDownOutside={() => setShowMoreMenu(false)}
              >
                <Drawer.Title className="sr-only">More menu</Drawer.Title>
                <Drawer.Description className="sr-only">More menu</Drawer.Description>
                <Drawer.Body>
                  <SidebarGroupMenu menuItems={moreMenuItems} columns={2} />
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>
          </Sidebar.Group>

          <Sidebar.Separator />

          {/* 👉 Recent menu */}
          <Sidebar.Group
            label="RECENT"
            onActionClick={() => {
              setShowManageNavigation(true)
            }}
          >
            {recentMenu.map(item => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Rail onClick={noop} open={!collapsed} />
      </Sidebar.Root>

      <ManageNavigation
        pinnedItems={pinnedMenu}
        recentItems={recentMenu}
        navbarMenuData={moreMenuItems}
        showManageNavigation={showManageNavigation}
        isSubmitting={false}
        submitted={false}
        onSave={handleSave}
        onClose={() => setShowManageNavigation(false)}
      />
    </>
  )
}
