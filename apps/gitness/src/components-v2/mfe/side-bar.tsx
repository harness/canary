import { FC } from 'react'

import { noop } from 'lodash-es'

import { HarnessLogo, Icon, IconProps, Sidebar, SidebarSearchLegacy, User, useSidebar } from '@harnessio/ui/components'
import { useRouterContext, useTranslation } from '@harnessio/ui/context'

import { useAppContext } from '../../framework/context/AppContext'
import { useMFEContext } from '../../framework/hooks/useMFEContext'

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
          icon={<Icon name={collapsed ? 'sidebar-right' : 'sidebar-left'} size={14} />}
        />
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  )
}

const AppSidebar: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAppContext()
  const { t } = useTranslation()
  const { NavLink } = useRouterContext()
  const { routes, hooks } = useMFEContext()
  const { forceLogout } = hooks?.useLogout?.() || {}

  const renderMenuItem = ({ to, text, iconName }: { to: string; text: string; iconName: IconProps['name'] }) => (
    <Sidebar.MenuItem>
      <NavLink className="block" to={to} end>
        {({ isActive }) => (
          <Sidebar.MenuButton asChild isActive={isActive}>
            <Sidebar.MenuItemText text={text} icon={<Icon name={iconName} size={14} />} active={isActive} />
          </Sidebar.MenuButton>
        )}
      </NavLink>
    </Sidebar.MenuItem>
  )

  return (
    <Sidebar.Provider className="min-h-svh">
      <Sidebar.Root className="h-svh">
        <Sidebar.Header className="pb-3">
          <SidebarSearchLegacy logo={<HarnessLogo />} />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {renderMenuItem({ to: '/repos', text: 'Repositories', iconName: 'repositories-gradient' })}
                {renderMenuItem({ to: '/manage-repositories', text: 'Manage Repositories', iconName: 'repositories' })}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Group className="border-t">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {renderMenuItem({
                  to: routes?.toProjectSettings?.() || '',
                  text: 'Project Settings',
                  iconName: 'settings-1'
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
                  iconName: 'settings-1'
                })}
                {renderMenuItem({
                  to: routes?.toOrgSettings?.() || '',
                  text: 'Organization Settings',
                  iconName: 'settings-2'
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
                  icon={<Icon name="arrow-left" size={14} />}
                />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <SideBarToggleMenuItem />
          </Sidebar.Menu>
        </Sidebar.Group>
        <Sidebar.Footer className="border-t border-sidebar-border-1 px-1.5 transition-[padding] duration-150 ease-linear group-data-[state=collapsed]:px-2">
          <User
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
