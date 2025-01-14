import './styles/AppMFE.css'

import { useEffect, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, RouterProvider, useLocation, useNavigate } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { TooltipProvider } from '@harnessio/ui/components'
import { PortalProvider } from '@harnessio/ui/context'

import ShadowRootWrapper from './components-v2/shadow-root-wrapper'
import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { MFEContext } from './framework/context/MFEContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { ThemeProvider, useThemeStore } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import { useLoadMFEStyles } from './hooks/useLoadMFEStyles'
import i18n from './i18n/i18n'
import { mfeRoutes } from './routes'

export interface MFERouteRendererProps {
  renderUrl: string
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}
function MFERouteRenderer({ renderUrl, parentLocationPath, onRouteChange }: MFERouteRendererProps) {
  // Handle location change detected from parent route
  const navigate = useNavigate()
  useEffect(() => {
    if (renderUrl) {
      const pathToNavigate = parentLocationPath.replace(renderUrl, '')
      navigate(pathToNavigate, { replace: true })
    }
  }, [parentLocationPath])

  // Notify parent about route change
  const location = useLocation()
  useEffect(() => {
    if (location.pathname !== parentLocationPath) {
      onRouteChange?.(`${renderUrl}${location.pathname}`)
    }
  }, [location])

  return null
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
  onRouteChange
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

  const routesToRender = mfeRoutes(
    scope.projectIdentifier,
    <MFERouteRenderer renderUrl={renderUrl} onRouteChange={onRouteChange} parentLocationPath={parentLocationPath} />
  )
  const router = createBrowserRouter(routesToRender, { basename })

  return (
    <div ref={portalRef}>
      <ShadowRootWrapper>
        {!isStylesLoaded ? (
          // Replace it with spinner once it is available
          <ShadowRootLoader theme={theme} />
        ) : (
          <PortalProvider portalContainer={portalContainer}>
            <MFEContext.Provider value={{ scope, renderUrl }}>
              <AppProvider>
                <I18nextProvider i18n={i18n}>
                  <ThemeProvider defaultTheme={theme === 'Light' ? 'light-std-std' : 'dark-std-std'}>
                    <QueryClientProvider client={queryClient}>
                      <TooltipProvider>
                        <ExitConfirmProvider>
                          <NuqsAdapter>
                            <NavigationProvider routes={routesToRender}>
                              <RouterProvider router={router} />
                            </NavigationProvider>
                          </NuqsAdapter>
                        </ExitConfirmProvider>
                      </TooltipProvider>
                    </QueryClientProvider>
                  </ThemeProvider>
                </I18nextProvider>
              </AppProvider>
            </MFEContext.Provider>
          </PortalProvider>
        )}
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
