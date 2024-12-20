import './AppMFE.css'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router-dom'

import { ChildComponentProps } from '@harness/microfrontends'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { TooltipProvider } from '@harnessio/canary'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'

import BreadcrumbsNew from './components/breadcrumbs/breadcrumbs-new'
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
    console.log('renderUrl', renderUrl)

    if (renderUrl) {
      const pathToNavigate = locationPathname.replace(renderUrl, '')
      console.log('pathToNavigate', pathToNavigate)
      navigate(pathToNavigate, { replace: true })
    }
  }, [locationPathname])

  // Notify parent about route change
  const location = useLocation()
  useEffect(() => {
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

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: (
          <>
            <LocationChangeHandler
              renderUrl={renderUrl}
              onRouteChange={onRouteChange}
              locationPathname={locationPathname}
            />
            <BreadcrumbsNew selectedProject={scope.projectIdentifier || '...'} />
            <Outlet />
          </>
        ),
        children: [
          {
            path: 'repos',
            handle: { breadcrumb: () => <span>Repositories</span> },
            children: [
              {
                index: true,
                element: <ReposListPage noBreadcrumbs={true} />
              },
              {
                path: 'create',
                element: <CreateRepo />,
                handle: { breadcrumb: () => <span>Create Repository</span> }
              },
              {
                path: 'import',
                element: <RepoImportContainer />,
                handle: { breadcrumb: () => <span>Import Repository</span> }
              },
              {
                path: ':repoId',
                handle: {
                  breadcrumb: ({ repoId }: { repoId: string }) => `${repoId}`
                },
                children: [
                  {
                    index: true,
                    element: <RepoSummaryPage />,
                    handle: { breadcrumb: () => <span>Summary</span> }
                  },
                  {
                    path: 'commits',
                    element: <RepoCommitsPage />,
                    handle: { breadcrumb: () => <span>Commits</span> }
                  },
                  {
                    path: 'code',
                    handle: { breadcrumb: () => <span>Code</span> },
                    element: (
                      <>
                        <ExplorerPathsProvider>
                          <RepoSidebar />
                        </ExplorerPathsProvider>
                        {/* This outlet should not be needed */}
                        {/* the outlet inside RepoSidebar should ideally work */}
                        {/* but somehow it's not working, need to fix */}
                        {/* One more strange thing, just the Outlet without <RepoSidebar /> doesn't work! */}
                        <Outlet />
                      </>
                    ),
                    children: [
                      { index: true, element: <RepoCode /> },
                      { path: '*', element: <RepoCode /> }
                    ]
                  },
                  {
                    path: 'branches',
                    element: <RepoBranchesListPage />,
                    handle: { breadcrumb: () => <span>Branches</span> }
                  },
                  {
                    path: 'webhooks',
                    element: <WebhookListPage />,
                    handle: { breadcrumb: () => <span>Webhooks</span> }
                  },
                  {
                    path: 'pulls',
                    children: [
                      { index: true, element: <SandboxPullRequestListPage /> },
                      { path: 'compare/:diffRefs*?', element: <CreatePullRequest /> }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    {
      basename: `/ng${renderUrl}`
    }
  )

  return (
    <AppProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme={theme === 'Light' ? 'light-std-std' : 'dark-std-std'}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <ExitConfirmProvider>
                <NuqsAdapter>
                  <MFEContext.Provider value={{ scope, renderUrl }}>
                    <RouterProvider router={router} />
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
