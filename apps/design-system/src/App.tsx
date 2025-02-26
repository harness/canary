import { FC } from 'react'
import { createBrowserRouter, Link, Navigate, RouterProvider } from 'react-router-dom'

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
      <RouterContextProvider Link={Link}>
        <RouterProvider router={router} />
      </RouterContextProvider>
    </ThemeProvider>
  )
}

export default App
