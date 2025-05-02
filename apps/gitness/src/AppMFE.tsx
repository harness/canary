import { useEffect, useMemo, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, matchPath, RouterProvider, useLocation, useNavigate } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { Toast, Tooltip } from '@harnessio/ui/components'
import { PortalProvider } from '@harnessio/ui/context'

import ShadowRootWrapper from './components-v2/shadow-root-wrapper'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { Hooks, MFEContext, Scope, Unknown } from './framework/context/MFEContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { ThemeProvider, useThemeStore } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import { extractRedirectRouteObjects } from './framework/routing/utils'
import { useLoadMFEStyles } from './hooks/useLoadMFEStyles'
import i18n from './i18n/i18n'
import { mfeRoutes, repoRoutes } from './routes'
import { decodeURIComponentIfValid } from './utils/path-utils'

export interface MFERouteRendererProps {
  renderUrl: string
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}

const filteredRedirectRoutes = extractRedirectRouteObjects(repoRoutes)
const isRouteNotMatchingRedirectRoutes = (pathToValidate: string) => {
  return filteredRedirectRoutes.every(route => !matchPath(`/${route.path}` as string, pathToValidate))
}

function MFERouteRenderer({ renderUrl, parentLocationPath, onRouteChange }: MFERouteRendererProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const parentPath = parentLocationPath.replace(renderUrl, '')
  const isNotRedirectPath = isRouteNotMatchingRedirectRoutes(location.pathname)

  /**
   * renderUrl ==> base URL of parent application
   * parentPath ==> path name of parent application after base URL
   * location.pathname ==> path name of MFE
   * isNotRedirectPath ==> check if the current path is not a redirect path
   */
  const canNavigate = useMemo(
    () =>
      renderUrl &&
      decodeURIComponentIfValid(parentPath) !== decodeURIComponentIfValid(location.pathname) &&
      isNotRedirectPath,
    [isNotRedirectPath, location.pathname, parentPath, renderUrl]
  )

  // Handle location change detected from parent route
  useEffect(() => {
    if (canNavigate) {
      navigate(decodeURIComponentIfValid(parentPath), { replace: true })
    }
  }, [parentPath])

  // Notify parent about route change
  useEffect(() => {
    if (canNavigate) {
      onRouteChange?.(decodeURIComponentIfValid(`${renderUrl}${location.pathname}`))
    }
  }, [location.pathname])

  return null
}

interface AppMFEProps {
  scope: Scope
  renderUrl: string
  on401?: () => void
  useMFEThemeContext: () => { theme: string }
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
  customHooks: Partial<{
    useGenerateToken: Unknown
  }>
  customUtils: Partial<{
    navigateToUserProfile: Unknown
  }>
  customPromises: Partial<{
    getCurrentUser: Promise<Unknown>
  }>
  routes: Partial<{
    toAccountSettings: () => string
    toOrgSettings: () => string
    toProjectSettings: () => string
  }>
  hooks: Hooks
}

function decode<T = unknown>(arg: string): T {
  return JSON.parse(decodeURIComponent(atob(arg)))
}

export default function AppMFE({
  scope,
  renderUrl,
  on401,
  useMFEThemeContext,
  parentLocationPath,
  onRouteChange,
  customHooks,
  customUtils,
  customPromises,
  routes,
  hooks
}: AppMFEProps) {
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

  // Apply host theme to MFE
  const { theme } = useMFEThemeContext()
  const { setTheme } = useThemeStore()

  useEffect(() => {
    if (theme === 'Light') {
      setTheme('light-std-std')
    } else {
      setTheme('dark-std-std')
    }
  }, [theme])

  // Styles will be loaded inside shadowRoot
  const shadowRef = useRef<HTMLDivElement>(null)
  const shadowRoot = shadowRef.current?.shadowRoot

  // Radix UI elements will be rendered inside portalContainer
  const portalRef = useRef<HTMLDivElement>(null)
  const portalContainer = portalRef.current

  const isStylesLoaded = useLoadMFEStyles(shadowRoot)

  // Router Configuration
  const basename = `/ng${renderUrl}`

  const routesToRender = mfeRoutes(
    scope.projectIdentifier,
    <MFERouteRenderer renderUrl={renderUrl} onRouteChange={onRouteChange} parentLocationPath={parentLocationPath} />
  )

  const router = createBrowserRouter(routesToRender, { basename })

  return (
    <div ref={shadowRef}>
      <ShadowRootWrapper>
        {/* Radix UI elements need to be rendered inside the following div with the theme class */}
        <div className={theme.toLowerCase()} ref={portalRef}>
          {!isStylesLoaded ? (
            // Replace it with spinner once it is available
            <ShadowRootLoader theme={theme} />
          ) : (
            <PortalProvider portalContainer={portalContainer}>
              <MFEContext.Provider
                value={{
                  scope,
                  renderUrl,
                  customHooks,
                  customUtils,
                  customPromises,
                  routes,
                  hooks
                }}
              >
                <I18nextProvider i18n={i18n}>
                  <ThemeProvider defaultTheme={theme === 'Light' ? 'light-std-std' : 'dark-std-std'}>
                    <QueryClientProvider client={queryClient}>
                      <Toast.Provider>
                        <Tooltip.Provider>
                          <ExitConfirmProvider>
                            <NavigationProvider routes={routesToRender}>
                              <RouterProvider router={router} />
                            </NavigationProvider>
                          </ExitConfirmProvider>
                        </Tooltip.Provider>
                      </Toast.Provider>
                    </QueryClientProvider>
                  </ThemeProvider>
                </I18nextProvider>
              </MFEContext.Provider>
            </PortalProvider>
          )}
        </div>
      </ShadowRootWrapper>
    </div>
  )
}

function ShadowRootLoader({ theme }: { theme: string }) {
  return (
    <>
      <div className="loading-container">
        <p className="loading-text">Loading, please wait...</p>
      </div>
      <style>
        {`
      @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .loading-text {
        color: ${theme === 'Light' ? '#000' : '#fff'};
        font-size: 16px;
        animation: blink 1s infinite;
      }
      `}
      </style>
    </>
  )
}
