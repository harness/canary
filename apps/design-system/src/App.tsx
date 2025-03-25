import { FC, useEffect, useState } from 'react'
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
  const [isInset, setIsInset] = useState<boolean>(false)
  const themeStore = useThemeStore()

  /**
   * Set inset on mount and listen for changes in ViewSettings
   */
  useEffect(() => {
    const setInset = () => {
      const inset = sessionStorage.getItem('view-preview-is-inset')
      setIsInset(inset === 'true')
    }

    setInset()
    window.addEventListener('storageChange', setInset)

    return () => window.removeEventListener('storageChange', setInset)
  }, [])

  return (
    <ThemeProvider {...{ ...themeStore, isInset }}>
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
