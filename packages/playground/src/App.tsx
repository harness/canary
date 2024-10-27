import React from 'react'
import { noop } from 'lodash-es'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { TooltipProvider } from '@harnessio/canary'
import { ThemeProvider } from './components/theme-provider'
import { RootLayout } from './layouts/RootLayout'
import RepoLayout from './layouts/RepoLayout'
import PipelineLayout from './layouts/PipelineLayout'
import PullRequestLayout from './layouts/PullRequestLayout'
import ErrorPage from './pages/error-page'
import LandingPage from './pages/landing-page'
import RepoListPage from './pages/repo-list-page'
import PipelineListPage from './pages/pipeline-list-page'
import RepoSummaryPage from './pages/repo-summary-page'
import ExecutionDetailsPage from './pages/execution-details-page'
import PullRequestListPage from './pages/pull-request-list-page'
import CommitsListPage from './pages/commits-list-page'
import BranchesListPage from './pages/branches-list-page'
import CommitsDetailsPage from './pages/commits-details-page'
import PullRequestConversationPage from './pages/pull-request-conversation-page'
import PullRequestChangesPage from './pages/pull-request-changes-page'
import PullRequestChecksPage from './pages/pull-request-checks-page'
import PipelineEdit from './pages/pipeline-edit-page'
import PullRequestCommitsPage from './pages/pull-request-commits-page'
import RepoPipelineListPage from './pages/repo-pipeline-list-page'
import RepoExecutionListPage from './pages/repo-execution-list-page'
import RepoWebhooksListPage from './pages/repo-webhooks-page'
import { CreatePipelinePage } from './pages/create-pipeline-page'
import { SandboxRoot } from './layouts/SandboxRoot'
import { SandboxRepo } from './layouts/SandboxRepo'
import { SandboxRepoListPage } from './pages/sandbox-repo-list-page'
import { SandboxRepoSummaryPage } from './pages/sandbox-repo-summary-page'
import { SandboxRepoSinglePage } from './pages/sandbox-repo-single-page'
import { SandboxRepoCodePage } from './pages/sandbox-repo-code-page'
import { SandboxLandingPage } from './pages/sandbox-landing-page'
import { SandboxExecutionSummaryPage } from './pages/sandbox-executions-summary-page'
import { SandboxExecutions } from './layouts/SandboxExecutions'
import { SandboxExecutionLogsPage } from './pages/sandbox-executions-logs-page'
import { SandboxExecutionInputsPage } from './pages/sandbox-executions-inputs-page'
import { SandboxExecutionPolicyEvaluationsPage } from './pages/sandbox-executions-policy-evaluations-page'
import { SandboxExecutionArtifactsPage } from './pages/sandbox-executions-artifacts-page'
import { SandboxExecutionTestsPage } from './pages/sandbox-executions-tests-page'
import { SandboxExecutionSecurityTestsPage } from './pages/sandbox-executions-security-tests-page'
import { SandboxExecutionSecretsPage } from './pages/sandbox-executions-secrets-page'
import { SandboxSettings } from './layouts/SandboxSettings'
import { SandboxSettingsAccountPage } from './pages/sandbox-settings-account-page'
import { SandboxSettingsAccountKeysPage } from './pages/sandbox-settings-account-keys-page'
import { SandboxSettingsProjectPage } from './pages/sandbox-settings-project-page'
import { SandboxSettingsProjectGeneralPage } from './pages/sandbox-settings-project-general-page'
import { SandboxSettingsProjectMembersPage } from './pages/sandbox-settings-project-members-page'
import { SandboxRepoCreatePage } from './pages/sandbox-repo-create-page'
import { SandboxRepoSettingsPage } from './pages/sandbox-repo-settings-page'
import { RepoSettingsGeneralPlaygroundContainer } from './pages/repo-settings-general-page-playground-container'
import { RepoSettingsCollaborationsPage } from './pages/repo-settings-collaborations-page'
import { RepoSettingsModerationPage } from './pages/repo-settings-moderation-page'
import { RepoSettingsPlaceholderPage } from './pages/repo-settings-placeholder-page'
import { SandboxSettingsAccountGeneralPage } from './pages/sandbox-settings-account-general-page'
import { SandboxSettingsCreateNewMemberPage } from './pages/sandbox-settings-create-new-member-page'
import { SandboxSettingsUserManagementPage } from './pages/sandbox-settings-user-management-page'
import { SandboxSettingsCreateNewUserPage } from './pages/sandbox-settings-create-new-user-page'
import { SignInPage } from './pages/signin-page'
import { RepoBranchSettingsRulesPage } from './pages/repo-branch-settings-rules-page'
import SandboxPullRequestComparePage from './pages/sandbox-pull-request-compare-page'
import { mockBypassUserData, mockStatusChecks } from './pages/mocks/repo-branch-settings/mockData'
import { BypassUsersList } from './components/repo-settings/repo-branch-settings-rules/types'
import { currentUser } from './pages/mocks/mockCurrentUserData'

const router = createBrowserRouter([
  // TEMPORARY LAYOUT SANDBOX
  {
    path: '/sandbox',
    element: <SandboxRoot currentUser={currentUser} />,
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
            element: <SandboxRepoCreatePage apiError="" isLoading isSuccess onFormCancel={noop} onFormSubmit={noop} />
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
                path: 'settings',
                element: <SandboxRepoSettingsPage />,
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
            element: <SandboxSettingsAccountPage />,
            children: [
              {
                index: true,
                element: <Navigate to="general" />
              },
              {
                path: 'general',
                element: <SandboxSettingsAccountGeneralPage />
              },
              {
                path: 'keys',
                element: <SandboxSettingsAccountKeysPage />
              }
            ]
          },
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
                element: <SandboxSettingsProjectGeneralPage />
              },
              {
                path: 'members',
                element: <SandboxSettingsProjectMembersPage />
              },
              {
                path: 'create-new-member',
                element: <SandboxSettingsCreateNewMemberPage />
              }
            ]
          },
          {
            path: 'user-mamagement',
            element: <SandboxSettingsProjectPage />,
            children: [
              {
                index: true,
                element: <Navigate to="users" />
              },
              {
                path: 'users',
                element: <SandboxSettingsUserManagementPage />
              },
              {
                path: 'create-new-user',
                element: <SandboxSettingsCreateNewUserPage />
              }
            ]
          }
        ]
      },
      {
        path: 'landing',
        element: <SandboxLandingPage />
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
