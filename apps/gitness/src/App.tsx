import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  ThemeProvider,
  SandboxSettings,
  SandboxSettingsAccountPage,
  SandboxSettingsProjectPage,
  SandboxSettingsProjectMembersPage,
  ForgotPasswordPage,
  NewPasswordPage,
  OTPPage,
  SandboxRepoSettingsPage
} from '@harnessio/playground'
import SnadboxRootWraper from './components/SandboxRootWrapper'
import RootLayoutWrapper from './components/RootLayoutWrapper'
import { TooltipProvider } from '@harnessio/canary'
import { queryClient } from './framework/queryClient'
import PipelineListPage from './pages/pipeline-list'
import SandboxPipelinesPage from './pages/sandbox-pipeline-list'
import { SignIn } from './pages/signin'
import { SignUp } from './pages/signup'
import PullRequestListPage from './pages/pull-request-list-page'
import PullRequestSandboxListPage from './pages/sandbox-pull-request-list-page'
import ExecutionsListPage from './pages/execution-list'
import ReposListPage from './pages/repo/repo-list'
import PullRequestLayout from './layouts/PullRequestLayout'
import PullRequestCommitsPage from './pages/pull-request-commits-page'
import RepoLayout from './layouts/RepoLayout'
import PipelineEditPage from './pages/pipeline-edit/pipeline-edit'
import { LandingPage } from './pages/landing-page'
import { AppProvider } from './framework/context/AppContext'
import { RepoSummary } from './pages/repo/repo-summary'
import { RepoSandboxSummaryList } from './pages/repo-sandbox/repo-sandbox-summary'
import CreateProject from './pages/create-project'
import { CreateRepo } from './pages/repo/repo-create-page'
import { PipelineCreate } from './pages/pipeline-create/pipeline-create'
import RepoCommitsPage from './pages/repo/repo-commits'
import RepoSandboxCommitsPage from './pages/repo-sandbox/repo-sandbox-commits'
import { Execution } from './pages/execution/execution-details'
import RepoWebhooksListPage from './pages/repo/repo-webhooks'
import RepoSandboxWebhooksListPage from './pages/repo-sandbox/repo-sandbox-webhooks'
import { ReposBranchesListPage } from './pages/repo/repo-branch-list'
import { RepoSandboxBranchesListPage } from './pages/repo-sandbox/repo-sandbox-branch-list'
import PullRequestDataProvider from './pages/pull-request/context/pull-request-data-provider'
import PullRequestConversationPage from './pages/pull-request/pull-request-conversation-page'
import { RepoFiles } from './pages/repo/repo-files'
import { RepoSandboxFiles } from './pages/repo-sandbox/repo-sandbox-files'
import { SandboxRepoHeader } from './pages/repo-sandbox/repo-sandbox-header'
import ReposSandboxListPage from './pages/repo-sandbox/repo-sandbox-list'
import RepoSandboxLayout from './layouts/RepoSandboxLayout'
import { SettingsProfileGeneralPage } from './pages/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from './pages/profile-settings/profile-settings-keys-container'
import { FileViewer } from './components/FileViewer'
import { SandboxFileViewer } from './components/SandboxFileViewer'
import PullRequestChangesPage from './pages/pull-request/pull-request-changes-page'
import { ProjectSettingsGeneralPage } from './pages/project-settings/project-settings-general-page'
import { RepoSettingsGeneralPageContainer } from './pages/repo-sandbox/repo-settings-general-container'

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

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayoutWrapper />,

      children: [
        { index: true, element: <LandingPage /> },
        {
          path: ':spaceId/repos',
          element: <ReposListPage />
        },

        {
          path: ':spaceId/repos/:repoId',
          element: <RepoLayout />,
          children: [
            {
              index: true,
              element: <RepoSummary />
            },
            {
              path: 'summary',
              element: <RepoSummary />
            },
            {
              path: 'code',
              element: <RepoFiles />,
              children: [
                {
                  index: true,
                  element: <FileViewer />
                },
                {
                  path: ':gitRef',
                  element: <FileViewer />,
                  children: [
                    {
                      index: true,
                      element: <FileViewer />
                    },
                    {
                      path: '~/:resourcePath*',
                      element: <FileViewer />
                    }
                  ]
                }
              ]
            },
            {
              path: 'pipelines',
              children: [
                { index: true, element: <PipelineListPage /> },
                {
                  path: ':pipelineId',
                  children: [
                    { index: true, element: <ExecutionsListPage /> },
                    { path: 'executions/:executionId', element: <Execution /> },
                    {
                      path: 'edit',
                      element: <PipelineEditPage />
                    }
                  ]
                },
                {
                  path: 'create',
                  element: <PipelineCreate />
                }
              ]
            },
            {
              path: 'commits',
              element: <RepoCommitsPage />
            },
            {
              path: 'pull-requests',
              element: <PullRequestListPage />
            },
            {
              path: 'pull-requests/:pullRequestId',
              element: <PullRequestLayout />,
              children: [
                {
                  index: true,
                  element: <Navigate to="conversation" />
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
                  element: <PullRequestCommitsPage />
                },
                {
                  path: 'changes',
                  element: (
                    <PullRequestDataProvider>
                      <PullRequestChangesPage />
                    </PullRequestDataProvider>
                  )
                },
                {
                  path: 'checks',
                  element: <>Checks</>
                }
              ]
            },
            {
              path: 'webhooks',
              element: <RepoWebhooksListPage />
            },
            {
              path: 'branches',
              element: <ReposBranchesListPage />
            },
            {
              path: 'settings',
              element: <SandboxRepoSettingsPage />,
              children: [
                {
                  index: true,
                  element: <Navigate to="general" />
                },
                {
                  path: 'general',
                  element: <RepoSettingsGeneralPageContainer />
                }
              ]
            }
          ]
        },
        // Pipelines (OUTSIDE REPOS)
        //
        /**
         * 🚨 Root level pipelines will be disabled 🚨
         * Pipelines will only be part of repos for now
         */
        {
          path: 'pipelines',
          element: <PipelineListPage />
        },
        // Executions (OUTSIDE REPOS)
        {
          path: 'executions',
          element: <ExecutionsListPage />
        },
        {
          path: ':spaceId/repos/:repoId',
          element: <RepoLayout />,
          children: [
            {
              index: true,
              element: <>Repos list</>
            },
            {
              path: 'pipelines',
              element: <PipelineListPage />
            },
            {
              path: 'pipelines/:pipelineId/edit',
              element: <PipelineEditPage />
            },
            {
              path: 'pipelines/create',
              element: <PipelineCreate />
            },
            {
              path: 'pipelines/:pipelineId/executions/:executionId',
              element: <div>Execution page</div>
            }
          ]
        },
        {
          path: 'create-project',
          element: <CreateProject />
        }
      ]
    },
    {
      path: '/signin',
      element: <SignIn />
    },
    {
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/forgot',
      element: <ForgotPasswordPage />
    },
    {
      path: '/otp',
      element: <OTPPage />
    },
    {
      path: '/new-password',
      element: <NewPasswordPage />
    },

    {
      path: '/sandbox',
      element: <SnadboxRootWraper />,
      children: [
        {
          path: 'spaces',
          element: <SandboxRepoHeader />,
          children: [
            {
              path: ':spaceId/repos',
              element: <ReposSandboxListPage />
            },
            {
              path: ':spaceId/repos/:repoId',
              element: <RepoSandboxLayout />,
              children: [
                {
                  index: true,
                  element: <RepoSandboxSummaryList />
                },
                {
                  path: 'summary',
                  element: <RepoSandboxSummaryList />
                },
                {
                  path: 'code',
                  element: <RepoSandboxFiles />,
                  children: [
                    {
                      index: true,
                      element: <SandboxFileViewer />
                    },
                    {
                      path: ':gitRef',
                      element: <SandboxFileViewer />,
                      children: [
                        {
                          index: true,
                          element: <SandboxFileViewer />
                        },
                        {
                          path: '~/:resourcePath*',
                          element: <SandboxFileViewer />
                        }
                      ]
                    }
                  ]
                },
                {
                  path: 'pipelines',
                  children: [
                    {
                      index: true,
                      element: <SandboxPipelinesPage />
                    }
                  ]
                },
                {
                  path: 'commits',
                  element: <RepoSandboxCommitsPage />
                },
                {
                  path: 'pull-requests',
                  children: [
                    { index: true, element: <PullRequestSandboxListPage /> },
                    {
                      path: 'create',
                      element: <>tttttestestestset</>
                    }
                  ]
                },
                {
                  path: 'webhooks',
                  element: <RepoSandboxWebhooksListPage />
                },
                {
                  path: 'branches',
                  element: <RepoSandboxBranchesListPage />
                },
                {
                  path: 'settings',
                  element: <SandboxRepoSettingsPage />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="general" />
                    },
                    {
                      path: 'general',
                      element: <RepoSettingsGeneralPageContainer />
                    }
                  ]
                }
              ]
            },
            {
              path: ':spaceId/repos/create',
              element: <CreateRepo />
            }
          ]
        },
        {
          path: 'settings',
          element: <SandboxSettings />,
          children: [
            {
              path: 'profile',
              element: <SandboxSettingsAccountPage />,
              children: [
                {
                  index: true,
                  element: <Navigate to="general" />
                },
                {
                  path: 'general',
                  element: <SettingsProfileGeneralPage />
                },
                {
                  path: 'keys',
                  element: <SettingsProfileKeysPage />
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: ':spaceId/sandbox',
      element: <SnadboxRootWraper />,
      children: [
        {
          path: 'settings',
          element: <SandboxSettings />,
          children: [
            {
              path: 'project',
              element: <SandboxSettingsProjectPage />,
              children: [
                {
                  index: true,
                  element: <Navigate to="general" />
                },
                {
                  path: 'general',
                  element: <ProjectSettingsGeneralPage />
                },
                {
                  path: 'members',
                  element: <SandboxSettingsProjectMembersPage />
                }
              ]
            }
          ]
        }
      ]
    }
  ])

  return (
    <AppProvider>
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
