import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { Toast, Tooltip } from '@harnessio/ui/components'
import { TranslationProvider } from '@harnessio/ui/context'

import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { createI18NextAdapter } from './i18n/i18nAdapter'
import { useTranslationStore } from './i18n/stores/i18n-store'
import { routes } from './routes'

const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

export default function App() {
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

  // i18n Configurations
  const { i18n: i18nStore } = useTranslationStore()
  const i18nT = createI18NextAdapter(i18nStore.t)

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultTheme="dark-std-std">
        <TranslationProvider t={i18nT}>
          <QueryClientProvider client={queryClient}>
            <Toast.Provider>
              <Tooltip.Provider>
                <ExitConfirmProvider>
                  <NavigationProvider routes={routes}>
                    <RouterProvider router={router} />
                  </NavigationProvider>
                </ExitConfirmProvider>
              </Tooltip.Provider>
            </Toast.Provider>
          </QueryClientProvider>
        </TranslationProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}
