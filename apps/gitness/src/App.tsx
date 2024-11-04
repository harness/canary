import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router'
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
  SandboxRepoSettingsPage,
  RepoSettingsPlaceholderPage
} from '@harnessio/playground'
import SnadboxRootWraper from './components/SandboxRootWrapper'
import { TooltipProvider } from '@harnessio/canary'
import { queryClient } from './framework/queryClient'
import PipelineListPage from './pages/pipeline-list'
import SandboxPipelinesPage from './pages/sandbox-pipeline-list'
import { SignIn } from './pages/signin'
import { SignUp } from './pages/signup'
import PullRequestSandboxListPage from './pages/sandbox-pull-request-list-page'
import ExecutionsListPage from './pages/execution-list'
import SandboxExecutionsListPage from './pages/sandbox-execution-list'
import PullRequestSandboxLayout from './layouts/PullRequestSandboxLayout'
import PullRequestCommitsPage from './pages/pull-request-commits-page'
import RepoLayout from './layouts/RepoLayout'
import PipelineEditPage from './pages/pipeline-edit/pipeline-edit'
import { LandingPage } from './pages/landing-page'
import { AppProvider } from './framework/context/AppContext'
import { RepoSandboxSummaryList } from './pages/repo-sandbox/repo-sandbox-summary'
import CreateProject from './pages/create-project'
import { CreateRepo } from './pages/repo/repo-create-page'
import { PipelineCreate } from './pages/pipeline-create/pipeline-create'
import { SandboxPipelineCreate } from './pages/pipeline-create/pipeline-create-sandbox'
import RepoSandboxCommitsPage from './pages/repo-sandbox/repo-sandbox-commits'
import { Execution } from './pages/execution/execution-details'
import RepoSandboxWebhooksListPage from './pages/repo-sandbox/repo-sandbox-webhooks'
import { RepoSandboxBranchesListPage } from './pages/repo-sandbox/repo-sandbox-branch-list'
import PullRequestDataProvider from './pages/pull-request/context/pull-request-data-provider'
import SandboxPullRequestConversationPage from './pages/pull-request/sandbox-pull-request-conversation-page'
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
import { FileEditor } from './components/FileEditor'
import { RepoSettingsGeneralPageContainer } from './pages/repo-sandbox/repo-settings-general-container'
import { CreatePullRequest } from './pages/pull-request/pull-request-compare-page'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { EmptyPage } from './pages/empty-page'
import { CreateWebhookContainer } from './pages/webhooks/create-webhook-container'
import { RepoBranchSettingsRulesPageContainer } from './pages/repo-sandbox/repo-sandbox-branch-rules-container'
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
      path: '/',
      element: <SnadboxRootWraper />,
      children: [
        {
          index: true,
          element: <LandingPage />
        },
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
                          path: 'edit/:gitRef/~/:resourcePath*',
                          element: <FileEditor />
                        },
                        {
                          path: 'new/:gitRef/~/*',
                          element: <FileEditor />,
                          children: [
                            {
                              path: ':resourcePath*',
                              element: <FileViewer />
                            }
                          ]
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
                    },
                    {
                      path: ':pipelineId',
                      children: [
                        { index: true, element: <SandboxExecutionsListPage /> },
                        { path: 'executions/:executionId', element: <Execution /> },
                        {
                          path: 'edit',
                          element: <PipelineEditPage />
                        }
                      ]
                    },
                    {
                      path: 'create',
                      element: <SandboxPipelineCreate />
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
                      path: 'compare/:diffRefs*?',
                      element: <CreatePullRequest />
                    }
                  ]
                },
                {
                  path: 'pull-requests/:pullRequestId',
                  element: <PullRequestSandboxLayout />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="conversation" />
                    },
                    {
                      path: 'conversation',
                      element: (
                        <PullRequestDataProvider>
                          <SandboxPullRequestConversationPage />
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
                  element: <RepoSandboxWebhooksListPage />
                },
                {
                  path: 'webhooks/create',
                  element: <CreateWebhookContainer />,
                  children: [
                    {
                      path: ':webhookId',
                      element: <CreateWebhookContainer />
                    }
                  ]
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
                    },
                    {
                      path: 'rules',
                      element: <RepoSettingsGeneralPageContainer />
                    },
                    {
                      path: 'rules/create',
                      element: <RepoBranchSettingsRulesPageContainer />,
                      children: [
                        {
                          path: ':identifier',
                          element: <RepoBranchSettingsRulesPageContainer />
                        }
                      ]
                    },
                    {
                      path: '*',
                      element: <RepoSettingsPlaceholderPage />
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
    },
    {
      path: 'chaos-engineering',
      element: <EmptyPage pathName="Chaos Engineering" />
    },
    {
      path: 'environment',
      element: <EmptyPage pathName="Environment" />
    },
    {
      path: 'secrets',
      element: <EmptyPage pathName="Secrets" />
    },
    {
      path: 'connectors',
      element: <EmptyPage pathName="Connectors" />
    },
    {
      path: 'continuous-delivery-gitops',
      element: <EmptyPage pathName="Continuous Delivery Gitops" />
    },
    {
      path: 'continuous-integration',
      element: <EmptyPage pathName="Continuous Integration" />
    },
    {
      path: 'feature-flags',
      element: <EmptyPage pathName="Feature Flags" />
    },
    {
      path: 'infrastructure-as-code',
      element: <EmptyPage pathName="Infrastructure as Code" />
    },
    {
      path: 'service-reliability',
      element: <EmptyPage pathName="Service Reliability" />
    },
    {
      path: 'internal-developer-portal',
      element: <EmptyPage pathName="Internal Developer Portal" />
    },
    {
      path: 'infrastructure-as-code',
      element: <EmptyPage pathName="Infrastructure as Code" />
    },
    {
      path: 'code-repository',
      element: <EmptyPage pathName="Code Repository" />
    },
    {
      path: 'software-engineering-insights',
      element: <EmptyPage pathName="Software Engineering Insights" />
    },
    {
      path: 'software-supply-chain-assurance',
      element: <EmptyPage pathName="Software Supply Chain Assurance" />
    },
    {
      path: 'security-testing-orchestration',
      element: <EmptyPage pathName="Security Testing Orchestration" />
    },
    {
      path: 'cloud-cost-management',
      element: <EmptyPage pathName="Cloud Cost Management" />
    }
  ])

  return (
    <AppProvider>
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ExitConfirmProvider>
              <NuqsAdapter>
                <RouterProvider router={router} />
              </NuqsAdapter>
            </ExitConfirmProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
