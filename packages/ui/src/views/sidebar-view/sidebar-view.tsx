import { useState } from 'react'

import {
  AppSidebarItem,
  AppSidebarUser,
  HarnessLogo,
  LanguageCode,
  LanguageDialog,
  LanguageInterface,
  languages,
  NavbarItemType,
  SearchProvider,
  Sidebar,
  SidebarSearch,
  ThemeDialog
} from '@/components'
import { useTheme, useTranslation } from '@/context'
import { TypesUser } from '@/types'

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
}

export const SidebarView = ({
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  pinnedMenuItems,
  recentMenuItems,
  showMoreMenu,
  showSettingMenu,
  currentUser,
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

  return (
    <>
      <Sidebar.Root>
        <Sidebar.Header>
          <SearchProvider>
            <SidebarSearch logo={<HarnessLogo />} />
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

            <Sidebar.Item
              title={t('component:navbar.more', 'More')}
              icon="menu-more-horizontal"
              onClick={() => handleMoreMenu()}
              withRightIndicator
              active={showMoreMenu}
            />
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
                description="Manage users and roles"
                icon="user"
                to="/admin/default-settings"
              >
                <Sidebar.MenuSubItem to="/notifications" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
                <Sidebar.MenuSubItem to="/" title="Some long long long long title "></Sidebar.MenuSubItem>
              </Sidebar.Item>
            )}
            <Sidebar.Item
              title={t('component:navbar.settings', 'Settings')}
              icon="settings"
              badge="new"
              onClick={() => handleSettingsMenu()}
              tooltip="Settings are not available yet"
              active={showSettingMenu}
            />
            <Sidebar.Item
              title={t('component:navbar.settings', 'Settings')}
              icon="settings"
              onClick={() => handleSettingsMenu()}
              withRightIndicator
              disabled
            />
            <Sidebar.MenuSkeleton />
            <Sidebar.MenuSkeleton />
            <Sidebar.MenuSkeleton hideIcon />
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
        <Sidebar.Rail />
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
