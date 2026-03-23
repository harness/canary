import '@harnessio/ui/styles.css'

import { FC } from 'react'
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

import { Layout, Sidebar, TooltipProvider, useSidebar, type SidebarItemProps } from '@harnessio/ui/components'
import {
  defaultTheme,
  DialogProvider,
  RouterContextProvider,
  ThemeProvider,
  TranslationProvider
} from '@harnessio/ui/context'

const demoItems: SidebarItemProps[] = [
  { to: '/repos', title: 'Repositories', icon: 'folder' },
  { to: '/pipelines', title: 'Pipelines', icon: 'play' },
  { to: '/connectors', title: 'Connectors', icon: 'connectors' },
  {
    to: '/account',
    title: 'Account',
    icon: 'user'
  },
  { to: '/settings', title: 'Settings', icon: 'settings' },
  { to: '', title: 'More', icon: 'menu-more-horizontal', withRightIndicator: true }
]

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
      <Layout.Grid columns={gridColumns} className="bg-cn-0 w-full transition-all duration-200 ease-in-out">
        <Sidebar.Root className="cn-sidebar-content-height">
          <Sidebar.Content>
            <Sidebar.Group>
              {demoItems.map(item => (
                <Sidebar.Item key={item.title} {...item} />
              ))}
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
        <Sidebar.Rail animate className="top-cn-xs w-5 rounded-tl-cn-6 rounded-bl-cn-6 bottom-cn-xs" />
      </Layout.Grid>
    </RouterContextProvider>
  )
}

const App: FC = () => (
  <ThemeProvider theme={defaultTheme} setTheme={() => {}} isLightTheme={false}>
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

export default App
