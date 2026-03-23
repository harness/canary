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

import { Sidebar, TooltipProvider, type SidebarItemProps } from '@harnessio/ui/components'
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
      <Sidebar.Provider defaultOpen className="bg-cn-0">
        <Sidebar.Root>
          <Sidebar.Content>
            <Sidebar.Group>
              {demoItems.map(item => (
                <Sidebar.Item key={item.title} {...item} />
              ))}
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
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
              <Route path="*" element={<Shell />} />
            </Routes>
          </BrowserRouter>
        </DialogProvider>
      </TooltipProvider>
    </TranslationProvider>
  </ThemeProvider>
)

export default App
