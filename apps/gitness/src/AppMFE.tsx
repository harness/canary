import './AppMFE.css'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, RouterProvider, useLocation, useNavigate } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import monacoStyles from '!!raw-loader!@harnessio/ui/monaco-styles.css'
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
  projectIdentifier?: string
  renderUrl: string
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}
function MFERouteRenderer({ projectIdentifier, renderUrl, parentLocationPath, onRouteChange }: MFERouteRendererProps) {
  // Handle location change detected from parent route
  const navigate = useNavigate()
  useEffect(() => {
    if (renderUrl) {
      const pathToNavigate = parentLocationPath.replace(replaceProjectPath(renderUrl, projectIdentifier), '')
      navigate(pathToNavigate, { replace: true })
    }
  }, [parentLocationPath])

  // Notify parent about route change
  const location = useLocation()
  useEffect(() => {
    if (location.pathname !== parentLocationPath) {
      onRouteChange?.(`${replaceProjectPath(renderUrl, projectIdentifier)}${location.pathname}`)
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

  // Handle redirects
  useEffect(() => {
    const redirectPath = getRedirectPath(renderUrl, scope)
    if (redirectPath) {
      onRouteChange?.(redirectPath)
    }
  }, [])

  // Router Configuration
  const basename = `/ng${replaceProjectPath(renderUrl, scope.projectIdentifier)}`
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

  const portalRef = useRef<HTMLDivElement>(null)
  const portalContainer = portalRef.current?.shadowRoot
  useEffect(() => {
    portalRef.current?.attachShadow({ mode: 'open' })
  }, [])

  return (
    <div id="gitness-shadow-root" ref={portalRef}>
      {portalContainer
        ? createPortal(
            <>
              <style>{`${styles}`}</style>
              <style>{`${monacoStyles}`}</style>

              <PortalProvider portalContainer={portalContainer as unknown as Element | undefined}>
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
            </>,
            portalContainer
          )
        : null}
    </div>
  )
}

function replaceProjectPath(renderUrl: string, projectIdentifier?: string): string {
  if (projectIdentifier) {
    return renderUrl.replace(`/projects/${projectIdentifier}`, '/projects')
  }
  return renderUrl
}

function getRedirectPath(
  url: string,
  scope: { accountId?: string; orgIdentifier?: string; projectIdentifier?: string }
): string | undefined {
  const removeTrailingSlash = (url: string) => url.replace(/\/$/, '')

  const redirectPaths = {
    [`/account/${scope.accountId}`]: '/home',
    [`/orgs/${scope.orgIdentifier}`]: '/settings',
    [`/projects/${scope.projectIdentifier}`]: '/repos'
  }

  for (const [key, redirect] of Object.entries(redirectPaths)) {
    if (url.endsWith(key)) {
      return `${removeTrailingSlash(url)}${redirect}`
    }
  }
}
