import './styles/AppMFE.css'

import { ComponentType } from 'react'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'

import { Unknown } from './framework/context/MFEContext'
import { CustomRouteObject } from './framework/routing/types'
import { routes as routesV2 } from './routesV2'

export interface MFERouteRendererProps {
  renderUrl: string
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}

interface AppMFEProps {
  /**
   * These types will be later referred from "ChildComponentProps" from @harness/microfrontends
   *  */
  scope: {
    accountId?: string
    orgIdentifier?: string
    projectIdentifier?: string
  }
  renderUrl: string
  on401?: () => void
  useMFEThemeContext: () => { theme: string }
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
  customComponents: {
    Link: ComponentType<any>
    NavLink: ComponentType<any>
    Route: ComponentType<any>
    Switch: ComponentType<any>
  }
  customHooks: Partial<{
    useLocation: any
    useGenerateToken: Unknown
    useRouteMatch: any
  }>
  customUtils: Partial<{
    navigate: (path: string | number) => void
    navigateToUserProfile: Unknown
  }>
}

function decode<T = unknown>(arg: string): T {
  return JSON.parse(decodeURIComponent(atob(arg)))
}

export default function AppMFE({ scope, renderUrl, on401, customComponents: { Switch, Route } }: AppMFEProps) {
  new CodeServiceAPIClient({
    urlInterceptor: (url: string) =>
      `${window.apiUrl || ''}/code/api/v1${url}${url.includes('?') ? '&' : '?'}routingId=${scope.accountId}`,
    requestInterceptor: (request: Request) => {
      const token = decode(localStorage.getItem('token') || '')
      const newRequest = request.clone()
      newRequest.headers.set('Authorization', `Bearer ${token}`)
      return newRequest
    },
    responseInterceptor: (response: Response) => {
      switch (response.status) {
        case 401:
          on401?.()
          break
      }
      return response
    }
  })

  const getV5Routes = (routes: CustomRouteObject[], renderUrl: string = ''): React.ReactNode => {
    return routes.map((route, index) => {
      const pathWithPrefix = route.index
        ? renderUrl // Keep parent URL for index routes
        : renderUrl
          ? `${renderUrl}/${route.path}`.replace(/\/+/g, '/') // Remove extra slashes, for routes ending with "/"
          : route.path

      return (
        <Route
          key={route.path || `index-${index}`}
          path={route.index ? renderUrl : pathWithPrefix}
          exact={route.index || !route.children}
          render={() => (
            <>
              {route.element}
              {route.children ? <Switch>{getV5Routes(route.children, pathWithPrefix)}</Switch> : null}
            </>
          )}
        />
      )
    })
  }

  const routes = getV5Routes(routesV2, renderUrl)
  return <Switch>{routes}</Switch>
}
