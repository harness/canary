import { Fragment, useEffect, useMemo, useState } from 'react'

import { TypesUser } from '@/types'

import {
  AppSidebarItem,
  AppSidebarUser,
  Drawer,
  DrawerContentProps,
  HarnessLogo,
  LanguageCode,
  LanguageDialog,
  LanguageInterface,
  languages,
  Layout,
  MenuGroupType,
  NavbarItemType,
  SearchProvider,
  Sidebar,
  SidebarSearch,
  ThemeDialog,
  useSidebar
} from '@harnessio/ui/components'
import { useRouterContext, useTheme, useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

interface SidebarProps {
  recentMenuItems: NavbarItemType[]
  pinnedMenuItems: NavbarItemType[]
  showMoreMenu: boolean
  showSettingMenu: boolean
  handleMoreMenu: (state?: boolean) => void
  handleSettingsMenu: (state?: boolean) => void
  currentUser: TypesUser | undefined
  handleCustomNav: () => void
  handleLogOut: () => void
  handleChangePinnedMenuItem: (item: NavbarItemType, pin: boolean) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  hasToggle?: boolean
  changeLanguage: (language: string) => void
  lang: string
  settingsMenu: MenuGroupType[]
  moreMenu: MenuGroupType[]
}

export const SidebarView = ({
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  pinnedMenuItems,
  recentMenuItems,
  showMoreMenu,
  showSettingMenu,
  settingsMenu = [],
  currentUser,
  moreMenu = [],
  handleMoreMenu,
  handleSettingsMenu,
  handleCustomNav,
  handleLogOut,
  hasToggle = true,
  changeLanguage,
  lang
}: SidebarProps) => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { location } = useRouterContext()
  const { state } = useSidebar()

  const collapsed = useMemo(() => state === 'collapsed', [state])

  const [openThemeDialog, setOpenThemeDialog] = useState(false)
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false)

  const handleLanguageChange = (language: LanguageInterface) => {
    changeLanguage(language.code.toLowerCase())
  }

  const handleLanguageSave = (language: LanguageInterface) => {
    changeLanguage(language.code.toLowerCase())
    setOpenLanguageDialog(false)
  }

  const handleLanguageCancel = () => {
    setOpenLanguageDialog(false)
  }

  const handleToggleSidebar = () => {
    handleMoreMenu(false)
    handleSettingsMenu(false)
  }

  useEffect(() => {
    handleMoreMenu(false)
    handleSettingsMenu(false)
  }, [location.pathname, handleMoreMenu, handleSettingsMenu])

  const drawerContentCommonProps: DrawerContentProps = {
    size: 'xs',
    className: cn('cn-sidebar-drawer-content z-20', { 'cn-sidebar-drawer-content-collapsed': collapsed }),
    overlayClassName: cn('cn-sidebar-drawer-overlay z-20', { 'cn-sidebar-drawer-overlay-collapsed': collapsed }),
    forceWithOverlay: true,
    onCloseAutoFocus: e => e.preventDefault(),
    // Focus the first link in the drawer when it opens
    onOpenAutoFocus: e => {
      const target = e.target instanceof HTMLElement && e.target?.querySelector('.cn-sidebar-item-wrapper a')
      if (target instanceof HTMLElement) {
        target.focus()
      }
    }
  }

  return (
    <>
      <Sidebar.Root className="!z-30">
        <Sidebar.Header>
          <SearchProvider>
            <Layout.Grid gapY="md">
              <HarnessLogo />
              <SidebarSearch />
            </Layout.Grid>
          </SearchProvider>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            {pinnedMenuItems.map(item => (
              <AppSidebarItem
                item={item}
                key={item.id}
                handleChangePinnedMenuItem={handleChangePinnedMenuItem}
                handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
                handleCustomNav={handleCustomNav}
              />
            ))}

            <Drawer.Root direction="left" open={showMoreMenu} onOpenChange={handleMoreMenu} modal={false}>
              <Drawer.Trigger>
                <Sidebar.Item
                  title={t('component:navbar.more', 'More')}
                  icon="menu-more-horizontal"
                  withRightIndicator
                  active={showMoreMenu}
                />
              </Drawer.Trigger>

              <Drawer.Content {...drawerContentCommonProps}>
                <Drawer.Title className="sr-only">More menu</Drawer.Title>
                <Drawer.Description className="sr-only">More menu</Drawer.Description>
                <Drawer.Body>
                  {moreMenu.map((group, index) => (
                    <Fragment key={group.groupId}>
                      {index > 0 && <Sidebar.Separator />}
                      <Sidebar.Group key={group.groupId} label={group.title}>
                        {group.items.map(item => (
                          <Sidebar.Item
                            key={item.id}
                            to={item.to}
                            title={item.title}
                            description={item.description}
                            icon={item.iconName}
                          />
                        ))}
                      </Sidebar.Group>
                    </Fragment>
                  ))}
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>
          </Sidebar.Group>

          <Sidebar.Separator />

          {!!recentMenuItems.length && (
            <Sidebar.Group label={t('component:navbar.recent', 'Recent')}>
              {recentMenuItems.map(item => (
                <AppSidebarItem
                  isRecent
                  key={item.id}
                  item={item}
                  handleChangePinnedMenuItem={handleChangePinnedMenuItem}
                  handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
                  handleCustomNav={handleCustomNav}
                />
              ))}
            </Sidebar.Group>
          )}

          <Sidebar.Separator />

          <Sidebar.Group>
            {!!currentUser?.admin && (
              <Sidebar.Item
                title={t('component:navbar.user-management', 'User Management')}
                icon="user"
                to="/admin/default-settings"
              />
            )}

            <Drawer.Root direction="left" open={showSettingMenu} onOpenChange={handleSettingsMenu} modal={false}>
              <Drawer.Trigger>
                <Sidebar.Item
                  title={t('component:navbar.settings', 'Settings')}
                  icon="settings"
                  active={showSettingMenu}
                  withRightIndicator
                />
              </Drawer.Trigger>

              <Drawer.Content {...drawerContentCommonProps}>
                <Drawer.Title className="sr-only">Settings menu</Drawer.Title>
                <Drawer.Description className="sr-only">Settings menu</Drawer.Description>
                <Drawer.Body>
                  {settingsMenu.map((group, index) => (
                    <Fragment key={group.groupId}>
                      {index > 0 && <Sidebar.Separator />}
                      <Sidebar.Group
                        key={group.groupId}
                        label={group.title}
                        className="grid-cols-2 [&>h6]:[grid-column:1/3]"
                      >
                        {group.items.map(item => (
                          <Sidebar.Item
                            key={item.id}
                            to={item.to}
                            title={item.title}
                            description={item.description}
                            icon={item.iconName}
                          />
                        ))}
                      </Sidebar.Group>
                    </Fragment>
                  ))}
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          {hasToggle && <Sidebar.ToggleMenuButton onClick={handleToggleSidebar} />}
          <Sidebar.Separator />
          <AppSidebarUser
            user={currentUser}
            openThemeDialog={() => setOpenThemeDialog(true)}
            openLanguageDialog={() => setOpenLanguageDialog(true)}
            handleLogOut={handleLogOut}
          />
        </Sidebar.Footer>
        <Sidebar.Rail onClick={handleToggleSidebar} />
      </Sidebar.Root>

      <ThemeDialog
        theme={theme}
        setTheme={setTheme}
        open={openThemeDialog}
        onOpenChange={() => setOpenThemeDialog(false)}
      />
      <LanguageDialog
        supportedLanguages={languages}
        defaultLanguage={lang as LanguageCode}
        open={openLanguageDialog}
        onOpenChange={() => setOpenLanguageDialog(false)}
        onChange={handleLanguageChange}
        onCancel={handleLanguageCancel}
        onSave={handleLanguageSave}
      />
    </>
  )
}

SidebarView.displayName = 'SidebarView'
