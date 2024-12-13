import './AppMFE.css'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ChildComponentProps } from '@harness/microfrontends'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { TooltipProvider } from '@harnessio/canary'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'

import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { MFEContext } from './framework/context/MFEContext'
import { ThemeProvider, useThemeStore } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import SandboxPullRequestListPage from './pages-v2/pull-request/pull-request-list'
import { RepoBranchesListPage } from './pages-v2/repo/repo-branch-list'
import { RepoCode } from './pages-v2/repo/repo-code'
import RepoCommitsPage from './pages-v2/repo/repo-commits'
import { CreateRepo } from './pages-v2/repo/repo-create-page'
import ReposListPage from './pages-v2/repo/repo-list'
import { RepoSidebar } from './pages-v2/repo/repo-sidebar'
import RepoSummaryPage from './pages-v2/repo/repo-summary'
import WebhookListPage from './pages-v2/webhooks/webhook-list'
import { RepoImportContainer } from './pages/repo/repo-import-container'

const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

export default function AppMFE({ scope, renderUrl, on401, useMFEThemeContext }: ChildComponentProps) {
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

  const { theme } = useMFEThemeContext()
  console.log('MFE Theme', theme)

  const { setTheme } = useThemeStore()
  useEffect(() => {
    if (theme === 'Light') {
      setTheme('light-std-std')
    } else {
      setTheme('dark-std-std')
    }
  }, [theme])

  return (
    <AppProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme={theme === 'Light' ? 'light-std-std' : 'dark-std-std'}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <ExitConfirmProvider>
                <NuqsAdapter>
                  <MFEContext.Provider value={{ scope }}>
                    <BrowserRouter basename={`/ng${renderUrl}`}>
                      <Routes>
                        <Route path="repos/:repoId/commits" element={<RepoCommitsPage />} />
                        <Route path="repos/:repoId/branches" element={<RepoBranchesListPage />} />
                        <Route path="repos/:repoId/webhooks" element={<WebhookListPage />} />

                        <Route
                          path="repos/:repoId/code"
                          element={
                            <ExplorerPathsProvider>
                              <RepoSidebar />
                            </ExplorerPathsProvider>
                          }
                        >
                          <Route index element={<RepoCode />} />
                          <Route path="*" element={<RepoCode />} />
                        </Route>

                        <Route path="repos/:repoId/pulls">
                          <Route index element={<SandboxPullRequestListPage />} />
                          <Route path="compare/:diffRefs*?" element={<CreatePullRequest />} />
                        </Route>

                        <Route path="repos/create" element={<CreateRepo />} />
                        <Route path="repos/import" element={<RepoImportContainer />} />

                        <Route path="repos/:repoId" element={<RepoSummaryPage />} />

                        <Route path="repos" element={<ReposListPage />} />
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
