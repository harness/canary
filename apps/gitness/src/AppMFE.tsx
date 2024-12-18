import './AppMFE.css'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { ChildComponentProps } from '@harness/microfrontends'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { TooltipProvider } from '@harnessio/canary'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'

import Breadcrumbs from './components/breadcrumbs/breadcrumbs'
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

function LocationChangeHandler({
  renderUrl,
  locationPathname,
  onRouteChange
}: {
  renderUrl: string
  locationPathname: string
  onRouteChange: (updatedLocationPathname: string) => void
}) {
  // Handle location change detected from parent route
  const navigate = useNavigate()
  useEffect(() => {
    console.log('locationPathname', locationPathname)
    if (renderUrl) {
      const pathToReplace = renderUrl
      console.log('pathToReplace', pathToReplace)

      const pathToNavigate = locationPathname.replace(pathToReplace, '')
      console.log('pathToNavigate', pathToNavigate)

      navigate(pathToNavigate)
    }
  }, [locationPathname])

  // Notify parent about route change
  const location = useLocation()
  useEffect(() => {
    console.log('location.pathname -> Child', location.pathname)
    console.log('locationPathname -> Parent', locationPathname)
    if (location.pathname !== locationPathname) {
      onRouteChange?.(`${renderUrl}${location.pathname}`)
    }
  }, [location])

  return <></>
}

export default function AppMFE({
  scope,
  renderUrl,
  on401,
  useMFEThemeContext,
  locationPathname,
  onRouteChange
}: ChildComponentProps) {
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
                  <MFEContext.Provider value={{ scope, renderUrl }}>
                    <BrowserRouter basename={`/ng${renderUrl}`}>
                      <LocationChangeHandler
                        renderUrl={renderUrl}
                        locationPathname={locationPathname}
                        onRouteChange={onRouteChange}
                      />
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

                        <Route
                          path="repos/:repoId"
                          element={
                            <>
                              <div className="fixed top-0 z-40 ml-56 w-full bg-background-1">
                                <Breadcrumbs />
                              </div>
                              <RepoSummaryPage />
                            </>
                          }
                        />

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
