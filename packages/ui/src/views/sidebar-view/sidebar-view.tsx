import { useState } from 'react'

import {
  HarnessLogo,
  Icon,
  LanguageCode,
  LanguageDialog,
  LanguageInterface,
  languages,
  NavbarItemType,
  SearchProvider,
  Sidebar,
  SidebarItem,
  SidebarSearch,
  SidebarSearchLegacy,
  ThemeDialog,
  User,
  useSidebar
} from '@/components'
import { ContentStyleType, useRouterContext, useTheme } from '@/context'
import { TypesUser } from '@/types'
import { TranslationStore } from '@/views'

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
  useTranslationStore: () => TranslationStore
  showNewSearch?: boolean
  hasToggle?: boolean
}

export const SidebarView = ({
  useTranslationStore,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  pinnedMenuItems,
  recentMenuItems,
  currentUser,
  handleMoreMenu,
  handleSettingsMenu,
  handleCustomNav,
  handleLogOut,
  hasToggle = true,
  showNewSearch
}: SidebarProps) => {
  const { t, i18n, changeLanguage } = useTranslationStore()
  const { theme, setTheme, setInset, isInset } = useTheme()
  const { navigate } = useRouterContext()
  const { collapsed, toggleSidebar } = useSidebar()

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
    toggleSidebar()
    handleMoreMenu(false)
    handleSettingsMenu(false)
  }

  const onInsetChange = (style: ContentStyleType) => setInset(style === ContentStyleType.Inset)

  return (
    <>
      <Sidebar.Root className="h-svh">
        <Sidebar.Header className="pb-3">
          {showNewSearch ? (
            <SearchProvider t={t}>
              <SidebarSearch
                className="pb-3 pt-1.5"
                t={t}
                logo={
                  <div className="my-5 flex items-center pl-2">
                    <HarnessLogo />
                  </div>
                }
              />
            </SearchProvider>
          ) : (
            <SidebarSearchLegacy t={t} logo={<HarnessLogo />} />
          )}
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {pinnedMenuItems.map((item, index) => (
                  <SidebarItem
                    item={item}
                    key={index}
                    handleChangePinnedMenuItem={handleChangePinnedMenuItem}
                    handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
                    handleCustomNav={handleCustomNav}
                    t={t}
                  />
                ))}

                <Sidebar.MenuItem>
                  <Sidebar.MenuButton onClick={() => handleMoreMenu()}>
                    <Sidebar.MenuItemText
                      className="pl-0"
                      text={t('component:navbar.more', 'More')}
                      icon={<Icon name="ellipsis" size={14} />}
                    />
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          {!!recentMenuItems.length && (
            <Sidebar.Group title={t('component:navbar.recent', 'Recent')} className="border-t pt-2.5">
              <Sidebar.GroupLabel>{t('component:navbar.recent', 'Recent')}</Sidebar.GroupLabel>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {recentMenuItems.map(item => (
                    <SidebarItem
                      isRecent
                      key={item.id}
                      item={item}
                      handleChangePinnedMenuItem={handleChangePinnedMenuItem}
                      handleRemoveRecentMenuItem={handleRemoveRecentMenuItem}
                      handleCustomNav={handleCustomNav}
                      t={t}
                    />
                  ))}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          )}

          <Sidebar.Group className="border-t">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {!!currentUser?.admin && (
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton onClick={() => navigate('/admin/default-settings')}>
                      <Sidebar.MenuItemText
                        className="pl-0"
                        text={t('component:navbar.user-management', 'User Management')}
                        icon={<Icon name="account" size={14} />}
                      />
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                )}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton onClick={() => handleSettingsMenu()}>
                    <Sidebar.MenuItemText
                      className="pl-0"
                      text={t('component:navbar.settings', 'Settings')}
                      icon={<Icon name="settings-1" size={14} />}
                    />
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>

        {hasToggle && (
          <Sidebar.Group>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton onClick={handleToggleSidebar}>
                  <Sidebar.MenuItemText
                    className="pl-0"
                    aria-label={
                      collapsed
                        ? t('component:navbar.sidebarToggle.expand', 'Expand')
                        : t('component:navbar.sidebarToggle.collapse', 'Collapse')
                    }
                    text={t('component:navbar.sidebarToggle.collapse', 'Collapse')}
                    icon={<Icon name={collapsed ? 'sidebar-right' : 'sidebar-left'} size={14} />}
                  />
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        )}

        <Sidebar.Footer className="border-sidebar-border-1 border-t px-1.5 transition-[padding] duration-150 ease-linear group-data-[state=collapsed]:px-2">
          <User
            user={currentUser}
            openThemeDialog={() => setOpenThemeDialog(true)}
            openLanguageDialog={() => setOpenLanguageDialog(true)}
            handleLogOut={handleLogOut}
            t={t}
          />
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar.Root>
      <ThemeDialog
        theme={theme}
        isInset={isInset}
        setTheme={setTheme}
        open={openThemeDialog}
        onOpenChange={() => setOpenThemeDialog(false)}
        onInsetChange={onInsetChange}
      />
      <LanguageDialog
        supportedLanguages={languages}
        defaultLanguage={i18n.language as LanguageCode}
        open={openLanguageDialog}
        onOpenChange={() => setOpenLanguageDialog(false)}
        onChange={handleLanguageChange}
        onCancel={handleLanguageCancel}
        onSave={handleLanguageSave}
      />
    </>
  )
}
