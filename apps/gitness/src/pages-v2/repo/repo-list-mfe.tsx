import { useRef } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { Button, SplitButton } from '@harnessio/ui/components'
import { ComponentProvider, PortalProvider } from '@harnessio/ui/context'

import { ShadowRootLoader } from '../../AppMFE'
import ShadowRootWrapper from '../../components-v2/shadow-root-wrapper'
import { AppRouterProvider } from '../../framework/context/AppRouterProvider'
import { NavigationProvider } from '../../framework/context/NavigationContext'
import { queryClient } from '../../framework/queryClient'
import { useLoadMFEStyles } from '../../hooks/useLoadMFEStyles'
import ReposListPage from './repo-list'

const RepoListMFE = ({ renderUrl }: { renderUrl: string }) => {
  // Router Configuration
  const basename = `/ng${renderUrl}`

  const routes: RouteObject[] = [
    {
      path: 'repos',
      element: (
        <AppRouterProvider>
          <ComponentProvider components={{ RbacButton: Button, RbacSplitButton: SplitButton }}>
            <ReposListPage />
          </ComponentProvider>
        </AppRouterProvider>
      )
    }
  ]

  const theme = 'Light'

  const router = createBrowserRouter(routes, { basename })

  // Styles will be loaded inside shadowRoot
  const shadowRef = useRef<HTMLDivElement>(null)
  const shadowRoot = shadowRef.current?.shadowRoot

  // Radix UI elements will be rendered inside portalContainer
  const portalRef = useRef<HTMLDivElement>(null)
  const portalContainer = portalRef.current

  const isStylesLoaded = useLoadMFEStyles(shadowRoot) || true
  return (
    <div ref={shadowRef} id="repo-list-mfe-root">
      <ShadowRootWrapper>
        {/* Radix UI elements need to be rendered inside the following div with the theme class */}
        <div className={theme.toLowerCase()} ref={portalRef}>
          {!isStylesLoaded ? (
            // Replace it with spinner once it is available
            <ShadowRootLoader theme={theme} />
          ) : (
            <PortalProvider portalContainer={portalContainer}>
              <QueryClientProvider client={queryClient}>
                <NavigationProvider routes={routes}>
                  <RouterProvider router={router} />
                </NavigationProvider>
              </QueryClientProvider>
            </PortalProvider>
          )}
        </div>
      </ShadowRootWrapper>
    </div>
  )
}

export default RepoListMFE
