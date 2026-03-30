import '@harnessio/ui/styles.css'
import './App.css'

import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

import {
  Drawer,
  Input,
  Layout,
  Sidebar,
  Text,
  TooltipProvider,
  useSidebar,
  type DrawerContentProps,
  type SidebarItemProps
} from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'
import {
  defaultTheme,
  DialogProvider,
  RouterContextProvider,
  ThemeProvider,
  TranslationProvider,
  type FullTheme
} from '@harnessio/ui/context'

import { Header } from './header'

const LIGHT_THEME = 'light-std-std' as FullTheme

const workspaceSwitcher = {
  to: '/',
  title: 'Harness',
  description: 'default',
  logo: 'harness' as const,
  withRightIndicator: true as const
}

const pinnedHomeItem: SidebarItemProps = { to: '/home', title: 'Home', icon: 'view-grid' }

const moreMenuSearchPlaceholder = 'Search'

const moreMenuDrawerSections = [
  {
    groupId: 'modules',
    label: 'Modules',
    items: [
      { to: '/drawer/pipelines', title: 'Pipelines', icon: 'pipeline' as const },
      { to: '/drawer/deployments', title: 'Deployments', icon: 'deployments' as const },
      { to: '/drawer/builds', title: 'Builds', icon: 'builds' as const },
      { to: '/drawer/security-tests', title: 'Security tests', icon: 'security-tests' as const }
    ]
  },
  {
    groupId: 'resources',
    label: 'Resources',
    items: [
      { to: '/drawer/agents', title: 'Agents', icon: 'agents' as const },
      { to: '/drawer/dashboards', title: 'Dashboards', icon: 'dashboard' as const },
      { to: '/drawer/repositories', title: 'Repositories', icon: 'repository' as const },
      { to: '/drawer/templates', title: 'Templates', icon: 'templates' as const },
      { to: '/settings', title: 'Settings', icon: 'settings' as const }
    ]
  }
] as const

const moreMenuTriggerTitle = 'more'

const moreDrawerDirection = 'left' as const
const moreMenuIconName = 'menu-more-horizontal' as const
const moreDrawerBodyContentClass = 'more-drawer'
const moreDrawerNavRowClass = 'more-drawer-row'
const moreDrawerLayoutColumn = 'column' as const
const moreDrawerLayoutGap = 'none' as const
const moreDrawerSearchInputIcon = 'search' as const
const moreDrawerInputWrapperClass = 'w-full'

const recentSectionLabel = 'Recent'

const demoItems: SidebarItemProps[] = [
  { to: '/repos', title: 'Repositories', icon: 'folder' },
  { to: '/pipelines', title: 'Pipelines', icon: 'play' },
  { to: '/connectors', title: 'Connectors', icon: 'connectors', active: true },
  {
    to: '/account',
    title: 'Account',
    icon: 'user'
  },
  { to: '/settings', title: 'Settings', icon: 'settings' }
]

const infrastructureNav = {
  parent: { title: 'Infrastructure', icon: 'infrastructure' as const },
  subItems: [
    { to: '/infra/clusters', title: 'Clusters' },
    { to: '/infra/environments', title: 'Environments' }
  ]
} as const

const submenuInsertAfterTitle = demoItems.find(i => 'to' in i && i.to === '/connectors')?.title ?? ''

const footerUserNav = {
  to: '/profile',
  title: 'jane-doe',
  avatarFallback: 'Jane Doe',
  withRightIndicator: true as const
} as const

const Shell: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === 'collapsed'
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  const gridColumns = isSidebarCollapsed
    ? 'var(--cn-sidebar-container-min-width) 1fr'
    : 'var(--cn-sidebar-container-full-width) 1fr'

  const moreMenuDrawerContentProps: DrawerContentProps = useMemo(
    () => ({
      className: cn('cn-sidebar-drawer-content z-20 overflow-x-hidden rounded', {
        'cn-sidebar-menu-drawer-content-collapsed': isSidebarCollapsed
      }),
      overlayClassName: cn('bg-transparent z-20 opacity-0', {
        'cn-sidebar-drawer-overlay-collapsed': isSidebarCollapsed
      }),
      size: 'xs',
      modal: false,
      hideClose: true,
      onPointerDownOutside: () => setMoreMenuOpen(false)
    }),
    [isSidebarCollapsed]
  )

  return (
    <RouterContextProvider
      Link={Link}
      NavLink={NavLink}
      Outlet={Outlet}
      location={location}
      navigate={navigate}
      useSearchParams={useSearchParams}
      useMatches={useMatches}
      useParams={useParams}
    >
      <div className="bg-cn-0 flex min-h-screen w-full flex-col">
        <Header />
        <Layout.Grid
          columns={gridColumns}
          className="min-h-0 w-full flex-1 transition-all duration-200 ease-in-out"
        >
          <div className="sidebar-app-shell h-full min-h-0">
            <Sidebar.Root className="sidebar-app-figma">
              <Sidebar.Header className="sidebar-app-sidebar-header">
                <Sidebar.Item {...workspaceSwitcher} />
              </Sidebar.Header>

              <Sidebar.Group className="sidebar-app-sidebar-group-pinned">
                <Sidebar.Item {...pinnedHomeItem} />
                <Drawer.Root direction={moreDrawerDirection} open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
                  <Sidebar.Item
                    title={moreMenuTriggerTitle}
                    icon={moreMenuIconName}
                    withRightIndicator
                    onClick={() => setMoreMenuOpen(true)}
                  />
                  <Drawer.Content {...moreMenuDrawerContentProps}>
                    <Drawer.Title className="sr-only">{moreMenuTriggerTitle}</Drawer.Title>
                    <Drawer.Description className="sr-only">{moreMenuTriggerTitle}</Drawer.Description>
                    <Drawer.Body classNameContent={moreDrawerBodyContentClass}>
                      <Layout.Flex direction={moreDrawerLayoutColumn} gap={moreDrawerLayoutGap}>
                        <div className="more-drawer-search">
                          <Input
                            id="more-menu-search"
                            inputIconName={moreDrawerSearchInputIcon}
                            placeholder={moreMenuSearchPlaceholder}
                            wrapperClassName={moreDrawerInputWrapperClass}
                            aria-label={moreMenuSearchPlaceholder}
                          />
                        </div>
                        <Sidebar.Separator />
                        {moreMenuDrawerSections.map((section, sectionIndex) => (
                          <Fragment key={section.groupId}>
                            <Sidebar.Group label={section.label} className="more-drawer-group">
                              {section.items.map(item => (
                                <Drawer.Close key={item.title} asChild>
                                  <Sidebar.Item {...item} className={moreDrawerNavRowClass} />
                                </Drawer.Close>
                              ))}
                            </Sidebar.Group>
                            {sectionIndex < moreMenuDrawerSections.length - 1 ? <Sidebar.Separator /> : null}
                          </Fragment>
                        ))}
                      </Layout.Flex>
                    </Drawer.Body>
                  </Drawer.Content>
                </Drawer.Root>
              </Sidebar.Group>

              <Sidebar.Separator />

              <Sidebar.Content>
                <Sidebar.Group label={recentSectionLabel} className="sidebar-app-sidebar-group-recent">
                  {demoItems.map(item => (
                    <Fragment key={item.title}>
                      <Sidebar.Item {...item} />
                      {item.title === submenuInsertAfterTitle ? (
                        <Sidebar.Item {...infrastructureNav.parent} defaultSubmenuOpen>
                          {infrastructureNav.subItems.map(sub => (
                            <Sidebar.MenuSubItem key={sub.to} {...sub} />
                          ))}
                        </Sidebar.Item>
                      ) : null}
                    </Fragment>
                  ))}
                </Sidebar.Group>
              </Sidebar.Content>

              <Sidebar.Footer className="sidebar-app-sidebar-footer">
                <Sidebar.Item {...footerUserNav} />
              </Sidebar.Footer>
            </Sidebar.Root>
          </div>
          <Sidebar.Rail animate className="top-cn-xs rounded-tl-cn-6 rounded-bl-cn-6 bottom-cn-xs w-5" />
          <Sidebar.Inset className="w-full">
            <Layout.Flex justify="center" align="center" className="h-full w-full">
              <Text variant="body-normal">Chat</Text>
            </Layout.Flex>
          </Sidebar.Inset>
        </Layout.Grid>
      </div>
    </RouterContextProvider>
  )
}

const App: FC = () => {
  const [theme, setTheme] = useState<FullTheme>(defaultTheme)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  const isLight = theme === LIGHT_THEME

  return (
    <ThemeProvider theme={theme} setTheme={setTheme} isLightTheme={isLight}>
      <TranslationProvider>
        <TooltipProvider>
          <DialogProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="*"
                  element={
                    <Sidebar.Provider>
                      <Shell />
                    </Sidebar.Provider>
                  }
                />
              </Routes>
            </BrowserRouter>
          </DialogProvider>
        </TooltipProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default App
