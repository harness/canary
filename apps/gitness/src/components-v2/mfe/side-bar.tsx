import { FC, useCallback, useState } from 'react'

import { noop } from 'lodash-es'

import {
  HarnessLogo,
  IconV2,
  IconV2NamesType,
  LanguageCode,
  LanguageDialog,
  LanguageInterface,
  languages,
  Sidebar,
  SidebarSearchLegacy,
  ThemeDialog,
  User,
  useSidebar
} from '@harnessio/ui/components'
import { useRouterContext, useTheme, useTranslation } from '@harnessio/ui/context'

import { useAppContext } from '../../framework/context/AppContext'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const SideBarToggleMenuItem: FC = () => {
  const { t } = useTranslation()
  const { collapsed, toggleSidebar } = useSidebar()
  return (
    <Sidebar.MenuItem className="flex justify-center">
      <Sidebar.MenuButton onClick={toggleSidebar}>
        <Sidebar.MenuItemText
          className="pl-0"
          aria-label={
            collapsed
              ? t('component:navbar.sidebarToggle.expand', 'Expand')
              : t('component:navbar.sidebarToggle.collapse', 'Collapse')
          }
          text={t('component:navbar.sidebarToggle.collapse', 'Collapse')}
          icon={<IconV2 name={collapsed ? 'expand-sidebar' : 'collapse-sidebar'} size="sm" />}
        />
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  )
}

const AppSidebar: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAppContext()
  const [openThemeDialog, setOpenThemeDialog] = useState(false)
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { NavLink } = useRouterContext()
  const { routes, hooks, setMFETheme } = useMFEContext()
  const { forceLogout } = hooks?.useLogout?.() || {}

  const { changeLanguage, i18n } = useTranslationStore()

  const renderMenuItem = ({ to, text, iconName }: { to: string; text: string; iconName: IconV2NamesType }) => (
    <Sidebar.MenuItem>
      <NavLink className="block" to={to} end>
        {({ isActive }) => (
          <Sidebar.MenuButton asChild isActive={isActive}>
            <Sidebar.MenuItemText text={text} icon={<IconV2 name={iconName} size="sm" />} active={isActive} />
          </Sidebar.MenuButton>
        )}
      </NavLink>
    </Sidebar.MenuItem>
  )

  const handleLanguageChange = useCallback(
    (language: LanguageInterface) => {
      changeLanguage(language.code.toLowerCase())
    },
    [changeLanguage]
  )

  const handleLanguageSave = useCallback(
    (language: LanguageInterface) => {
      changeLanguage(language.code.toLowerCase())
      setOpenLanguageDialog(false)
    },
    [changeLanguage, setOpenLanguageDialog]
  )

  return (
    <>
      <Sidebar.Provider className="min-h-svh">
        <Sidebar.Root className="h-svh">
          <Sidebar.Header className="pb-3">
            <SidebarSearchLegacy logo={<HarnessLogo />} />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {renderMenuItem({ to: '/repos', text: 'Repositories', iconName: 'repository' })}
                  {renderMenuItem({ to: '/manage-repositories', text: 'Manage Repositories', iconName: 'repository' })}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
            <Sidebar.Group className="border-t">
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {renderMenuItem({
                    to: routes?.toProjectSettings?.() || '',
                    text: 'Project Settings',
                    iconName: 'settings'
                  })}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
            <Sidebar.Group className="border-t">
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {renderMenuItem({
                    to: routes?.toAccountSettings?.() || '',
                    text: 'Account Settings',
                    iconName: 'settings'
                  })}
                  {renderMenuItem({
                    to: routes?.toOrgSettings?.() || '',
                    text: 'Organization Settings',
                    iconName: 'settings'
                  })}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Menu>
              <Sidebar.MenuItem className="flex justify-center">
                <Sidebar.MenuButton
                  onClick={() => {
                    const currentUrl = window.location.href
                    const updatedUrl = currentUrl.replace('/codev2', '/code')
                    window.location.href = updatedUrl
                  }}
                  asChild
                >
                  <Sidebar.MenuItemText
                    text={t('component:navbar.sidebarToggle.switchToCodeV1', 'Switch to Code V1')}
                    icon={<IconV2 name="arrow-left" size="sm" />}
                  />
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <SideBarToggleMenuItem />
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Footer className="border-t border-sidebar-border-1 px-1.5 transition-[padding] duration-150 ease-linear group-data-[state=collapsed]:px-2">
            <User
              user={currentUser}
              openThemeDialog={() => setOpenThemeDialog(true)}
              openLanguageDialog={() => setOpenLanguageDialog(true)}
              handleLogOut={forceLogout || noop}
            />
          </Sidebar.Footer>
          <Sidebar.Rail />
        </Sidebar.Root>
        <Sidebar.Inset>{children}</Sidebar.Inset>
      </Sidebar.Provider>
      <ThemeDialog
        theme={theme}
        setTheme={setMFETheme}
        open={openThemeDialog}
        onOpenChange={() => setOpenThemeDialog(false)}
      />
      <LanguageDialog
        supportedLanguages={languages}
        defaultLanguage={i18n.language as LanguageCode}
        open={openLanguageDialog}
        onOpenChange={() => setOpenLanguageDialog(false)}
        onChange={handleLanguageChange}
        onCancel={() => setOpenLanguageDialog(false)}
        onSave={handleLanguageSave}
      />
    </>
  )
}

export { AppSidebar }
