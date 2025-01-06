import './AppMFE.css'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router-dom'
import ReactShadowRoot from 'react-shadow-root'

import { ChildComponentProps } from '@harness/microfrontends'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { TooltipProvider } from '@harnessio/canary'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { BreadcrumbSeparator } from '@harnessio/ui/components'
import { RepoSettingsPage } from '@harnessio/ui/views'

import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { MFEContext } from './framework/context/MFEContext'
import { ThemeProvider, useThemeStore } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import PullRequestChanges from './pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from './pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from './pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from './pages-v2/pull-request/pull-request-data-provider'
import PullRequestLayout from './pages-v2/pull-request/pull-request-layout'
import SandboxPullRequestListPage from './pages-v2/pull-request/pull-request-list'
import { RepoBranchesListPage } from './pages-v2/repo/repo-branch-list'
import { RepoCode } from './pages-v2/repo/repo-code'
import RepoCommitsPage from './pages-v2/repo/repo-commits'
import { CreateRepo } from './pages-v2/repo/repo-create-page'
import RepoExecutionListPage from './pages-v2/repo/repo-execution-list'
import { ImportRepo } from './pages-v2/repo/repo-import-page'
import RepoLayout from './pages-v2/repo/repo-layout'
import ReposListPage from './pages-v2/repo/repo-list'
import RepoPipelineListPage from './pages-v2/repo/repo-pipeline-list'
import { RepoSettingsGeneralPageContainer } from './pages-v2/repo/repo-settings-general-container'
import { RepoSidebar } from './pages-v2/repo/repo-sidebar'
import RepoSummaryPage from './pages-v2/repo/repo-summary'
import WebhookListPage from './pages-v2/webhooks/webhook-list'

const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

function RootRouteRenderer({
  renderUrl,
  parentLocationPath,
  onRouteChange
}: {
  renderUrl: string
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}) {
  // Handle location change detected from parent route
  const navigate = useNavigate()
  useEffect(() => {
    console.log('parentLocationPath', parentLocationPath)
    console.log('renderUrl', renderUrl)

    if (renderUrl) {
      const pathToNavigate = parentLocationPath.replace(renderUrl, '')
      console.log('pathToNavigate', pathToNavigate)
      navigate(pathToNavigate, { replace: true })
    }
  }, [parentLocationPath])

  // Notify parent about route change
  const location = useLocation()
  useEffect(() => {
    if (location.pathname !== parentLocationPath) {
      onRouteChange?.(`${renderUrl}${location.pathname}`)
    }
  }, [location])

  return (
    <>
      {/* <BreadcrumbsNew selectedProject={scope.projectIdentifier || '...'} /> */}
      <Outlet />
    </>
  )
}

export default function AppMFE({
  scope,
  renderUrl,
  on401,
  useMFEThemeContext,
  parentLocationPath,
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
          <RootRouteRenderer
            renderUrl={renderUrl}
            onRouteChange={onRouteChange}
            parentLocationPath={parentLocationPath}
          />
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
                element: <ImportRepo />,
                handle: { breadcrumb: () => <span>Import Repository</span> }
              },
              {
                path: ':repoId',
                handle: {
                  breadcrumb: ({ repoId }: { repoId: string }) => `${repoId}`
                },
                element: <RepoLayout />,
                children: [
                  {
                    index: true,
                    element: <RepoSummaryPage />,
                    handle: { breadcrumb: () => <span>Summary</span> }
                  },
                  {
                    path: 'summary',
                    element: <RepoSummaryPage />,
                    handle: { breadcrumb: () => <span>Summary</span> }
                  },
                  {
                    path: 'pipelines',
                    handle: {
                      breadcrumb: () => <span>Pipelines</span>
                    },
                    children: [
                      { index: true, element: <RepoPipelineListPage /> },
                      {
                        path: ':pipelineId',
                        element: <RepoExecutionListPage />,
                        handle: {
                          breadcrumb: ({ pipelineId }: { pipelineId: string }) => (
                            <div className="flex items-center gap-1">
                              <span>{pipelineId}</span>
                              <BreadcrumbSeparator>/</BreadcrumbSeparator>
                              <span>Executions</span>
                            </div>
                          )
                        }
                      }
                    ]
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
                      { path: 'compare/:diffRefs*?', element: <CreatePullRequest /> },
                      {
                        path: ':pullRequestId',
                        element: <PullRequestLayout />,
                        children: [
                          {
                            index: true,
                            element: (
                              <PullRequestDataProvider>
                                <PullRequestConversationPage />
                              </PullRequestDataProvider>
                            )
                          },
                          {
                            path: 'conversation',
                            element: (
                              <PullRequestDataProvider>
                                <PullRequestConversationPage />
                              </PullRequestDataProvider>
                            )
                          },
                          {
                            path: 'commits',
                            element: <PullRequestCommitPage />
                          },
                          {
                            path: 'changes',
                            element: (
                              <PullRequestDataProvider>
                                <PullRequestChanges />
                              </PullRequestDataProvider>
                            )
                          }
                        ]
                      }
                    ]
                  },
                  {
                    path: 'settings',
                    element: <RepoSettingsPage />,
                    children: [
                      {
                        index: true,
                        element: <RepoSettingsGeneralPageContainer />,
                        handle: { breadcrumb: () => <span>Settings</span> }
                      },
                      {
                        path: 'general',
                        element: <RepoSettingsGeneralPageContainer />,
                        handle: { breadcrumb: () => <span>Settings</span> }
                      },
                      {
                        path: 'rules',
                        element: <RepoSettingsGeneralPageContainer />
                      },

                      {
                        path: 'webhooks',
                        element: <WebhookListPage />
                      }
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
    <ReactShadowRoot>
      <link href="http://localhost:5137/styles.css" rel="stylesheet" />

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
    </ReactShadowRoot>
  )
}
