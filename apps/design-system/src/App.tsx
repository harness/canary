import { FC, useEffect, useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import ComponentPage from '@/pages/component-page'
import ViewPreview from '@/pages/view-preview/view-preview'
import DocsLayout from '@components/docs-layout/docs-layout'
import { useThemeStore } from '@utils/theme-utils'

import { ThemeProvider } from '@harnessio/ui/context'

import AppRouterProvider from './AppRouterProvider'

const router = createBrowserRouter([
  {
    element: <AppRouterProvider />,
    children: [
      { path: '/view-preview/*', element: <ViewPreview /> },
      { path: '/docs/*', element: <DocsLayout />, children: [{ path: 'components/*', element: <ComponentPage /> }] },
      { path: '/*', element: <Navigate to="/docs" /> }
    ]
  }
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
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
