import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { NgManagerSwaggerServiceAPIClient } from '@harnessio/react-ng-manager-swagger-service-client'
import { NGManagerServiceAPIClient } from '@harnessio/react-ng-manager-v2-client'

import { MFEWrapper } from '@harnessio/mfe-wrapper'
import type { MFEContextProps } from '@harnessio/mfe-wrapper'

import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { queryClient } from './framework/queryClient'
import { getMFERoutes } from './routes'

import './styles.css'

interface AppMFEProps extends MFEContextProps {
  on401?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parentContextObj: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customUtils: any
}

function decode<T = unknown>(arg: string): T {
  return JSON.parse(decodeURIComponent(atob(arg)))
}

export default function AppMFE({
  scope,
  renderUrl,
  parentContextObj,
  on401,
  parentLocationPath,
  onRouteChange,
  customHooks,
  customUtils,
  routes,
  routeUtils,
  hooks,
  isPublicAccessEnabledOnResources,
  isCurrentSessionPublic
}: AppMFEProps) {
  const createClientConfig = (basePath: string) => ({
    urlInterceptor: (url: string) =>
      `${window.apiUrl || ''}${basePath}${url}${url.includes('?') ? '&' : '?'}routingId=${scope.accountId}`,
    requestInterceptor: (request: Request) => {
      if (isCurrentSessionPublic) return request

      const token = decode(localStorage.getItem('token') || '')
      const newRequest = request.clone()
      newRequest.headers.set('Authorization', `Bearer ${token}`)
      return newRequest
    },
    responseInterceptor: (response: Response) => {
      switch (response.status) {
        case 401:
          if (!isCurrentSessionPublic) on401?.()
          break
      }
      return response
    }
  })

  new CodeServiceAPIClient(createClientConfig('/code/api/v1'))
  new NGManagerServiceAPIClient(createClientConfig('/ng/api'))
  new NgManagerSwaggerServiceAPIClient(createClientConfig('/ng/api'))

  // Router Configuration
  const basename = `/ng${renderUrl}`

  const mfeRoutes = getMFERoutes(scope.projectIdentifier)

  const router = createBrowserRouter(mfeRoutes, { basename })

  const mfeWrapperProps = {
    customHooks,
    customUtils,
    hooks,
    scope,
    renderUrl,
    parentContextObj,
    routes,
    routeUtils,
    parentLocationPath,
    onRouteChange,
    isPublicAccessEnabledOnResources,
    isCurrentSessionPublic,
    customPromises: {}
  }

  return (
    <MFEWrapper {...(mfeWrapperProps as any)}>
      <QueryClientProvider client={queryClient}>
        <ExitConfirmProvider>
          <NavigationProvider routes={mfeRoutes}>
            <RouterProvider router={router} key={renderUrl} />
          </NavigationProvider>
        </ExitConfirmProvider>
      </QueryClientProvider>
    </MFEWrapper>
  )
}