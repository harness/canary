import { FC } from 'react'
import {
  createBrowserRouter,
  Link,
  Navigate,
  NavLink,
  Outlet,
  RouterProvider,
  useMatches,
  useSearchParams
} from 'react-router-dom'

import ComponentPage from '@/pages/component-page'
import ViewPreview from '@/pages/view-preview/view-preview'
import DocsLayout from '@components/docs-layout/docs-layout'
import { useThemeStore } from '@utils/theme-utils'

import { RouterContextProvider, ThemeProvider } from '@harnessio/ui/context'

const router = createBrowserRouter([
  { path: '/view-preview/*', element: <ViewPreview /> },
  { path: '/docs/*', element: <DocsLayout />, children: [{ path: 'components/*', element: <ComponentPage /> }] },
  { path: '/*', element: <Navigate to="/docs" /> }
])

const App: FC = () => {
  const themeStore = useThemeStore()

  return (
    <ThemeProvider {...themeStore}>
      <RouterContextProvider
        Link={Link}
        NavLink={NavLink}
        Outlet={Outlet}
        navigate={router.navigate}
        location={{ ...window.location, state: {}, key: '' }}
        useSearchParams={useSearchParams}
        useMatches={useMatches}
      >
        <RouterProvider router={router} />
      </RouterContextProvider>
    </ThemeProvider>
  )
}

export default App
