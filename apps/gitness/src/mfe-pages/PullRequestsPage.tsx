import { useEffect, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { Toast, TooltipProvider } from '@harnessio/ui/components'
import { ComponentProvider, PortalProvider, TranslationProvider } from '@harnessio/ui/context'

import ShadowRootWrapper from '../components-v2/shadow-root-wrapper'
import { ExitConfirmProvider } from '../framework/context/ExitConfirmContext'
import { MFEContext, MFEContextProps } from '../framework/context/MFEContext'
import { NavigationProvider } from '../framework/context/NavigationContext'
import { ThemeProvider, useThemeStore } from '../framework/context/ThemeContext'
import { queryClient } from '../framework/queryClient'
import { useLoadMFEStyles } from '../hooks/useLoadMFEStyles'
import i18n from '../i18n/i18n'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { RbacButton } from '../framework/rbac/rbac-button'
import { RbacSplitButton } from '../framework/rbac/rbac-split-button'
import ProjectPullRequestListPage from '../pages-v2/project/pull-request/pull-request-list'

interface PullRequestsPageProps extends MFEContextProps {
  on401?: () => void
  useMFEThemeContext: () => { theme: string; setTheme: (newTheme: string) => void }
}

function decode<T = unknown>(arg: string): T {
  return JSON.parse(decodeURIComponent(atob(arg)))
}

export default function PullRequestsPage({
  scope,
  renderUrl,
  parentContextObj,
  on401,
  useMFEThemeContext,
  parentLocationPath,
  onRouteChange,
  customHooks,
  customUtils,
  routes,
  routeUtils,
  hooks
}: PullRequestsPageProps) {
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
  const { theme, setTheme: setMFETheme } = useMFEThemeContext()
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
  const { t } = useTranslationStore()

  return (
    <div ref={shadowRef} id="code-mfe-pull-requests">
      <ShadowRootWrapper>
        <div className={theme.toLowerCase()} ref={portalRef}>
          {!isStylesLoaded ? (
            <ShadowRootLoader theme={theme} />
          ) : (
            <PortalProvider portalContainer={portalContainer}>
              <MFEContext.Provider
                value={{
                  scope,
                  renderUrl,
                  parentContextObj,
                  customHooks,
                  customUtils,
                  routes,
                  routeUtils,
                  hooks,
                  setMFETheme,
                  parentLocationPath,
                  onRouteChange
                }}
              >
                <I18nextProvider i18n={i18n}>
                  <ThemeProvider defaultTheme={theme === 'Light' ? 'light-std-std' : 'dark-std-std'}>
                    <TranslationProvider t={t}>
                      <QueryClientProvider client={queryClient}>
                        <Toast.Provider>
                          <TooltipProvider>
                            <ExitConfirmProvider>
                              <NavigationProvider routes={[]}>
                                <ComponentProvider components={{ RbacButton, RbacSplitButton }}>
                                  <ProjectPullRequestListPage />
                                </ComponentProvider>
                              </NavigationProvider>
                            </ExitConfirmProvider>
                          </TooltipProvider>
                        </Toast.Provider>
                      </QueryClientProvider>
                    </TranslationProvider>
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
        <p className="loading-text">Loading pull requests...</p>
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