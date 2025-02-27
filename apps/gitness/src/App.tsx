import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { ToastProvider, TooltipProvider } from '@harnessio/ui/components'

import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { MFEContext } from './framework/context/MFEContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { mfeRoutes, routes } from './routes'

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
  const standaloneRouter = createBrowserRouter(routes)
  const mfeRouter = createBrowserRouter(mfeRoutes())

  const searchParams = new URLSearchParams(window.location.search)
  const isMfe = searchParams.get('mfe') === 'true'
  const accountId = searchParams.get('accountId') || ''
  const orgIdentifier = searchParams.get('orgIdentifier') || ''
  const projectIdentifier = searchParams.get('projectIdentifier') || ''
  const scope = { accountId, orgIdentifier, projectIdentifier }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultTheme="dark-std-std">
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <TooltipProvider>
              <ExitConfirmProvider>
                <NavigationProvider routes={routes}>
                  <RouterProvider router={router} />
                </NavigationProvider>
              </ExitConfirmProvider>
            </TooltipProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}
