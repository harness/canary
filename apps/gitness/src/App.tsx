import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { TooltipProvider } from '@harnessio/canary'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import {
  EmptyPage,
  ForgotPasswordPage as ForgotPasswordPageV2,
  NewPasswordPage as NewPasswordPageV2,
  OTPPage as OTPPageV2,
  SandboxLayout
} from '@harnessio/ui/views'
import {
  ForgotPasswordPage,
  NewPasswordPage,
  OTPPage,
  RepoSettingsPage,
  RepoSettingsPlaceholderPage,
  SandboxSettings,
  SettingsAccountPage,
  SettingsProjectNav
} from '@harnessio/views'

import { FileEditor } from './components/FileEditor'
import { FileViewer } from './components/FileViewer'
import RootWrapper from './components/RootWrapper'
import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import PipelineLayout from './layouts/PipelineStudioLayout'
import PullRequestLayout from './layouts/PullRequestLayout'
import RepoLayoutV1 from './layouts/RepoLayout'
import { LandingPage } from './pages-v2/landing-page-container'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import SandboxPullRequestListPage from './pages-v2/pull-request/pull-request-list'
import { RepoCode } from './pages-v2/repo/repo-code'
import RepoCommitsPage from './pages-v2/repo/repo-commits'
import { CreateRepo } from './pages-v2/repo/repo-create-page'
import RepoLayout from './pages-v2/repo/repo-layout'
import ReposListPage from './pages-v2/repo/repo-list'
import { RepoSidebar } from './pages-v2/repo/repo-sidebar'
import RepoSummaryPage from './pages-v2/repo/repo-summary'
import { SignIn as SignInV2 } from './pages-v2/signin'
import { SignUp as SignUpV2 } from './pages-v2/signup'
import WebhookListPage from './pages-v2/webhooks/webhook-list'
import CreateProject from './pages/create-project'
import { Execution } from './pages/execution/execution-details'
import RepoExecutionListPage from './pages/execution/repo-execution-list'
import { LandingPage as LandingPageV2 } from './pages/landing-page'
import { Logout } from './pages/logout'
import { PipelineCreate } from './pages/pipeline-create/pipeline-create'
import PipelineEditPage from './pages/pipeline-edit/pipeline-edit'
import ProjectPipelinesPage from './pages/pipeline/project-pipeline-list'
import RepoPipelinesPage from './pages/pipeline/repo-pipeline-list'
import { SettingsProfileGeneralPage } from './pages/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from './pages/profile-settings/profile-settings-keys-container'
import { ProfileSettingsThemePage } from './pages/profile-settings/profile-settings-theme-page'
import { ProjectSettingsGeneralPage } from './pages/project-settings/project-settings-general-page'
import { ProjectSettingsMemebersPage } from './pages/project-settings/project-settings-members-page'
import { CreateNewMemberPage } from './pages/project-settings/project-settings-new-member-page'
import PullRequestCommitsPage from './pages/pull-request-commits-page'
import PullRequestDataProvider from './pages/pull-request/context/pull-request-data-provider'
import PullRequestChangesPage from './pages/pull-request/pull-request-changes-page'
import { CreatePullRequest as CreatePullRequestV1 } from './pages/pull-request/pull-request-compare-page'
import PullRequestConversationPage from './pages/pull-request/pull-request-conversation-page'
import PullRequestListPage from './pages/pull-request/pull-request-list-page'
import { RepoBranchesListPage } from './pages/repo/repo-branch-list'
import { RepoBranchSettingsRulesPageContainer } from './pages/repo/repo-branch-rules-container'
import RepoCommitsPageV1 from './pages/repo/repo-commits'
import { CreateRepoV1 } from './pages/repo/repo-create-page'
import { RepoFiles } from './pages/repo/repo-files'
import { RepoHeader } from './pages/repo/repo-header'
import { RepoImportContainer } from './pages/repo/repo-import-container'
import ReposListPageV1 from './pages/repo/repo-list'
import { RepoSettingsGeneralPageContainer } from './pages/repo/repo-settings-general-container'
import RepoSummaryPageV1 from './pages/repo/repo-summary'
import { SignIn } from './pages/signin'
import { SignUp } from './pages/signup'
import { CreateNewUserContainer } from './pages/user-management/create-new-user-container'
import { UserManagementPageContainer } from './pages/user-management/user-management-container'
import { CreateWebhookContainer } from './pages/webhooks/create-webhook-container'
import RepoWebhooksListPage from './pages/webhooks/repo-webhook-list'

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
      path: '/v1/signin',
      element: <SignIn />
    },
    {
      path: '/v1/signup',
      element: <SignUp />
    },
    {
      path: '/v1/forgot',
      element: <ForgotPasswordPage />
    },
    {
      path: '/v1/otp',
      element: <OTPPage />
    },
    {
      path: '/v1/new-password',
      element: <NewPasswordPage />
    },
    {
      path: '/signin',
      element: <SignInV2 />
    },
    {
      path: '/signup',
      element: <SignUpV2 />
    },
    {
      path: '/forgot',
      element: <ForgotPasswordPageV2 />
    },
    {
      path: '/otp',
      element: <OTPPageV2 />
    },
    {
      path: '/new-password',
      element: <NewPasswordPageV2 />
    },
    {
      path: '/',
      element: <RootWrapper />,
      children: [
        // 🚨 Routes to fix 🚨
        {
          path: 'repos',
          element: (
            <SandboxLayout.Main hasLeftPanel hasHeader>
              <h1>Repo</h1>
            </SandboxLayout.Main>
          )
        },
        {
          path: 'pipelines',
          element: (
            <SandboxLayout.Main hasLeftPanel hasHeader>
              <h1>pipelines</h1>
            </SandboxLayout.Main>
          )
        },
        {
          path: 'executions',
          element: (
            <SandboxLayout.Main hasLeftPanel hasHeader>
              <h1>executions</h1>
            </SandboxLayout.Main>
          )
        },
        {
          path: 'databases',
          element: (
            <SandboxLayout.Main hasLeftPanel hasHeader>
              <h1>databases</h1>
            </SandboxLayout.Main>
          )
        },
        {
          index: true,
          element: <LandingPage />
        },
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
              element: <Navigate to="summary" replace />
            },
            {
              path: 'summary',
              element: <RepoSummaryPage />
            },
            {
              path: 'commits',
              element: <RepoCommitsPage />
            },
            {
              path: 'code',
              element: (
                <ExplorerPathsProvider>
                  <RepoSidebar />
                </ExplorerPathsProvider>
              ),
              children: [
                {
                  index: true,
                  element: <RepoCode />
                },
                {
                  path: '*',
                  element: <RepoCode />
                }
              ]
            },
            {
              index: true,
              element: <Navigate to="pulls" replace />
            },
            {
              path: 'webhooks',
              element: <WebhookListPage />
            },
            {
              path: 'pulls',
              children: [
                { index: true, element: <SandboxPullRequestListPage /> },
                {
                  path: 'compare/:diffRefs*?',
                  element: <CreatePullRequest />
                }
              ]
            },
            {
              path: 'pulls/:pullRequestId',
              element: <>test</>
            }
          ]
        },
        {
          path: ':spaceId/repos/create',
          element: <CreateRepo />
        },
        {
          path: ':spaceId/repos/import',
          element: <RepoImportContainer />
        },
        {
          path: 'theme',
          element: <ProfileSettingsThemePage />
        }
      ]
    },
    {
      path: '/v1',
      element: <RootWrapper />,
      children: [
        {
          index: true,
          element: <LandingPageV2 />
        },
        {
          path: 'spaces/:spaceId/repos/:repoId/pipelines',
          element: <PipelineLayout />,
          children: [
            {
              path: 'create',
              element: <PipelineCreate />
            },
            {
              path: ':pipelineId',
              children: [
                { index: true, element: <RepoExecutionListPage /> },
                {
                  path: 'edit',
                  element: <PipelineEditPage />
                },
                { path: 'executions/:executionId', element: <Execution /> }
              ]
            }
          ]
        },
        {
          path: 'spaces',
          element: <RepoHeader />,
          children: [
            {
              path: ':spaceId/repos',
              element: <ReposListPageV1 />
            },
            {
              path: ':spaceId/repos/:repoId',
              element: <RepoLayoutV1 />,
              children: [
                {
                  index: true,
                  element: <Navigate to="summary" replace />
                },
                {
                  path: 'summary',
                  element: <RepoSummaryPageV1 />
                },
                {
                  path: 'code',
                  element: (
                    <ExplorerPathsProvider>
                      <RepoFiles />
                    </ExplorerPathsProvider>
                  ),
                  children: [
                    {
                      index: true,
                      element: <FileViewer />
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
                    {
                      index: true,
                      element: <RepoPipelinesPage />
                    }
                  ]
                },
                {
                  path: 'commits',
                  element: <RepoCommitsPageV1 />
                },
                {
                  path: 'pull-requests',
                  children: [
                    { index: true, element: <PullRequestListPage /> },
                    {
                      path: 'compare/:diffRefs*?',
                      element: <CreatePullRequestV1 />
                    }
                  ]
                },
                {
                  path: 'pull-requests/:pullRequestId',
                  element: <PullRequestLayout />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="conversation" replace />
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
                  element: <RepoBranchesListPage />
                },
                {
                  path: 'settings',
                  element: <RepoSettingsPage />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="general" replace />
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
            {
              path: ':spaceId/pipelines',
              children: [
                {
                  index: true,
                  element: <ProjectPipelinesPage />
                },
                {
                  path: 'create',
                  element: <PipelineCreate />
                },
                {
                  path: ':pipelineId',
                  element: <RepoExecutionListPage />
                }
              ]
            },
            // Executions (OUTSIDE REPOS)
            {
              path: ':spaceId/executions',
              element: <RepoExecutionListPage />
            },
            {
              path: 'create',
              element: <CreateProject />
            },
            {
              path: ':spaceId/settings',
              element: <RootWrapper />,
              children: [
                {
                  element: <SettingsProjectNav />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to="general" replace />
                    },
                    {
                      path: 'general',
                      element: <ProjectSettingsGeneralPage />
                    },
                    {
                      path: 'members',
                      children: [
                        { index: true, element: <ProjectSettingsMemebersPage /> },
                        {
                          path: 'create',
                          element: <CreateNewMemberPage />
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: ':spaceId/repos/create',
              element: <CreateRepoV1 />
            },
            {
              path: ':spaceId/repos/import',
              element: <RepoImportContainer />
            }
          ]
        },
        {
          path: 'settings',
          element: <SandboxSettings />,
          children: [
            {
              element: <SettingsAccountPage />,
              children: [
                {
                  index: true,
                  element: <Navigate to="general" replace />
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
        },
        {
          path: 'users',
          element: <UserManagementPageContainer />
        },
        {
          path: 'users/create',
          element: <CreateNewUserContainer />
        }
      ]
    },
    {
      path: 'logout',
      element: <Logout />
    },
    {
      path: 'chaos',
      element: <EmptyPage pathName="Chaos Engineering" />
    },
    {
      path: 'artifacts',
      element: <EmptyPage pathName="Artifacts" />
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
      path: 'developer/portal',
      element: <EmptyPage pathName="Internal Developer Portal" />
    },
    {
      path: 'developer/environments',
      element: <EmptyPage pathName="Environments" />
    },
    {
      path: 'developer/insights',
      element: <EmptyPage pathName="Software Engineering Insights" />
    },
    {
      path: 'infrastructure',
      element: <EmptyPage pathName="Infrastructure as Code" />
    },
    {
      path: 'code-repository',
      element: <EmptyPage pathName="Code Repository" />
    },
    {
      path: 'supply-chain',
      element: <EmptyPage pathName="Software Supply Chain Assurance" />
    },
    {
      path: 'security-tests',
      element: <EmptyPage pathName="Security Testing Orchestration" />
    },
    {
      path: 'cloud-costs',
      element: <EmptyPage pathName="Cloud Cost Management" />
    },
    {
      path: 'incidents',
      element: <EmptyPage pathName="Incidents" />
    },
    {
      path: 'dashboards',
      element: <EmptyPage pathName="Dashboards" />
    }
  ])

  return (
    <AppProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme="dark-std-std">
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
      </I18nextProvider>
    </AppProvider>
  )
}
