import { useEffect, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { NgManagerSwaggerServiceAPIClient } from '@harnessio/react-ng-manager-swagger-service-client'
import { NGManagerServiceAPIClient } from '@harnessio/react-ng-manager-v2-client'
import { TooltipProvider } from '@harnessio/ui/components'
import { DialogProvider, PortalProvider, ThemeProvider, TranslationProvider } from '@harnessio/ui/context'

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

const getTheme = (className: string) => {
  return className.includes('light') || className.includes('light-std-std') ? 'light-std-std' : 'dark-std-std'
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
  hooks
}: AppMFEProps) {
  const createClientConfig = (basePath: string) => ({
    urlInterceptor: (url: string) =>
      `${window.apiUrl || ''}${basePath}${url}${url.includes('?') ? '&' : '?'}routingId=${scope.accountId}`,
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

  new CodeServiceAPIClient(createClientConfig('/code/api/v1'))
  new NGManagerServiceAPIClient(createClientConfig('/ng/api'))
  new NgManagerSwaggerServiceAPIClient(createClientConfig('/ng/api'))

  // Apply host theme to MFE
  const { theme, setTheme } = useThemeStore()

  // TODO: This is a hack to get the theme from the host and apply it to the MFE. Need to implement a proper fix.
  useEffect(() => {
    const element = document.querySelector('html')

    const themeClass = element?.className

    const hasThemeInDOM = themeClass?.includes('light') || themeClass?.includes('dark')

    if (hasThemeInDOM) {
      setTheme(getTheme(themeClass ?? 'light-std-std'))
    } else {
      element?.classList.add(theme ?? 'light-std-std')
    }

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const newTheme = getTheme(element?.className || '')
          setTheme(newTheme)
        }
      }
    })

    if (element) {
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['class']
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
    <div id="code-mfe-root" ref={portalRef}>
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
            onRouteChange
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
