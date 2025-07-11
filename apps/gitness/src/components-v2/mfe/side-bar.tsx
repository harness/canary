import { FC, ReactNode, useCallback, useState } from 'react'

import { noop } from 'lodash-es'

import {
  AppSidebarUser,
  HarnessLogo,
  LanguageCode,
  LanguageDialog,
  LanguageInterface,
  languages,
  Layout,
  SearchProvider,
  Sidebar,
  SidebarSearch,
  ThemeDialog
} from '@harnessio/ui/components'
import { useTheme, useTranslation } from '@harnessio/ui/context'

import { useAppContext } from '../../framework/context/AppContext'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const AppSidebar: FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAppContext()
  const [openThemeDialog, setOpenThemeDialog] = useState(false)
  const [openLanguageDialog, setOpenLanguageDialog] = useState(false)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { routes, hooks, setMFETheme } = useMFEContext()
  const { forceLogout } = hooks?.useLogout?.() || {}

  const { changeLanguage, i18n } = useTranslationStore()

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
      <Sidebar.Provider>
        <Sidebar.Root>
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
              <Sidebar.Item title="Repositories" to="/manage-repositories" icon="repository" end />
              <Sidebar.Item title="Manage Repositories" to="/repos" icon="repository" end />
            </Sidebar.Group>

            <Sidebar.Separator />

            <Sidebar.Group>
              <Sidebar.Item title="Project Settings" to={routes?.toProjectSettings?.() || ''} icon="settings" end />
            </Sidebar.Group>

            <Sidebar.Separator />

            <Sidebar.Group>
              <Sidebar.Item title="Account Settings" to={routes?.toAccountSettings?.() || ''} icon="settings" end />
              <Sidebar.Item title="Organization Settings" to={routes?.toOrgSettings?.() || ''} icon="settings" end />
            </Sidebar.Group>

            <Sidebar.Separator />

            <Sidebar.Group>
              <Sidebar.Item
                title={t('component:navbar.sidebarToggle.switchToCodeV1', 'Switch to Code V1')}
                icon="arrow-left"
                onClick={() => {
                  const currentUrl = window.location.href
                  const updatedUrl = currentUrl.replace('/codev2', '/code')
                  window.location.href = updatedUrl
                }}
              />
            </Sidebar.Group>
          </Sidebar.Content>

          <Sidebar.Footer>
            <Sidebar.ToggleMenuButton />
            <Sidebar.Separator />
            <AppSidebarUser
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
        setTheme={newTheme => {
          const effectiveTheme = (newTheme ?? '').startsWith('dark') ? 'Dark' : 'Light'
          setMFETheme(effectiveTheme)
        }}
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
