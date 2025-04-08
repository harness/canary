import { FC } from 'react'

import { noop } from 'lodash-es'

import { HarnessLogo, Icon, Sidebar, User } from '@harnessio/ui/components'
import { useRouterContext } from '@harnessio/ui/context'

import { useAppContext } from '../framework/context/AppContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'

const AppSidebar: FC = () => {
  const { currentUser } = useAppContext()
  const { t } = useTranslationStore()
  const { NavLink } = useRouterContext()
  const collapsed = false
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
                <Sidebar.MenuItem>
                  <NavLink className="block" to={'/repos'} end>
                    {({ isActive }) => (
                      <Sidebar.MenuButton asChild isActive={isActive}>
                        <Sidebar.MenuItemText
                          text={'Repositories'}
                          icon={<Icon name={'repositories-gradient'} size={14} />}
                          active={isActive}
                        />
                      </Sidebar.MenuButton>
                    )}
                  </NavLink>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <NavLink className="block" to={'/search'} end>
                    {({ isActive }) => (
                      <Sidebar.MenuButton asChild isActive={isActive}>
                        <Sidebar.MenuItemText
                          text={'Search'}
                          icon={<Icon name={'repositories-gradient'} size={14} />}
                          active={isActive}
                        />
                      </Sidebar.MenuButton>
                    )}
                  </NavLink>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <NavLink className="block" to={'/pull-requests'} end>
                    {({ isActive }) => (
                      <Sidebar.MenuButton asChild isActive={isActive}>
                        <Sidebar.MenuItemText
                          text={'Pull Requests'}
                          icon={<Icon name={'repositories-gradient'} size={14} />}
                          active={isActive}
                        />
                      </Sidebar.MenuButton>
                    )}
                  </NavLink>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <NavLink className="block" to={'/manage-repos'} end>
                    {({ isActive }) => (
                      <Sidebar.MenuButton asChild isActive={isActive}>
                        <Sidebar.MenuItemText
                          text={'Manage Repositories'}
                          icon={<Icon name={'repositories-gradient'} size={14} />}
                          active={isActive}
                        />
                      </Sidebar.MenuButton>
                    )}
                  </NavLink>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Group className="border-t">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <NavLink className="block" to={'/project-settings'} end>
                    {({ isActive }) => (
                      <Sidebar.MenuButton asChild isActive={isActive}>
                        <Sidebar.MenuItemText
                          text={'Project Settings'}
                          icon={<Icon name={'repositories-gradient'} size={14} />}
                          active={isActive}
                        />
                      </Sidebar.MenuButton>
                    )}
                  </NavLink>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Group className="border-t">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <NavLink className="block" to={'/account-settings'} end>
                    {({ isActive }) => (
                      <Sidebar.MenuButton asChild isActive={isActive}>
                        <Sidebar.MenuItemText
                          text={'Account Settings'}
                          icon={<Icon name={'repositories-gradient'} size={14} />}
                          active={isActive}
                        />
                      </Sidebar.MenuButton>
                    )}
                  </NavLink>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <NavLink className="block" to={'/account-settings'} end>
                    {({ isActive }) => (
                      <Sidebar.MenuButton asChild isActive={isActive}>
                        <Sidebar.MenuItemText
                          text={'Organization Settings'}
                          icon={<Icon name={'repositories-gradient'} size={14} />}
                          active={isActive}
                        />
                      </Sidebar.MenuButton>
                    )}
                  </NavLink>
                </Sidebar.MenuItem>
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
