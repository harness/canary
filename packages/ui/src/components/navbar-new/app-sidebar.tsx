// @ts-nocheck

import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { Icon } from '@components/icon'
import { LanguageDialog, languages } from '@components/language-selector'
import { ManageNavigation } from '@components/manage-navigation'
import { MoreSubmenu } from '@components/more-submenu'
import { SettingsMenu } from '@components/settings-menu'
import { Sidebar } from '@components/sidebar/sidebar'
import { Spacer } from '@components/spacer'
import { ThemeDialog } from '@components/theme-selector-v2'

import { getNavbarMenuData } from './data/navbar-menu-data'
import { SidebarItem } from './sidebar-item'
import { SidebarSearch } from './sidebar-search'
import { User } from './sidebar-user'
import { MenuGroupTypes } from './types'

const getData = t => ({
  user: {
    name: 'Jane Citizen',
    email: 'jane@harness.io',
    avatar:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop'
  }
})

export const AppSidebar = ({
  useThemeStore,
  useTranslationStore,
  handleChangePinnedMenuItem,
  handleRemoveRecentMenuItem,
  pinnedMenuItems,
  recentMenuItems,
  currentUser,
  showMoreMenu,
  showSettingMenu,
  handleMoreMenu,
  handleSettingsMenu
}) => {
  const location = useLocation()
  const { setTheme } = useThemeStore()

  // const [showMoreMenu, setShowMoreMenu] = useState(false)
  // const [showSettingMenu, setShowSettingMenu] = useState(false)
  const [showCustomNav, setShowCustomNav] = useState(false)
  const [openThemeDialog, setOpenThemeDialog] = useState(false)
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false)

  const { t, changeLanguage } = useTranslationStore()
  const data = getData(t)

  const { moreMenu, settingsMenu } = useMemo(() => {
    const navbarMenuData = getNavbarMenuData(t)

    return navbarMenuData.reduce(
      (acc, item) => {
        if (item.type === MenuGroupTypes.SETTINGS) {
          acc.settingsMenu.push(item)
        } else {
          acc.moreMenu.push(item)
        }
        return acc
      },
      { moreMenu: [], settingsMenu: [] }
    )
  }, [t, changeLanguage])

  /**
   * Toggle show more menu
   */
  // const handleMoreMenu = useCallback(() => {
  //   setShowSettingMenu(false)
  //   setShowMoreMenu(prevState => !prevState)
  // }, [])

  /**
   * Toggle system settings menu
   */
  // const handleSettingsMenu = useCallback(() => {
  //   setShowMoreMenu(false)
  //   setShowSettingMenu(prevState => !prevState)
  // }, [])

  /**
   * Toggle custom navigation modal
   */
  const handleCustomNav = useCallback(() => {
    setShowCustomNav(prevState => !prevState)
  }, [])

  /**
   * Close all menu when location changed
   */
  // useEffect(() => {
  //   setShowMoreMenu(false)
  //   setShowSettingMenu(false)
  //   setShowCustomNav(false)
  // }, [location])

  /**
   * Handle save recent and pinned items
   */
  const handleSave = (nextRecentItems, nextPinnedItems) => {
    // setNavLinks({
    //   pinnedMenu: nextPinnedItems,
    //   recentMenu: nextRecentItems
    // })
  }

  const handleThemeChange = theme => {
    setTheme(theme)
  }

  const handleLanguageChange = language => {
    changeLanguage(language.code.toLowerCase())
  }

  const handleLanguageSave = language => {
    changeLanguage(language.code.toLowerCase())
    setOpenLanguageDialog(false)
  }

  const handleLanguageCancel = () => {
    setOpenLanguageDialog(false)
  }

  const navigate = useNavigate()

  return (
    <>
      <Sidebar.Root>
        <Sidebar.Header>
          <div className="h-[58px] flex gap-2 items-center pl-3 justify-start">
            <NavLink to="/views">
              <Icon name="harness" size={20} className="text-foreground-accent" />
            </NavLink>
            <Icon name="harness-logo-text" size={68} className="text-foreground-1" />
          </div>
          <SidebarSearch t={t} />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group className="px-4 pt-5">
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
                      <Icon
                        name="ellipsis"
                        size={12}
                        className="text-icons-4 transition-colors hover:text-primary !w-[12px] !h-[auto]"
                      />
                      <span className="text-foreground-3 font-medium transition-colors hover:text-primary">More</span>
                    </div>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          {!!recentMenuItems.length && (
            <Sidebar.Group title="Recent" className="border-t px-4 pt-3">
              <Sidebar.GroupLabel>Recent</Sidebar.GroupLabel>
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

          <Sidebar.Group className="border-t px-4 pt-5">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {!!currentUser?.admin && (
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton
                      asChild
                      className="cursor-pointer"
                      onClick={() => navigate('/admin/default-settings')}
                    >
                      <div>
                        <Icon
                          name="account"
                          size={12}
                          className="text-icons-4 transition-colors hover:text-primary !w-[12px] !h-[auto]"
                        />
                        <span className="text-foreground-3 font-medium transition-colors hover:text-primary">
                          User Management
                        </span>
                      </div>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                )}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild className="cursor-pointer" onClick={handleSettingsMenu}>
                    <div>
                      <Icon
                        name="settings-1"
                        size={12}
                        className="text-icons-4 transition-colors hover:text-primary !w-[12px] !h-[auto]"
                      />
                      <span className="text-foreground-3 font-medium transition-colors hover:text-primary">
                        {t('component:navbar.settings')}
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
            t={t}
          />
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar.Root>
      <MoreSubmenu showMoreMenu={showMoreMenu} handleMoreMenu={handleMoreMenu} items={moreMenu} />
      <SettingsMenu showSettingMenu={showSettingMenu} handleSettingsMenu={handleSettingsMenu} items={settingsMenu} />
      <ManageNavigation
        pinnedItems={pinnedMenuItems}
        recentItems={recentMenuItems}
        navbarMenuData={[]}
        showManageNavigation={showCustomNav}
        isSubmitting={false}
        submitted={false}
        onSave={handleSave}
        onClose={handleCustomNav}
      />
      <ThemeDialog
        open={openThemeDialog}
        onOpenChange={() => setOpenThemeDialog(false)}
        onChange={handleThemeChange}
        // onCancel={handleThemeCancel}
        // onSave={handleThemeSave}
      />
      <LanguageDialog
        supportedLanguages={languages}
        open={openLanguageDialog}
        onOpenChange={() => setOpenLanguageDialog(false)}
        onChange={handleLanguageChange}
        onCancel={handleLanguageCancel}
        onSave={handleLanguageSave}
      />
    </>
  )
}
