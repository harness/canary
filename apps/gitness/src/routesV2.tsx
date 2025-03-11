import { Navigate } from 'react-router-dom'

import { Breadcrumb, Text } from '@harnessio/ui/components'
import {
  EmptyPage,
  ProfileSettingsLayout,
  RepoSettingsLayout,
  SandboxLayout,
  WebhookSettingsLayout
} from '@harnessio/ui/views'

import { AppShell, AppShellMFE } from './components-v2/app-shell'
import { ProjectDropdown } from './components-v2/breadcrumbs/project-dropdown'
import { AppProvider } from './framework/context/AppContext'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { CustomRouteObject, RouteConstants } from './framework/routing/types'
import { useTranslationStore } from './i18n/stores/i18n-store'
import { CreateProject } from './pages-v2/create-project'
import { LandingPage } from './pages-v2/landing-page-container'
import { Logout } from './pages-v2/logout'
import PipelineEditPage from './pages-v2/pipeline/pipeline-edit/pipeline-edit'
import ProjectPipelineListPage from './pages-v2/pipeline/project-pipeline-list-page'
import { SettingsProfileGeneralPage } from './pages-v2/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from './pages-v2/profile-settings/profile-settings-keys-container'
import { ProfileSettingsThemePage } from './pages-v2/profile-settings/profile-settings-theme-page'
import { ProjectLabelFormContainer } from './pages-v2/project/labels/project-label-form-container'
import { ProjectLabelsList } from './pages-v2/project/labels/project-labels-list-container'
import { ProjectGeneralSettingsPageContainer } from './pages-v2/project/project-general-settings-container'
import { ImportProjectContainer } from './pages-v2/project/project-import-container'
import { ProjectMemberListPage } from './pages-v2/project/project-member-list'
import { ProjectSettingsLayout } from './pages-v2/project/project-settings-layout'
import PullRequestChanges from './pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from './pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from './pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from './pages-v2/pull-request/pull-request-data-provider'
import PullRequestLayout from './pages-v2/pull-request/pull-request-layout'
import PullRequestListPage from './pages-v2/pull-request/pull-request-list'
import { RepoLabelFormContainer } from './pages-v2/repo/labels/label-form-container'
import { RepoLabelsList } from './pages-v2/repo/labels/labels-list-container'
import { RepoBranchesListPage } from './pages-v2/repo/repo-branch-list'
import { RepoBranchSettingsRulesPageContainer } from './pages-v2/repo/repo-branch-rules-container'
import { RepoCode } from './pages-v2/repo/repo-code'
import RepoCommitDetailsPage from './pages-v2/repo/repo-commit-details'
import { CommitDiffContainer } from './pages-v2/repo/repo-commit-details-diff'
import RepoCommitsPage from './pages-v2/repo/repo-commits'
import { CreateRepo } from './pages-v2/repo/repo-create-page'
import RepoExecutionListPage from './pages-v2/repo/repo-execution-list'
import { ImportMultipleRepos } from './pages-v2/repo/repo-import-multiple-container'
import { ImportRepo } from './pages-v2/repo/repo-import-page'
import RepoLayout from './pages-v2/repo/repo-layout'
import ReposListPage from './pages-v2/repo/repo-list'
import RepoPipelineListPage from './pages-v2/repo/repo-pipeline-list'
import { RepoSettingsGeneralPageContainer } from './pages-v2/repo/repo-settings-general-container'
import { RepoSidebar } from './pages-v2/repo/repo-sidebar'
import RepoSummaryPage from './pages-v2/repo/repo-summary'
import { RepoTagsListContainer } from './pages-v2/repo/repo-tags-list-container.tsx'
import { SignIn } from './pages-v2/signin'
import { SignUp } from './pages-v2/signup'
import { UserManagementPageContainer } from './pages-v2/user-management/user-management-container'
import { CreateWebhookContainer } from './pages-v2/webhooks/create-webhook-container'
import { WebhookExecutionDetailsContainer } from './pages-v2/webhooks/webhook-execution-details-container'
import { WebhookExecutionsContainer } from './pages-v2/webhooks/webhook-executions'
import WebhookListPage from './pages-v2/webhooks/webhook-list'

enum Page {
  Repositories = 'Repositories',
  Summary = 'Summary',
  Commits = 'Commits',
  Pull_Requests = 'Pull Requests',
  Branches = 'Branches',
  Files = 'Files',
  Conversation = 'Conversation',
  Changes = 'Changes',
  Checks = 'Checks',
  Pipelines = 'Pipelines',
  Executions = 'Executions',
  Settings = 'Settings',
  Branch_Rules = 'Branch Rules',
  Labels = 'Labels',
  Members = 'Members',
  General = 'General',
  Keys = 'Keys',
  Home = 'Home',
  Theme = 'Theme'
}

export const repoRoutes: CustomRouteObject[] = [
  {
    path: 'repos',
    handle: {
      breadcrumb: () => <span>{Page.Repositories}</span>,
      routeName: RouteConstants.toRepositories
    },
    children: [
      {
        index: true,
        element: <ReposListPage />,
        handle: {
          pageTitle: Page.Repositories
        }
      },
      {
        path: 'create',
        element: <CreateRepo />,
        handle: {
          routeName: RouteConstants.toCreateRepo,
          pageTitle: 'Create a Repository'
        }
      },
      {
        path: 'import',
        element: <ImportRepo />,
        handle: {
          routeName: RouteConstants.toImportRepo,
          pageTitle: 'Import a Repository'
        }
      },
      {
        path: 'import-multiple',
        element: <ImportMultipleRepos />,
        handle: {
          routeName: RouteConstants.toImportMultipleRepos,
          pageTitle: 'Import Repositories'
        }
      },
      {
        path: ':repoId',
        element: <RepoLayout />,
        handle: {
          breadcrumb: ({ repoId }: { repoId: string }) => <span>{repoId}</span>,
          pageTitle: ({ repoId }: { repoId: string }) => repoId
        },
        children: [
          {
            index: true,
            element: <Navigate to="summary" replace />
          },
          {
            path: 'summary',
            element: <RepoSummaryPage />,
            handle: {
              breadcrumb: () => <span>{Page.Summary}</span>,
              routeName: RouteConstants.toRepoSummary,
              pageTitle: Page.Summary
            }
          }
        ]
      }
    ]
  }
]

export const mfeRoutes = (mfeProjectId = '', mfeRouteRenderer: JSX.Element | null = null): CustomRouteObject[] => [
  {
    path: '/',
    element: (
      <AppProvider>
        {mfeRouteRenderer}
        <AppShellMFE />
      </AppProvider>
    ),
    handle: { routeName: RouteConstants.toHome },
    children: [
      {
        path: '',
        handle: {
          ...(mfeProjectId && {
            breadcrumb: () => <span>{mfeProjectId}</span>
          })
        },
        children: repoRoutes
      }
    ]
  }
]
