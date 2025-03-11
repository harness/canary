import './styles/AppMFE.css'

import { useEffect, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Outlet, useMatches, useSearchParams } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { ToastProvider, Tooltip } from '@harnessio/ui/components'
import { PortalProvider, RouterContextProvider } from '@harnessio/ui/context'

import ShadowRootWrapper from './components-v2/shadow-root-wrapper'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { IMFEContext, MFEContext } from './framework/context/MFEContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { ThemeProvider, useThemeStore } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import { useLoadMFEStyles } from './hooks/useLoadMFEStyles'
import i18n from './i18n/i18n'
import { mfeRoutes } from './routes'
import { getAppRoutes } from './v5routes'

export interface MFERouteRendererProps {
  renderUrl: string
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}

interface AppMFEProps extends IMFEContext {
  /**
   * These types will be later referred from "ChildComponentProps" from @harness/microfrontends
   *  */

  renderUrl: string
  on401?: () => void
  useMFEThemeContext: () => { theme: string }
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}

function decode<T = unknown>(arg: string): T {
  return JSON.parse(decodeURIComponent(atob(arg)))
}

export default function AppMFE({
  scope,
  renderUrl,
  on401,
  useMFEThemeContext,
  customComponents,
  customHooks,
  customUtils
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

  const portalRef = useRef<HTMLDivElement>(null)
  const portalContainer = portalRef.current?.shadowRoot as Element | undefined

  const isStylesLoaded = useLoadMFEStyles(portalContainer)

  // Router Configuration
  const basename = `/ng${renderUrl}`

  const v6Routes = mfeRoutes(scope.projectIdentifier)

  const { Link, NavLink, Switch, Route, Redirect } = customComponents

  const v5AppRoutes = getAppRoutes({
    pathPrefix: renderUrl,
    Switch,
    Route,
    Redirect
  })

  return (
    <div ref={portalRef}>
      <ShadowRootWrapper>
        <div className={theme.toLowerCase()}>
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
                  customComponents
                }}
              >
                <I18nextProvider i18n={i18n}>
                  <ThemeProvider defaultTheme={theme === 'Light' ? 'light-std-std' : 'dark-std-std'}>
                    <QueryClientProvider client={queryClient}>
                      <ToastProvider>
                        <Tooltip.Provider>
                          <ExitConfirmProvider>
                            <NavigationProvider routes={v6Routes} pathPrefix={renderUrl}>
                              <RouterContextProvider
                                Link={Link}
                                NavLink={NavLink}
                                Outlet={Outlet}
                                location={{ ...window.location, state: {}, key: '' }}
                                navigate={customUtils.navigate}
                                useSearchParams={useSearchParams}
                                useMatches={useMatches}
                              >
                                {/* v6 */}
                                {/* <RouterProvider router={createBrowserRouter(routesV6, { basename })} /> */}
                                {/* v5 */}
                                <BrowserRouter basename={basename}>{v5AppRoutes}</BrowserRouter>
                              </RouterContextProvider>
                            </NavigationProvider>
                          </ExitConfirmProvider>
                        </Tooltip.Provider>
                      </ToastProvider>
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
