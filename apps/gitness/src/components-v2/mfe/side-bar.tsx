import { FC } from 'react'

import { noop } from 'lodash-es'

import { HarnessLogo, Icon, Sidebar, User } from '@harnessio/ui/components'
import { useRouterContext } from '@harnessio/ui/context'

import { useAppContext } from '../../framework/context/AppContext'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const AppSidebar: FC = () => {
  const { currentUser } = useAppContext()
  const { t } = useTranslationStore()
  const { NavLink } = useRouterContext()
  const collapsed = false

  const renderMenuItem = (to: string, text: string) => (
    <Sidebar.MenuItem>
      <NavLink className="block" to={to} end>
        {({ isActive }) => (
          <Sidebar.MenuButton asChild isActive={isActive}>
            <Sidebar.MenuItemText
              text={text}
              icon={<Icon name="repositories-gradient" size={14} />}
              active={isActive}
            />
          </Sidebar.MenuButton>
        )}
      </NavLink>
    </Sidebar.MenuItem>
  )

  return (
    <Sidebar.Provider className="min-h-svh">
      <Sidebar.Root className="fixed z-20 h-svh">
        <Sidebar.Header className="pb-3">
          <div className="my-5 flex items-center pl-2">
            <HarnessLogo />
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {renderMenuItem('/repos', 'Repositories')}
                {renderMenuItem('/search', 'Search')}
                {renderMenuItem('/pull-requests', 'Pull Requests')}
                {renderMenuItem('/manage-repos', 'Manage Repositories')}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Group className="border-t">
            <Sidebar.GroupContent>
              <Sidebar.Menu>{renderMenuItem('/project-settings', 'Project Settings')}</Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Group className="border-t">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {renderMenuItem('/account-settings', 'Account Settings')}
                {renderMenuItem('/organization-settings', 'Organization Settings')}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton onClick={noop}>
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
        <Sidebar.Footer className="border-t border-sidebar-border-1 px-1.5 transition-[padding] duration-150 ease-linear group-data-[state=collapsed]:px-2">
          <User user={currentUser} openThemeDialog={noop} openLanguageDialog={noop} handleLogOut={noop} t={t} />
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar.Root>
    </Sidebar.Provider>
  )
}

export { AppSidebar }
