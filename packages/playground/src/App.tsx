import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { noop } from 'lodash-es'

import { TooltipProvider } from '@harnessio/canary'
import { SandboxRepoListPage } from '@harnessio/ui/views'

import { CreatePipelinePage } from './components/create-pipeline-page'
import { SettingsProjectNav } from './components/project-settings-nav'
import { RepoBranchSettingsRulesPage } from './components/repo-branch-settings-rules-page'
// import { SandboxSettingsProjectGeneralPage } from './components/sandbox-settings-project-general-page'
// import { SandboxSettingsProjectMembersPage } from './pages/sandbox-settings-project-members-page'
import { RepoCreatePageForm } from './components/repo-create-form'
import type { BypassUsersList } from './components/repo-settings/repo-branch-settings-rules/types'
// import { SandboxRepoSettingsPage } from './pages/sandbox-repo-settings-page'
import { RepoSettingsPage } from './components/repo-settings/repo-settings-page'
import { RepoSettingsPlaceholderPage } from './components/repo-settings/repo-settings-placeholder'
import { RepoWebhooksCreatePage } from './components/repo-webhooks-create-page'
import { SettingsAccountPage } from './components/settings-account-page'
import { SettingsCreateNewUserForm } from './components/settings-create-new-user-form'
// import { SandboxSettingsCreateNewMemberPage } from './pages/sandbox-settings-create-new-member-page'
import { SettingsUserManagementPage } from './components/settings-user-management-page'
import { SignInPage } from './components/signin-page'
import { ThemeProvider } from './components/theme-provider'
import { gitIgnoreOptions, licenseOptions } from './data/mockCreateRepoData'
import { mockUsersData } from './data/mockUsersData'
import PipelineLayout from './layouts/PipelineLayout'
import PullRequestLayout from './layouts/PullRequestLayout'
import RepoLayout from './layouts/RepoLayout'
import { RootLayout } from './layouts/RootLayout'
import { SandboxExecutions } from './layouts/SandboxExecutions'
import SandboxPullRequestLayout from './layouts/SandboxPullRequestLayout'
import { SandboxRepo } from './layouts/SandboxRepo'
import { SandboxRoot } from './layouts/SandboxRoot'
import { SandboxSettings } from './layouts/SandboxSettings'
import BranchesListPage from './pages/branches-list-page'
import CommitsDetailsPage from './pages/commits-details-page'
import CommitsListPage from './pages/commits-list-page'
import ErrorPage from './pages/error-page'
import ExecutionDetailsPage from './pages/execution-details-page'
import LandingPage from './pages/landing-page'
import { currentUser } from './pages/mocks/mockCurrentUserData'
import { mockBypassUserData, mockStatusChecks } from './pages/mocks/repo-branch-settings/mockData'
import PipelineEdit from './pages/pipeline-edit-page'
import PipelineListPage from './pages/pipeline-list-page'
import PullRequestChangesPage from './pages/pull-request-changes-page'
import PullRequestChecksPage from './pages/pull-request-checks-page'
import PullRequestCommitsPage from './pages/pull-request-commits-page'
import PullRequestConversationPage from './pages/pull-request-conversation-page'
import PullRequestListPage from './pages/pull-request-list-page'
import RepoExecutionListPage from './pages/repo-execution-list-page'
import RepoListPage from './pages/repo-list-page'
import RepoPipelineListPage from './pages/repo-pipeline-list-page'
import { RepoSettingsCollaborationsPage } from './pages/repo-settings-collaborations-page'
import { RepoSettingsGeneralPlaygroundContainer } from './pages/repo-settings-general-page-playground-container'
import { RepoSettingsModerationPage } from './pages/repo-settings-moderation-page'
import RepoSummaryPage from './pages/repo-summary-page'
import RepoWebhooksListPage from './pages/repo-webhooks-page'
import SandboxBranchesListPage from './pages/sandbox-branches-list-page'
import SandboxCommitsListPage from './pages/sandbox-commits-list-page'
import { SandboxExecutionArtifactsPage } from './pages/sandbox-executions-artifacts-page'
import { SandboxExecutionInputsPage } from './pages/sandbox-executions-inputs-page'
import { SandboxExecutionLogsPage } from './pages/sandbox-executions-logs-page'
import { SandboxExecutionPolicyEvaluationsPage } from './pages/sandbox-executions-policy-evaluations-page'
import { SandboxExecutionSecretsPage } from './pages/sandbox-executions-secrets-page'
import { SandboxExecutionSecurityTestsPage } from './pages/sandbox-executions-security-tests-page'
import { SandboxExecutionSummaryPage } from './pages/sandbox-executions-summary-page'
import { SandboxExecutionTestsPage } from './pages/sandbox-executions-tests-page'
import { SandboxLandingPage } from './pages/sandbox-landing-page'
import SandboxPullRequestComparePage from './pages/sandbox-pull-request-compare-page'
import SandboxPullRequestConversationPage from './pages/sandbox-pull-request-conversation-page'
import SandboxPullRequestListPage from './pages/sandbox-pull-request-list-page'
import { SandboxRepoCodePage } from './pages/sandbox-repo-code-page'
import SandboxRepoExecutionsListPage from './pages/sandbox-repo-execution-list-page'
import { SandboxRepoImportPage } from './pages/sandbox-repo-import-page'
import SandboxRepoPipelineListPage from './pages/sandbox-repo-pipeline-list-page'
import { SandboxRepoSinglePage } from './pages/sandbox-repo-single-page'
import { SandboxRepoSummaryPage } from './pages/sandbox-repo-summary-page'
import SandboxRepoWebhooksListPage from './pages/sandbox-repo-webhooks-list-page'
import { SettingsAccountGeneralPage } from './pages/settings-account-general-page'
import { SettingsAccountKeysPage } from './pages/settings-account-keys-page'

const router = createBrowserRouter([
  // TEMPORARY LAYOUT SANDBOX
  {
    path: '/sandbox',
    element: <SandboxRoot currentUser={currentUser} currentSpaceId="spaceId" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'repos',
        element: <SandboxRepo />, // Contains the breadcrumbs header
        children: [
          {
            index: true,
            element: <SandboxRepoListPage />
          },
          {
            path: 'create',
            element: (
              <RepoCreatePageForm
                apiError=""
                isLoading={false}
                isSuccess={false}
                onFormCancel={noop}
                onFormSubmit={noop}
                licenseOptions={licenseOptions}
                gitIgnoreOptions={gitIgnoreOptions}
              />
            )
          },
          {
            path: 'import',
            element: <SandboxRepoImportPage />
          },
          {
            path: ':repoId',
            element: <SandboxRepoSinglePage />, // Contains the nav tabs header AND inherits the breadcrumbs header
            children: [
              {
                path: 'summary',
                element: <SandboxRepoSummaryPage />
              },
              {
                path: 'code',
                element: <SandboxRepoCodePage />
              },
              {
                path: 'pull-requests/compare',
                element: <SandboxPullRequestComparePage />
              },
              {
                path: 'pull-requests',
                element: <SandboxPullRequestListPage />
              },
              {
                path: 'pull-requests/:pullRequestId',
                element: <SandboxPullRequestLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="conversation" />
                  },
                  {
                    path: 'conversation',
                    element: <SandboxPullRequestConversationPage />
                  },
                  {
                    path: 'changes',
                    element: <PullRequestChangesPage />
                  },
                  {
                    path: 'commits',
                    element: <PullRequestCommitsPage />
                  },
                  {
                    path: 'checks',
                    element: <PullRequestChecksPage />
                  }
                ]
              },
              {
                path: 'branches',
                element: <SandboxBranchesListPage />
              },
              {
                path: 'webhooks',
                element: <SandboxRepoWebhooksListPage />
              },
              {
                path: 'webhooks/create',
                element: (
                  <RepoWebhooksCreatePage
                    onFormSubmit={noop}
                    onFormCancel={noop}
                    isLoading={false}
                    preSetWebHookData={null}
                  />
                )
              },
              {
                path: 'pipelines',
                element: <SandboxRepoPipelineListPage />
              },
              {
                path: 'pipelines/create',
                element: <CreatePipelinePage />
              },
              {
                path: 'pipelines/:pipelineId',
                children: [
                  {
                    index: true,
                    element: <SandboxRepoExecutionsListPage />
                  },
                  {
                    path: 'edit',
                    element: <PipelineEdit />
                  },
                  {
                    path: 'executions',
                    element: <SandboxRepoExecutionsListPage />
                  },
                  {
                    path: 'executions/:executionId',
                    element: <ExecutionDetailsPage />
                  }
                ]
              },
              {
                path: 'commits',
                element: <SandboxCommitsListPage />
              },
              {
                path: 'commits/:commitId',
                element: <CommitsDetailsPage />
              },
              {
                path: 'settings',
                element: <RepoSettingsPage />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="general" />
                  },
                  {
                    path: 'general',
                    element: <RepoSettingsGeneralPlaygroundContainer />
                  },
                  {
                    path: 'collaborations',
                    element: <RepoSettingsCollaborationsPage />
                  },
                  {
                    path: 'moderation',
                    element: <RepoSettingsModerationPage />
                  },
                  {
                    path: 'rules',
                    element: <RepoSettingsGeneralPlaygroundContainer />
                  },
                  {
                    path: 'rules/create',
                    element: (
                      <RepoBranchSettingsRulesPage
                        handleRuleUpdate={noop}
                        principals={mockBypassUserData as BypassUsersList[]}
                        recentStatusChecks={mockStatusChecks}
                      />
                    )
                  },
                  {
                    path: '*',
                    element: <RepoSettingsPlaceholderPage />
                  }
                ]
              }
            ]
          }
        ]
      },

      {
        path: 'executions',
        element: <SandboxExecutions />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Navigate to="summary" replace />
          },
          {
            path: 'summary',
            element: <SandboxExecutionSummaryPage />
          },
          {
            path: 'logs',
            element: <SandboxExecutionLogsPage />
          },
          {
            path: 'inputs',
            element: <SandboxExecutionInputsPage />
          },
          {
            path: 'policy-evaluations',
            element: <SandboxExecutionPolicyEvaluationsPage />
          },
          {
            path: 'artifacts',
            element: <SandboxExecutionArtifactsPage />
          },
          {
            path: 'tests',
            element: <SandboxExecutionTestsPage />
          },
          {
            path: 'security-tests',
            element: <SandboxExecutionSecurityTestsPage />
          },
          {
            path: 'secrets',
            element: <SandboxExecutionSecretsPage />
          }
        ]
      },
      {
        path: 'settings',
        element: <SandboxSettings />,
        children: [
          {
            path: 'account',
            element: <SettingsAccountPage />,
            children: [
              {
                index: true,
                element: <Navigate to="general" />
              },
              {
                path: 'general',
                element: <SettingsAccountGeneralPage />
              },
              {
                path: 'keys',
                element: <SettingsAccountKeysPage />
              }
            ]
          },
          {
            path: 'project',
            element: <SettingsProjectNav />,
            children: [
              {
                index: true,
                element: <Navigate to="general" />
              }
              // {
              //   path: 'general',
              //   element: <SandboxSettingsProjectGeneralPage />
              // },
              // {
              //   path: 'members',
              //   children: [
              //     { index: true, element: <SandboxSettingsProjectMembersPage /> },
              //     {
              //       path: 'create',
              //       element: <SandboxSettingsCreateNewMemberPage />
              //     }
              //   ]
              // }
            ]
          }
        ]
      },

      {
        path: 'landing',
        element: <SandboxLandingPage />
      },
      {
        path: 'users',
        element: (
          <SettingsUserManagementPage
            userData={mockUsersData}
            handleDeleteUser={noop}
            handleUpdatePassword={noop}
            handleUpdateUser={noop}
            updateUserAdmin={noop}
            currentPage={1}
            totalPages={1}
            setPage={noop}
          />
        )
      },

      {
        path: 'users/create',
        element: <SettingsCreateNewUserForm handleCreateUser={noop} isLoading={false} apiError={null} />
      }
    ]
  },

  {
    path: 'signin',
    element: <SignInPage handleSignIn={noop} />
  },
  {
    path: '/',
    element: <RootLayout currentUser={currentUser} />,
    errorElement: <ErrorPage />,
    children: [
      // LANDING
      {
        path: '/',
        element: <LandingPage />
      },
      // REPOS
      {
        path: 'repos',
        element: <RepoListPage />
      },
      {
        path: 'repos/:repoId',
        element: <RepoLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/sandbox/repos/drone/summary" />
          },
          {
            path: 'summary',
            element: <RepoSummaryPage />
          },
          {
            path: 'pipelines',
            element: <RepoPipelineListPage />
          },
          {
            path: 'pipelines/create',
            element: <CreatePipelinePage />
          },
          {
            path: 'pipelines/:pipelineId',
            children: [
              {
                index: true,
                element: <RepoExecutionListPage />
              },
              {
                path: 'edit',
                element: <PipelineEdit />
              },
              {
                path: 'executions',
                element: <RepoExecutionListPage />
              },
              {
                path: 'executions/:executionId',
                element: <ExecutionDetailsPage />
              }
            ]
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
                element: <PullRequestConversationPage />
              },
              {
                path: 'changes',
                element: <PullRequestChangesPage />
              },
              {
                path: 'commits',
                element: <PullRequestCommitsPage />
              },
              {
                path: 'checks',
                element: <PullRequestChecksPage />
              }
            ]
          },
          {
            path: 'branches',
            element: <BranchesListPage />
          },
          {
            path: 'webhooks',
            element: <RepoWebhooksListPage />
          },
          {
            path: 'webhooks/create',
            element: (
              <RepoWebhooksCreatePage
                onFormSubmit={noop}
                onFormCancel={noop}
                isLoading={false}
                preSetWebHookData={null}
              />
            )
          },
          {
            path: 'commits',
            element: <CommitsListPage />
          },
          {
            path: 'commits/:commitId',
            element: <CommitsDetailsPage />
          }
        ]
      },
      // PIPELINES (OUTSIDE REPOS)
      {
        path: 'pipelines',
        element: <PipelineLayout />,
        children: [
          {
            index: true,
            element: <PipelineListPage />
          },
          {
            path: 'create',
            element: <CreatePipelinePage />
          }
        ]
      },
      // EXECUTIONS (OUTSIDE REPOS)
      {
        path: 'executions',
        element: <Navigate to="/sandbox/executions" />
      }
    ]
  }
])

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  )
}
