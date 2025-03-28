import { useState } from 'react'

import {
  Icon,
  LanguageCode,
  LanguageDialog,
  LanguageInterface,
  languages,
  Sidebar,
  Spacer,
  ThemeDialog
} from '@/components'
import { ContentStyleType, useRouterContext, useTheme } from '@/context'
import { TypesUser } from '@/types'
import { TranslationStore } from '@/views'

import { SidebarItem } from './sidebar-item'
import { SidebarSearchLegacy } from './sidebar-search-legacy'
import { SearchProvider } from './sidebar-search/search-context'
import { SidebarSearch } from './sidebar-search/sidebar-search'
import { User } from './sidebar-user'
import { NavbarItemType } from './types'

interface SidebarProps {
  recentMenuItems: NavbarItemType[]
  pinnedMenuItems: NavbarItemType[]
  showMoreMenu: boolean
  showSettingMenu: boolean
  handleMoreMenu: () => void
  handleSettingsMenu: () => void
  currentUser: TypesUser | undefined
  handleCustomNav: () => void
  handleLogOut: () => void
  handleChangePinnedMenuItem: (item: NavbarItemType, pin: boolean) => void
  handleRemoveRecentMenuItem: (item: NavbarItemType) => void
  useTranslationStore: () => TranslationStore
  showNewSearch?: boolean
}

export const AppSidebar = ({
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
  showNewSearch
}: SidebarProps) => {
  const { t, i18n, changeLanguage } = useTranslationStore()
  const { theme, setTheme, setInset, isInset } = useTheme()
  const { Link, navigate } = useRouterContext()

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

  const onInsetChange = (style: ContentStyleType) => setInset(style === ContentStyleType.Inset)

  return (
    <>
      <Sidebar.Root className="z-20">
        <Sidebar.Header>
          {showNewSearch ? (
            <SearchProvider t={t}>
              <SidebarSearch
                className="pb-3 pt-1.5"
                t={t}
                logo={
                  <Link to="/" className="flex h-[58px] items-center justify-start gap-0.5 pl-1">
                    <Icon name="harness" size={18} className="text-sidebar-foreground-accent" />
                    <Icon name="harness-logo-text" width={65} height={15} className="mb-px text-sidebar-foreground-1" />
                  </Link>
                }
              />
            </SearchProvider>
          ) : (
            <SidebarSearchLegacy
              t={t}
              logo={
                <Link className="flex items-center gap-0.5" to="/">
                  <Icon name="harness" size={18} className="text-sidebar-foreground-accent" />
                  <Icon name="harness-logo-text" width={65} height={15} className="mb-px text-sidebar-foreground-1" />
                </Link>
              }
            />
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
                  <Sidebar.MenuButton asChild onClick={handleMoreMenu}>
                    <Sidebar.MenuItemText
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
              <Spacer size={2} />
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
                    <Sidebar.MenuButton asChild onClick={() => navigate('/admin/default-settings')}>
                      <Sidebar.MenuItemText
                        text={t('component:navbar.user-management', 'User Management')}
                        icon={<Icon name="account" size={14} />}
                      />
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                )}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild onClick={handleSettingsMenu}>
                    <Sidebar.MenuItemText
                      text={t('component:navbar.settings', 'Settings')}
                      icon={<Icon name="settings-1" size={14} />}
                    />
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer className="border-t border-sidebar-border-1">
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
