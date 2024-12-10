import './AppMFE.css'

import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ChildComponentProps } from '@harness/microfrontends'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { TooltipProvider } from '@harnessio/canary'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'

import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { MFEContext } from './framework/context/MFEContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import ReposListPage from './pages-v2/repo/repo-list'
import RepoSummaryPage from './pages-v2/repo/repo-summary'

const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

export default function AppMFE({ scope, renderUrl, on401 }: ChildComponentProps) {
  new CodeServiceAPIClient({
    urlInterceptor: (url: string) => `/code${BASE_URL_PREFIX}${url}`,
    responseInterceptor: (response: Response) => {
      switch (response.status) {
        case 401:
          on401?.()
          break
      }
      return response
    }
  })

  return (
    <AppProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme="dark-std-std">
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <ExitConfirmProvider>
                <NuqsAdapter>
                  <MFEContext.Provider value={{ scope }}>
                    <BrowserRouter basename={`/ng${renderUrl}`}>
                      <Routes>
                        <Route path="repos" element={<ReposListPage />} />
                        <Route path="repos/:repoId" element={<RepoSummaryPage />} />
                      </Routes>
                    </BrowserRouter>
                  </MFEContext.Provider>
                </NuqsAdapter>
              </ExitConfirmProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </I18nextProvider>
    </AppProvider>
  )
}
