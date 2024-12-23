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
  RepoSettingsPage,
  SandboxLayout
} from '@harnessio/ui/views'

import RootWrapper from './components/RootWrapper'
import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { useTranslationStore } from './i18n/stores/i18n-store'
import PipelineLayout from './layouts/PipelineStudioLayout'
import CreateProject from './pages-v2/create-project/create-project-container'
import { LandingPage } from './pages-v2/landing-page-container'
import { Logout } from './pages-v2/logout'
import PipelineEditPage from './pages-v2/pipeline/pipeline-edit/pipeline-edit'
import { SettingsProfileGeneralPage } from './pages-v2/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from './pages-v2/profile-settings/profile-settings-keys-container'
import { ProfileSettingsThemePage } from './pages-v2/profile-settings/profile-settings-theme-page'
import { SettingsLayout } from './pages-v2/profile-settings/settings-layout'
import { ProjectMemberListPage } from './pages-v2/project/project-member-list'
import { SettingsLayout as ProjectSettingsLayout } from './pages-v2/project/settings-layout'
import PullRequestChanges from './pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from './pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from './pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from './pages-v2/pull-request/pull-request-data-provider'
import PullRequestLayout from './pages-v2/pull-request/pull-request-layout'
import SandboxPullRequestListPage from './pages-v2/pull-request/pull-request-list'
import { RepoBranchesListPage } from './pages-v2/repo/repo-branch-list'
import { RepoBranchSettingsRulesPageContainer } from './pages-v2/repo/repo-branch-rules-container'
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
import { SignIn as SignInV2 } from './pages-v2/signin'
import { SignUp as SignUpV2 } from './pages-v2/signup'
import { UserManagementPageContainer } from './pages-v2/user-management/user-management-container'
import { CreateWebhookContainer } from './pages-v2/webhooks/create-webhook-container'
import WebhookListPage from './pages-v2/webhooks/webhook-list'

// import PullRequestDataProviderV1 from './pages/pull-request/context/pull-request-data-provider'
// import { PullRequestChangesPage as PullRequestChangesPageV1 } from './pages/pull-request/pull-request-changes-page'
// import { CreatePullRequest as CreatePullRequestV1 } from './pages/pull-request/pull-request-compare-page'
// import { PullRequestConversationPage as PullRequestConversationPageV1 } from './pages/pull-request/pull-request-conversation-page'

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
          path: 'create',
          element: <CreateProject />
        },
        {
          path: 'repos',
          element: (
            <SandboxLayout.Main>
              <h1>Repo</h1>
            </SandboxLayout.Main>
          )
        },
        {
          path: 'pipelines',
          element: (
            <SandboxLayout.Main>
              <h1>pipelines</h1>
            </SandboxLayout.Main>
          )
        },
        {
          path: 'executions',
          element: (
            <SandboxLayout.Main>
              <h1>executions</h1>
            </SandboxLayout.Main>
          )
        },
        {
          path: 'databases',
          element: (
            <SandboxLayout.Main>
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
          path: ':spaceId/repos/:repoId/pipelines/:pipelineId',
          element: <PipelineLayout />,
          children: [
            {
              index: true,
              element: <RepoExecutionListPage />
              // children: [
              //   {
              //     path: 'edit',
              //     element: <PipelineEditPage />
              //   }
              // ]
            },
            {
              path: 'edit',
              element: <PipelineEditPage />
            }
          ]
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
              path: 'branches',
              element: <RepoBranchesListPage />
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
            },
            {
              path: 'settings',
              element: <RepoSettingsPage useTranslationStore={useTranslationStore} />,
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
                  path: 'webhooks',
                  element: <WebhookListPage />
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
                  path: 'rules/create',
                  element: <RepoBranchSettingsRulesPageContainer />,
                  children: [
                    {
                      path: ':identifier',
                      element: <RepoBranchSettingsRulesPageContainer />
                    }
                  ]
                }
              ]
            },
            {
              path: 'pipelines',
              children: [{ index: true, element: <RepoPipelineListPage /> }]
            }
          ]
        },
        {
          path: ':spaceId/settings',
          element: <ProjectSettingsLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="general" replace />
            },
            {
              path: 'general',
              element: <>General</>
            },
            {
              path: 'members',
              element: <ProjectMemberListPage />
            }
          ]
        },
        {
          path: ':spaceId/repos/create',
          element: <CreateRepo />
        },
        {
          path: ':spaceId/repos/import',
          element: <ImportRepo />
        },
        {
          path: 'settings',
          element: <SettingsLayout />,
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
        },
        {
          path: 'admin/default-settings',
          element: <UserManagementPageContainer />
        },
        {
          path: 'theme',
          element: <ProfileSettingsThemePage />
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
