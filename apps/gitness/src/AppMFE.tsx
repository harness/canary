import './AppMFE.css'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, RouterProvider, useLocation, useNavigate } from 'react-router-dom'
import ReactShadowRoot from 'react-shadow-root'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import styles from '!!raw-loader!@harnessio/ui/styles.css'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { TooltipProvider } from '@harnessio/ui/components'
import { PortalProvider } from '@harnessio/ui/context'

import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { MFEContext } from './framework/context/MFEContext'
import { ThemeProvider, useThemeStore } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { routes } from './routes'

// const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

export interface MFERouteRendererProps {
  projectIdentifier: string | undefined
  renderUrl: string
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}
function MFERouteRenderer({ projectIdentifier, renderUrl, parentLocationPath, onRouteChange }: MFERouteRendererProps) {
  // Handle location change detected from parent route
  const navigate = useNavigate()
  useEffect(() => {
    if (renderUrl) {
      const pathToNavigate = parentLocationPath.replace(
        renderUrl.replace(`/projects/${projectIdentifier}`, '/projects'),
        ''
      )
      navigate(pathToNavigate, { replace: true })
    }
  }, [parentLocationPath])

  // Notify parent about route change
  const location = useLocation()
  useEffect(() => {
    if (location.pathname !== parentLocationPath) {
      onRouteChange?.(`${renderUrl.replace(`/projects/${projectIdentifier}`, '/projects')}${location.pathname}`)
    }
  }, [location])

  return <></>
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
      `${window.apiUrl || ''}/code/api/v1${url}${url.includes('?') ? '&' : '?'}routingId=dummy`,
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

  const { theme } = useMFEThemeContext()

  const { setTheme } = useThemeStore()
  useEffect(() => {
    if (theme === 'Light') {
      setTheme('light-std-std')
    } else {
      setTheme('dark-std-std')
    }
  }, [theme])

  // Router Configuration
  const basename = `/ng${renderUrl.replace(`/projects/${scope.projectIdentifier}`, '/projects')}`
  const router = createBrowserRouter(
    routes(
      scope.projectIdentifier,
      <MFERouteRenderer
        projectIdentifier={scope.projectIdentifier}
        renderUrl={renderUrl}
        onRouteChange={onRouteChange}
        parentLocationPath={parentLocationPath}
      />
    ),
    { basename }
  )

  const portalContainer = document.getElementById('gitness-shadow-root')?.shadowRoot

  return (
    <div id="gitness-shadow-root">
      <ReactShadowRoot>
        <style>{`${styles}`}</style>
        <PortalProvider portalContainer={portalContainer as Element | undefined}>
          <MFEContext.Provider value={{ scope, renderUrl }}>
            <AppProvider>
              <I18nextProvider i18n={i18n}>
                <ThemeProvider defaultTheme={theme === 'Light' ? 'light-std-std' : 'dark-std-std'}>
                  <QueryClientProvider client={queryClient}>
                    <TooltipProvider>
                      <ExitConfirmProvider>
                        <NuqsAdapter>
                          <RouterProvider router={router} />
                        </NuqsAdapter>
                      </ExitConfirmProvider>
                    </TooltipProvider>
                  </QueryClientProvider>
                </ThemeProvider>
              </I18nextProvider>
            </AppProvider>
          </MFEContext.Provider>
        </PortalProvider>
      </ReactShadowRoot>
    </div>
  )
}
