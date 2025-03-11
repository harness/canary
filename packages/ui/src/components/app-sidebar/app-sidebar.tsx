import { useState } from 'react'

import { IThemeStore, useRouterContext } from '@/context'
import { TypesUser } from '@/types'
import { TranslationStore } from '@/views'
import { Icon } from '@components/icon'
import { LanguageCode, LanguageDialog, LanguageInterface, languages } from '@components/language-selector'
import { Sidebar } from '@components/sidebar/sidebar'
import { Spacer } from '@components/spacer'
import { ThemeDialog } from '@components/theme-selector-v2'

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
  useThemeStore: () => IThemeStore
  useTranslationStore: () => TranslationStore
  showNewSearch?: boolean
}

export const AppSidebar = ({
  useThemeStore,
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
  const { theme, setTheme } = useThemeStore()
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

  return (
    <>
      <Sidebar.Root>
        <Sidebar.Header>
          {showNewSearch ? (
            <SearchProvider t={t}>
              <SidebarSearch
                t={t}
                logo={
                  <Link to="/" className="h-[58px] flex gap-2 items-center pl-3 justify-start">
                    <Icon name="harness" size={20} className="text-foreground-accent" />
                    <Icon name="harness-logo-text" size={68} className="text-foreground-1" />
                  </Link>
                }
              />
            </SearchProvider>
          ) : (
            <SidebarSearchLegacy
              t={t}
              logo={
                <Link className="flex items-center gap-1.5" to="/">
                  <Icon name="harness" size={18} className="text-foreground-accent" />
                  <Icon name="harness-logo-text" width={65} height={15} className="mb-0.5 text-foreground-1" />
                </Link>
              }
            />
          )}
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group className="px-2 pt-5">
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

                <Sidebar.MenuItem className="cursor-pointer">
                  <Sidebar.MenuButton asChild onClick={handleMoreMenu}>
                    <div>
                      <Icon name="ellipsis" size={12} className="text-icons-4 transition-colors hover:text-primary" />
                      <span className="text-foreground-3 font-medium transition-colors hover:text-primary">
                        {t('component:navbar.more', 'More')}
                      </span>
                    </div>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          {!!recentMenuItems.length && (
            <Sidebar.Group title="Recent" className="border-t px-2 pt-3">
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

          <Sidebar.Group className="border-t px-2 pt-5">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {!!currentUser?.admin && (
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton asChild onClick={() => navigate('/admin/default-settings')}>
                      <div>
                        <Icon name="account" size={12} className="text-icons-4 transition-colors hover:text-primary" />
                        <span className="text-foreground-3 font-medium transition-colors hover:text-primary">
                          {t('component:navbar.user-management', 'User Management')}
                        </span>
                      </div>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                )}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild onClick={handleSettingsMenu}>
                    <div>
                      <Icon name="settings-1" size={12} className="text-icons-4 transition-colors hover:text-primary" />
                      <span className="text-foreground-3 font-medium transition-colors hover:text-primary">
                        {t('component:navbar.settings', 'Settings')}
                      </span>
                    </div>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer className="border-t border-borders-1">
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
        setTheme={setTheme}
        open={openThemeDialog}
        onOpenChange={() => setOpenThemeDialog(false)}
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
