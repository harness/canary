import { useRef } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { Button, SplitButton } from '@harnessio/ui/components'
import { ComponentProvider, PortalProvider } from '@harnessio/ui/context'

import { AppRouterProvider } from '../../framework/context/AppRouterProvider'
import { NavigationProvider } from '../../framework/context/NavigationContext'
import { queryClient } from '../../framework/queryClient'
import ReposListPage from './repo-list'

const RepoListMFE = ({ renderUrl }: { renderUrl: string }) => {
  // Router Configuration
  const basename = `/ng${renderUrl}`

  const routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <AppRouterProvider>
          <ComponentProvider components={{ RbacButton: Button, RbacSplitButton: SplitButton }}>
            <ReposListPage />
          </ComponentProvider>
        </AppRouterProvider>
      )
    }
  ]

  const router = createBrowserRouter(routes, { basename })

  // Radix UI elements will be rendered inside portalContainer
  const portalRef = useRef<HTMLDivElement>(null)
  const portalContainer = portalRef.current

  return (
    <PortalProvider portalContainer={portalContainer}>
      <QueryClientProvider client={queryClient}>
        <NavigationProvider routes={routes}>
          <RouterProvider router={router} />
        </NavigationProvider>
      </QueryClientProvider>
    </PortalProvider>
  )
}

export default RepoListMFE
