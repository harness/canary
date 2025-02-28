import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, Link, NavLink, Outlet, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { ToastProvider, TooltipProvider } from '@harnessio/ui/components'
import { RouterProvider as RouterProviderV1 } from '@harnessio/ui/context'

import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { routes } from './routes'

const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

export default function AppV1() {
  new CodeServiceAPIClient({
    urlInterceptor: (url: string) => `${BASE_URL_PREFIX}${url}`,
    responseInterceptor: (response: Response) => {
      switch (response.status) {
        case 401:
          window.location.href = '/signin'
          break
      }
      return response
    }
  })

  // Router Configuration
  const router = createBrowserRouter(routes)

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultTheme="dark-std-std">
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <TooltipProvider>
              <ExitConfirmProvider>
                <NavigationProvider routes={routes}>
                  <RouterProviderV1 Link={Link} NavLink={NavLink} Outlet={Outlet} navigate={router.navigate}>
                    <RouterProvider router={router} />
                  </RouterProviderV1>
                </NavigationProvider>
              </ExitConfirmProvider>
            </TooltipProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}
