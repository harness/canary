import '@harnessio/ui/styles.css'

import { FC, Fragment, useEffect, useState } from 'react'
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

import { Layout, Sidebar, Text, TooltipProvider, useSidebar, type SidebarItemProps } from '@harnessio/ui/components'
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

const demoItems: SidebarItemProps[] = [
  { to: '/repos', title: 'Repositories', icon: 'folder' },
  { to: '/pipelines', title: 'Pipelines', icon: 'play' },
  { to: '/connectors', title: 'Connectors', icon: 'connectors', active: true },
  {
    to: '/account',
    title: 'Account',
    icon: 'user'
  },
  { to: '/settings', title: 'Settings', icon: 'settings' },
  { to: '', title: 'More', icon: 'menu-more-horizontal', withRightIndicator: true }
]

const infrastructureNav = {
  parent: { title: 'Infrastructure', icon: 'infrastructure' as const },
  subItems: [
    { to: '/infra/clusters', title: 'Clusters' },
    { to: '/infra/environments', title: 'Environments' }
  ]
} as const

const submenuInsertAfterTitle =
  demoItems.find(i => 'to' in i && i.to === '/connectors')?.title ?? ''

const Shell: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === 'collapsed'

  const gridColumns = isSidebarCollapsed
    ? 'var(--cn-sidebar-container-min-width) 1fr'
    : 'var(--cn-sidebar-container-full-width) 1fr'

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
        <Layout.Grid columns={gridColumns} className="w-full flex-1 transition-all duration-200 ease-in-out">
          <Sidebar.Root className="cn-sidebar-content-height">
            <Sidebar.Content>
              <Sidebar.Group>
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
          </Sidebar.Root>
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
