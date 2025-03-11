import { I18nextProvider } from 'react-i18next'
import {
  createBrowserRouter,
  Link,
  NavLink,
  Outlet,
  RouterProvider,
  useMatches,
  useParams,
  useSearchParams
} from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { ToastProvider, Tooltip } from '@harnessio/ui/components'
import { RouterContextProvider } from '@harnessio/ui/context'

import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { NavigationProvider } from './framework/context/NavigationContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { routes } from './v6/RouteDestinations'

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

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultTheme="dark-std-std">
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Tooltip.Provider>
              <ExitConfirmProvider>
                <NavigationProvider routes={routes}>
                  <RouterContextProvider
                    Link={Link}
                    NavLink={NavLink}
                    Outlet={Outlet}
                    location={{ ...window.location, state: {}, key: '' }}
                    navigate={router.navigate}
                    useSearchParams={useSearchParams}
                    useMatches={useMatches}
                    useParams={useParams}
                  >
                    <RouterProvider router={router} />
                  </RouterContextProvider>
                </NavigationProvider>
              </ExitConfirmProvider>
            </Tooltip.Provider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}
