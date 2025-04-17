import { FC } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import ViewPreview from '@/pages/view-preview/view-preview'
import { useThemeStore } from '@utils/theme-utils'

import { ThemeProvider } from '@harnessio/ui/context'

import AppRouterProvider from './AppRouterProvider'

const router = createBrowserRouter([
  {
    element: <AppRouterProvider />,
    children: [
      { path: '/view-preview/*', element: <ViewPreview /> },
      { path: '/*', element: <Navigate to="/view-preview" /> }
    ]
  }
])

const App: FC = () => {
  const themeStore = useThemeStore()

  return (
    <ThemeProvider {...themeStore}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
