import { useEffect, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { NgManagerSwaggerServiceAPIClient } from '@harnessio/react-ng-manager-swagger-service-client'
import { NGManagerServiceAPIClient } from '@harnessio/react-ng-manager-v2-client'
import { TooltipProvider } from '@harnessio/ui/components'
import { DialogProvider, FullTheme, PortalProvider, ThemeProvider, TranslationProvider } from '@harnessio/ui/context'

import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { MFEContext, MFEContextProps } from './framework/context/MFEContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { useThemeStore } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { useTranslationStore } from './i18n/stores/i18n-store'
import { getMFERoutes } from './routes'

import './styles.css'

interface AppMFEProps extends MFEContextProps {
  on401?: () => void
  useMFEThemeContext: () => { theme: string; setTheme: (newTheme: string) => void }
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

  // Apply host theme to MFE
  const { theme, setTheme } = useThemeStore()

  // // TODO: This is a hack to get the theme from the host and apply it to the MFE. Need to implement a proper fix.
  useEffect(() => {
    const element = document.querySelector('html')

    /**
     * As we are wapping CodeV2 in MFEWrapper from PlatformUI,
     * this is required if CodeV2 is rendered in NGUI without PlatformUI.
     */
    element?.classList.add(theme ?? 'light-std-std')

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const oldClasses = new Set((mutation.oldValue || '').split(/\s+/).filter(Boolean))
          const newClasses = new Set((element?.className || '').split(/\s+/).filter(Boolean))
          const addedClasses = [...newClasses].filter(cls => !oldClasses.has(cls))

          const newTheme = addedClasses.find(cls => cls.includes('light-') || cls.includes('dark-'))

          if (newTheme) {
            setTheme(newTheme as FullTheme)
          }
        }
      }
    })

    if (element) {
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Radix UI elements will be rendered inside portalContainer
  const portalRef = useRef<HTMLDivElement>(null)
  const portalContainer = portalRef.current

  // Router Configuration
  const basename = `/ng${renderUrl}`

  const mfeRoutes = getMFERoutes(scope.projectIdentifier)

  const router = createBrowserRouter(mfeRoutes, { basename })
  const { t } = useTranslationStore()

  return (
    <div id="code-mfe-root" className="cn-root bg-cn-0 text-cn-2 font-body-normal overscroll-y-none" ref={portalRef}>
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
            setMFETheme: () => {},
            parentLocationPath,
            onRouteChange,
            isPublicAccessEnabledOnResources,
            isCurrentSessionPublic
          }}
        >
          <I18nextProvider i18n={i18n}>
            <ThemeProvider
              theme={theme ?? 'light-std-std'}
              setTheme={setTheme}
              isLightTheme={theme?.includes('light') ?? true}
            >
              <TranslationProvider t={t}>
                <QueryClientProvider client={queryClient}>
                  <TooltipProvider>
                    <DialogProvider>
                      <ExitConfirmProvider>
                        <NavigationProvider routes={mfeRoutes}>
                          <RouterProvider router={router} key={renderUrl} />
                        </NavigationProvider>
                      </ExitConfirmProvider>
                    </DialogProvider>
                  </TooltipProvider>
                </QueryClientProvider>
              </TranslationProvider>
            </ThemeProvider>
          </I18nextProvider>
        </MFEContext.Provider>
      </PortalProvider>
    </div>
  )
}
