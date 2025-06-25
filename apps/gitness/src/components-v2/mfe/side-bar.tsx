import { FC } from 'react'

import { noop } from 'lodash-es'

import { AppSidebarUser, HarnessLogo, SearchProvider, Sidebar, SidebarSearch, Spacer } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { useAppContext } from '../../framework/context/AppContext'
import { useMFEContext } from '../../framework/hooks/useMFEContext'

const AppSidebar: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAppContext()
  const { t } = useTranslation()
  const { routes, hooks } = useMFEContext()
  const { forceLogout } = hooks?.useLogout?.() || {}

  return (
    <Sidebar.Provider>
      <Sidebar.Root>
        <Sidebar.Header>
          <SearchProvider>
            <SidebarSearch logo={<HarnessLogo />} />
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

          <Spacer size={2.5} />
          <Sidebar.Separator />
          <Spacer size={2.5} />

          <AppSidebarUser
            user={currentUser}
            openThemeDialog={noop}
            openLanguageDialog={noop}
            handleLogOut={forceLogout || noop}
          />
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar.Root>
      <Sidebar.Inset>{children}</Sidebar.Inset>
    </Sidebar.Provider>
  )
}

export { AppSidebar }
