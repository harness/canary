import { Navigate } from 'react-router-dom'

import { Breadcrumb, Layout, Sidebar } from '@harnessio/ui/components'
import {
  EmptyPage,
  ProfileSettingsLayout,
  RepoSettingsLayout,
  SandboxLayout,
  WebhookSettingsLayout
} from '@harnessio/ui/views'

import { AppShellMFE } from './components-v2/mfe/app-shell'
import { ProjectDropdown } from './components-v2/project-dropdown'
import { AppShell } from './components-v2/standalone/app-shell'
import { AppProvider } from './framework/context/AppContext'
import { AppRouterProvider } from './framework/context/AppRouterProvider'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { CustomRouteObject, RouteConstants } from './framework/routing/types'
import { CreateProject } from './pages-v2/create-project'
import { LandingPage } from './pages-v2/landing-page-container'
import { Logout } from './pages-v2/logout'
import { SettingsProfileGeneralPage } from './pages-v2/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from './pages-v2/profile-settings/profile-settings-keys-container'
import { ProjectLabelFormContainer } from './pages-v2/project/labels/project-label-form-container'
import { ProjectLabelsList } from './pages-v2/project/labels/project-labels-list-container'
import { ProjectGeneralSettingsPageContainer } from './pages-v2/project/project-general-settings-container'
import { ImportProjectContainer } from './pages-v2/project/project-import-container'
import { ProjectMemberListPage } from './pages-v2/project/project-member-list'
import { ProjectRulesListContainer } from './pages-v2/project/project-rules-list-container'
import { ProjectSettingsLayout } from './pages-v2/project/project-settings-layout'
import ProjectPullRequestListPage from './pages-v2/project/pull-request/pull-request-list'
import { ProjectBranchRulesContainer } from './pages-v2/project/rules/project-branch-rules-container'
import { ProjectRulesContainer } from './pages-v2/project/rules/project-rules-container'
import { ProjectTagRulesContainer } from './pages-v2/project/rules/project-tag-rules-container'
import PullRequestChanges from './pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from './pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from './pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from './pages-v2/pull-request/pull-request-data-provider'
import PullRequestLayout from './pages-v2/pull-request/pull-request-layout'
import RepoPullRequestListPage from './pages-v2/pull-request/pull-request-list'
import { RepoLabelFormContainer } from './pages-v2/repo/labels/label-form-container'
import { RepoLabelsList } from './pages-v2/repo/labels/labels-list-container'
import { RepoBranchesListPage } from './pages-v2/repo/repo-branch-list'
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
import { RepoSettingsGeneralPageContainer } from './pages-v2/repo/repo-settings-general-container'
import { RepoSettingsRulesListContainer } from './pages-v2/repo/repo-settings-rules-list-container'
import { RepoSidebar } from './pages-v2/repo/repo-sidebar'
import RepoSummaryPage from './pages-v2/repo/repo-summary'
import { RepoTagsListContainer } from './pages-v2/repo/repo-tags-list-container'
import { RepoBranchRulesContainer } from './pages-v2/repo/rules/repo-branch-rules-container'
import RepoRulesContainer from './pages-v2/repo/rules/repo-rules-container'
import { RepoTagRulesContainer } from './pages-v2/repo/rules/repo-tag-rules-container'
import SearchPage from './pages-v2/search-page'
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
  Theme = 'Theme',
  Search = 'Search',
  Tags = 'Tags'
}

const labelsRoute = {
  path: 'labels',
  handle: {
    breadcrumb: () => <span>{Page.Labels}</span>,
    pageTitle: Page.Labels,
    routeName: RouteConstants.toProjectLabels
  },
  children: [
    {
      index: true,
      element: <ProjectLabelsList />
    },
    {
      path: 'create',
      element: <ProjectLabelFormContainer />,
      handle: {
        breadcrumb: () => <span>Create a label</span>
      }
    },
    {
      path: ':labelId',
      element: <ProjectLabelFormContainer />,
      handle: {
        breadcrumb: ({ labelId }: { labelId: string }) => <span>{labelId}</span>
      }
    }
  ]
}

const rulesRoute = {
  path: 'rules',
  handle: {
    breadcrumb: () => <span>{Page.Branch_Rules}</span>,
    pageTitle: Page.Branch_Rules,
    routeName: RouteConstants.toProjectRules
  },

  children: [
    {
      index: true,
      element: <ProjectRulesListContainer />
    },
    {
      path: 'create/branch',
      element: <ProjectBranchRulesContainer />,
      handle: {
        breadcrumb: () => <span>Create a branch rule</span>,
        routeName: RouteConstants.toProjectBranchRuleCreate
      }
    },
    {
      path: 'create/tag',
      element: <ProjectTagRulesContainer />,
      handle: {
        breadcrumb: () => <span>Create a tag rule</span>,
        routeName: RouteConstants.toProjectTagRuleCreate
      }
    },
    {
      path: ':ruleId',
      element: <ProjectRulesContainer />,
      handle: {
        breadcrumb: ({ ruleId }: { ruleId: string }) => <span>{ruleId}</span>,
        routeName: RouteConstants.toProjectRuleDetails
      }
    }
  ]
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
            },
            children: [
              {
                path: '*',
                element: <RepoSummaryPage />
              }
            ]
          },
          {
            path: 'commits',
            handle: {
              breadcrumb: () => <span>{Page.Commits}</span>,
              routeName: RouteConstants.toRepoCommits
            },
            children: [
              {
                index: true,
                element: <RepoCommitsPage />,
                handle: {
                  pageTitle: Page.Commits
                }
              },
              {
                path: ':branchId',
                element: <RepoCommitsPage />,
                handle: {
                  pageTitle: Page.Commits,
                  routeName: RouteConstants.toRepoBranchCommits
                }
              },
              {
                path: 'refs/tags/:tagId',
                element: <RepoCommitsPage />,
                handle: {
                  pageTitle: Page.Commits,
                  routeName: RouteConstants.toRepoTagCommits
                }
              },
              {
                path: 'commit/:commitSHA',
                element: <RepoCommitDetailsPage showSidebar={false} />,
                handle: {
                  breadcrumb: ({ commitSHA }: { commitSHA: string }) => (
                    <>
                      <span>{commitSHA.substring(0, 7)}</span>
                    </>
                  ),
                  routeName: RouteConstants.toRepoCommitDetails
                },
                children: [
                  {
                    index: true,
                    element: (
                      <ExplorerPathsProvider>
                        <CommitDiffContainer showSidebar={false} />
                      </ExplorerPathsProvider>
                    )
                  }
                ]
              }
            ]
          },
          {
            path: 'branches',
            element: <RepoBranchesListPage />,
            handle: {
              breadcrumb: () => <span>{Page.Branches}</span>,
              routeName: RouteConstants.toRepoBranches,
              pageTitle: Page.Branches
            }
          },
          {
            path: 'files',
            element: (
              <ExplorerPathsProvider>
                <RepoSidebar />
              </ExplorerPathsProvider>
            ),
            handle: {
              breadcrumb: () => <span>{Page.Files}</span>,
              routeName: RouteConstants.toRepoFiles
            },
            children: [
              {
                index: true,
                element: <RepoCode />,
                handle: {
                  pageTitle: Page.Files
                }
              },
              {
                path: '*',
                element: <RepoCode />,
                handle: {
                  routeName: RouteConstants.toRepoFileDetails
                }
              }
            ]
          },
          {
            path: 'tags',
            element: <RepoTagsListContainer />,
            handle: {
              breadcrumb: () => <span>{Page.Tags}</span>,
              routeName: RouteConstants.toRepoTags
            }
          },
          {
            path: 'search',
            element: <SearchPage />,
            handle: {
              breadcrumb: () => <span>{Page.Search}</span>,
              routeName: RouteConstants.toRepoSearch
            }
          },
          {
            path: 'pulls',
            handle: {
              breadcrumb: () => <span>{Page.Pull_Requests}</span>,
              routeName: RouteConstants.toRepoPullRequests
            },
            children: [
              {
                index: true,
                element: <RepoPullRequestListPage />,
                handle: {
                  pageTitle: Page.Pull_Requests
                }
              },
              {
                path: 'compare',
                handle: {
                  breadcrumb: () => <span>Compare</span>,
                  asLink: false
                },
                children: [
                  { index: true, element: <CreatePullRequest /> },
                  {
                    path: ':diffRefs',
                    element: <CreatePullRequest />,
                    handle: { routeName: RouteConstants.toPullRequestCompare }
                  },
                  { path: '*', element: <CreatePullRequest /> }
                ]
              },
              {
                path: ':pullRequestId',
                element: <PullRequestLayout />,
                handle: {
                  breadcrumb: ({ pullRequestId }: { pullRequestId: string }) => <span>{pullRequestId}</span>,
                  routeName: RouteConstants.toPullRequest,
                  pageTitle: ({ pullRequestId }: { pullRequestId: string }) => `PR #${pullRequestId}`
                },
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
                    ),
                    handle: {
                      routeName: RouteConstants.toPullRequestConversation,
                      pageTitle: Page.Conversation
                    }
                  },
                  {
                    path: 'commits',
                    element: <PullRequestCommitPage />,
                    handle: {
                      breadcrumb: () => <span>{Page.Commits}</span>,
                      routeName: RouteConstants.toPullRequestCommits,
                      pageTitle: Page.Commits
                    }
                  },
                  {
                    path: 'changes',
                    element: (
                      <PullRequestDataProvider>
                        <PullRequestChanges />
                      </PullRequestDataProvider>
                    ),
                    handle: {
                      breadcrumb: () => <span>{Page.Changes}</span>,
                      routeName: RouteConstants.toPullRequestChanges,
                      pageTitle: Page.Changes
                    }
                  },
                  {
                    path: 'checks',
                    element: <EmptyPage pathName="PR Checks" />,
                    handle: {
                      breadcrumb: () => <span>{Page.Checks}</span>,
                      routeName: RouteConstants.toPullRequestChecks,
                      pageTitle: Page.Checks
                    }
                  }
                ]
              }
            ]
          },
          {
            path: 'pipelines',
            handle: {
              breadcrumb: () => <span>{Page.Pipelines}</span>,
              routeName: RouteConstants.toRepoPipelines
            },
            children: [
              {
                index: true,
                element: <>RepoPipelineListPage</>,
                handle: {
                  pageTitle: Page.Pipelines
                }
              },
              {
                path: ':pipelineId',
                handle: {
                  breadcrumb: ({ pipelineId }: { pipelineId: string }) => <span>{pipelineId}</span>
                },
                children: [
                  {
                    index: true,
                    element: <RepoExecutionListPage />,
                    handle: {
                      breadcrumb: () => <span>{Page.Executions}</span>,
                      pageTitle: Page.Executions
                    }
                  },
                  {
                    path: 'edit',
                    element: <>PipelineEditPage</>,
                    handle: {
                      breadcrumb: () => <span>Edit</span>,
                      routeName: RouteConstants.toPipelineEdit
                    }
                  },
                  {
                    path: 'executions',
                    handle: {
                      routeName: RouteConstants.toExecutions
                    },
                    children: [
                      { index: true, element: <RepoExecutionListPage />, handle: { pageTitle: Page.Executions } },
                      {
                        path: ':executionId',
                        element: <>Execution Details Page</>,
                        handle: {
                          breadcrumb: ({ executionId }: { executionId: string }) => <span>{executionId}</span>,
                          routeName: RouteConstants.toExecution
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: 'settings',
            element: <RepoSettingsLayout />,
            handle: {
              breadcrumb: () => <span>{Page.Settings}</span>,
              pageTitle: Page.Settings
            },
            children: [
              {
                index: true,
                element: <Navigate to="general" replace />
              },
              {
                path: 'general',
                element: <RepoSettingsGeneralPageContainer />,
                handle: {
                  breadcrumb: () => <span>{Page.General}</span>,
                  routeName: RouteConstants.toRepoGeneralSettings,
                  pageTitle: Page.General
                }
              },
              {
                path: 'rules',
                handle: {
                  breadcrumb: () => <span>{Page.Branch_Rules}</span>,
                  routeName: RouteConstants.toRepoBranchRules
                },
                children: [
                  {
                    index: true,
                    element: <RepoSettingsRulesListContainer />,
                    handle: {
                      pageTitle: Page.Branch_Rules
                    }
                  },
                  {
                    path: 'create/branch',
                    element: <RepoBranchRulesContainer />,
                    handle: {
                      breadcrumb: () => <span>Create a rule</span>,
                      routeName: RouteConstants.toRepoBranchRuleCreate
                    }
                  },
                  {
                    path: 'create/tag',
                    element: <RepoTagRulesContainer />,
                    handle: {
                      breadcrumb: () => <span>Create a tag</span>,
                      routeName: RouteConstants.toRepoTagRuleCreate
                    }
                  },
                  {
                    path: ':identifier',
                    element: <RepoRulesContainer />,
                    handle: {
                      breadcrumb: ({ identifier }: { identifier: string }) => <span>{identifier}</span>,
                      routeName: RouteConstants.toRepoBranchRule
                    }
                  }
                ]
              },
              {
                path: 'webhooks',
                handle: {
                  breadcrumb: () => <span>Webhooks</span>,
                  routeName: RouteConstants.toRepoWebhooks
                },
                children: [
                  {
                    index: true,
                    element: <WebhookListPage />,
                    handle: {
                      pageTitle: 'Webhooks'
                    }
                  },
                  {
                    path: 'create',
                    element: <CreateWebhookContainer />,
                    handle: {
                      breadcrumb: () => <span>Create a webhook</span>,
                      routeName: RouteConstants.toRepoWebhookCreate
                    }
                  }
                ]
              },
              {
                path: 'labels',
                handle: {
                  breadcrumb: () => <span>{Page.Labels}</span>,
                  pageTitle: Page.Labels,
                  routeName: RouteConstants.toRepoLabels
                },
                children: [
                  {
                    index: true,
                    element: <RepoLabelsList />
                  },
                  {
                    path: 'create',
                    element: <RepoLabelFormContainer />,
                    handle: {
                      breadcrumb: () => <span>Create a label</span>
                    }
                  },
                  {
                    path: ':labelId',
                    element: <RepoLabelFormContainer />,
                    handle: {
                      breadcrumb: ({ labelId }: { labelId: string }) => <span>{labelId}</span>
                    }
                  }
                ]
              }
            ]
          },

          {
            path: 'settings/webhooks/:webhookId',
            element: <WebhookSettingsLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="details" replace />
              },
              {
                path: 'details',
                element: <CreateWebhookContainer />,
                handle: {
                  breadcrumb: ({ webhookId }: { webhookId: string }) => (
                    <Breadcrumb.Item>
                      <span>{webhookId}</span> <Breadcrumb.Separator />
                      <span className="ml-1.5">Details</span>
                    </Breadcrumb.Item>
                  ),
                  routeName: RouteConstants.toRepoWebhookDetails
                }
              },
              {
                path: 'executions',
                element: <WebhookExecutionsContainer />,
                handle: {
                  breadcrumb: ({ webhookId }: { webhookId: string }) => (
                    <Breadcrumb.Item>
                      <span>{webhookId}</span> <Breadcrumb.Separator />
                      <span className="ml-1.5">Executions</span>
                    </Breadcrumb.Item>
                  ),
                  routeName: RouteConstants.toRepoWebhookExecutions
                }
              },
              {
                path: 'executions/:executionId',
                element: <WebhookExecutionDetailsContainer />,
                handle: {
                  breadcrumb: ({ webhookId, executionId }: { webhookId: string; executionId: string }) => (
                    <Breadcrumb.Item>
                      <span>{webhookId}</span> <Breadcrumb.Separator />
                      <span className="ml-1.5">Executions</span>
                      <Breadcrumb.Separator className="mx-1.5" />
                      <span>{executionId}</span>
                    </Breadcrumb.Item>
                  ),
                  routeName: RouteConstants.toRepoWebhookExecutionDetails
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'settings',
    element: <ProjectSettingsLayout />,
    handle: {
      breadcrumb: () => <span>{Page.Settings}</span>,
      pageTitle: Page.Settings
    },
    children: [
      {
        index: true,
        element: <Navigate to="general" replace />
      },
      {
        path: 'general',
        element: <ProjectGeneralSettingsPageContainer />,
        handle: {
          breadcrumb: () => <span>{Page.General}</span>,
          routeName: RouteConstants.toProjectGeneral,
          pageTitle: Page.General
        }
      },
      {
        path: 'members',
        element: <ProjectMemberListPage />,
        handle: {
          breadcrumb: () => <span>{Page.Members}</span>,
          routeName: RouteConstants.toProjectMembers,
          pageTitle: Page.Members
        }
      },
      labelsRoute,
      rulesRoute
    ]
  },
  {
    path: 'pipelines',
    element: <>ProjectPipelineListPage</>,
    handle: {
      breadcrumb: () => <span>{Page.Pipelines}</span>,
      pageTitle: Page.Pipelines
    },
    children: []
  },
  {
    path: 'search',
    element: <SearchPage />,
    handle: {
      breadcrumb: () => <span>{Page.Search}</span>,
      pageTitle: Page.Search
    }
  },
  {
    path: 'manage-repositories',
    element: <ProjectSettingsLayout />,
    handle: {
      breadcrumb: () => <span>{Page.Settings}</span>,
      pageTitle: Page.Settings
    },
    children: [
      {
        index: true,
        element: <Navigate to="labels" replace />
      },
      labelsRoute,
      rulesRoute
    ]
  },
  {
    path: 'pulls',
    handle: {
      breadcrumb: () => <span>{Page.Pull_Requests}</span>,
      routeName: RouteConstants.toProjectPullRequests
    },
    children: [
      {
        index: true,
        element: <ProjectPullRequestListPage />,
        handle: {
          pageTitle: Page.Pull_Requests
        }
      }
    ]
  }
]

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: (
      <AppRouterProvider>
        <AppProvider>
          <Sidebar.Provider className="min-h-svh">
            <AppShell />
          </Sidebar.Provider>
        </AppProvider>
      </AppRouterProvider>
    ),
    handle: { routeName: 'toHome' },
    children: [
      {
        index: true,
        element: <LandingPage />,
        handle: {
          pageTitle: Page.Home
        }
      },
      {
        path: 'import',
        element: <ImportProjectContainer />,
        handle: {
          breadcrumb: () => <span>Import project</span>,
          routeName: RouteConstants.toImportProject
        }
      },
      {
        path: 'repos',
        element: (
          <SandboxLayout.Main>
            <h1>Repositories</h1>
          </SandboxLayout.Main>
        ),
        handle: {
          breadcrumb: () => <span>{Page.Repositories}</span>,
          routeName: RouteConstants.toRepositories,
          pageTitle: Page.Repositories
        }
      },
      {
        path: 'pipelines',
        element: (
          <SandboxLayout.Main>
            <h1>Pipelines</h1>
          </SandboxLayout.Main>
        ),
        handle: {
          breadcrumb: () => <span>{Page.Pipelines}</span>,
          routeName: RouteConstants.toPipelines,
          pageTitle: Page.Pipelines
        }
      },
      {
        path: 'executions',
        element: (
          <SandboxLayout.Main>
            <h1>Executions</h1>
          </SandboxLayout.Main>
        ),
        handle: {
          breadcrumb: () => <span>{Page.Executions}</span>,
          routeName: RouteConstants.toExecutions,
          pageTitle: Page.Executions
        }
      },
      {
        path: 'databases',
        element: (
          <SandboxLayout.Main>
            <h1>Databases</h1>
          </SandboxLayout.Main>
        ),
        handle: {
          breadcrumb: () => <span>Databases</span>,
          routeName: RouteConstants.toDatabases,
          pageTitle: 'Databases'
        }
      },
      {
        path: 'chaos',
        element: <EmptyPage pathName="Chaos Engineering" />,
        handle: {
          routeName: RouteConstants.toChaos,
          pageTitle: 'Chaos Engineering'
        }
      },
      {
        path: 'artifacts',
        element: <EmptyPage pathName="Artifacts" />,
        handle: {
          routeName: RouteConstants.toArtifacts,
          pageTitle: 'Artifacts'
        }
      },
      {
        path: 'secrets',
        element: <EmptyPage pathName="Secrets" />,
        handle: {
          routeName: RouteConstants.toSecrets,
          pageTitle: 'Secrets'
        }
      },
      {
        path: 'connectors',
        element: <EmptyPage pathName="Connectors" />,
        handle: {
          routeName: RouteConstants.toConnectors,
          pageTitle: 'Connectors'
        }
      },
      {
        path: 'continuous-delivery-gitops',
        element: <EmptyPage pathName="Continuous Delivery GitOps" />,
        handle: {
          routeName: RouteConstants.toGitOps,
          pageTitle: 'Continuous Delivery GitOps'
        }
      },
      {
        path: 'continuous-integration',
        element: <EmptyPage pathName="Continuous Integration" />,
        handle: {
          routeName: RouteConstants.toCI,
          pageTitle: 'Continuous Integration'
        }
      },
      {
        path: 'feature-flags',
        element: <EmptyPage pathName="Feature Flags" />,
        handle: {
          routeName: RouteConstants.toFeatureFlags,
          pageTitle: 'Feature Flags'
        }
      },
      {
        path: 'notifications',
        element: <EmptyPage pathName="Notifications" />,
        handle: {
          routeName: RouteConstants.toNotifications,
          pageTitle: 'Notifications'
        }
      },
      {
        path: 'environments',
        element: <EmptyPage pathName="Environments" />,
        handle: {
          routeName: RouteConstants.toEnvironments,
          pageTitle: 'Environments'
        }
      },
      {
        path: 'delegates',
        element: <EmptyPage pathName="File Store" />,
        handle: {
          routeName: RouteConstants.toFileStore,
          pageTitle: 'File Store'
        }
      },
      {
        path: 'file-store',
        element: <EmptyPage pathName="Delegates" />,
        handle: {
          routeName: RouteConstants.toDelegates,
          pageTitle: 'Delegates'
        }
      },
      {
        path: 'templates',
        element: <EmptyPage pathName="Templates" />,
        handle: {
          routeName: RouteConstants.toTemplates,
          pageTitle: 'Templates'
        }
      },
      {
        path: 'variables',
        element: <EmptyPage pathName="Variables" />,
        handle: {
          routeName: RouteConstants.toVariables,
          pageTitle: 'Variables'
        }
      },
      {
        path: 'slo-downtime',
        element: <EmptyPage pathName="SLO Downtime" />,
        handle: {
          routeName: RouteConstants.toSloDowntime,
          pageTitle: 'SLO Downtime'
        }
      },
      {
        path: 'discovery',
        element: <EmptyPage pathName="Discovery" />,
        handle: {
          routeName: RouteConstants.toDiscovery,
          pageTitle: 'Discovery'
        }
      },
      {
        path: 'monitored-services',
        element: <EmptyPage pathName="Monitored Services" />,
        handle: {
          routeName: RouteConstants.toMonitoredServices,
          pageTitle: 'Monitored Services'
        }
      },
      {
        path: 'overrides',
        element: <EmptyPage pathName="Overrides" />,
        handle: {
          routeName: RouteConstants.toOverrides,
          pageTitle: 'Overrides'
        }
      },
      {
        path: 'certificates',
        element: <EmptyPage pathName="Certificates" />,
        handle: {
          routeName: RouteConstants.toCertificates,
          pageTitle: 'Certificates'
        }
      },
      {
        path: 'policies',
        element: <EmptyPage pathName="Policies" />,
        handle: {
          routeName: RouteConstants.toPolicies,
          pageTitle: 'Policies'
        }
      },
      {
        path: 'freeze-windows',
        element: <EmptyPage pathName="Freeze Windows" />,
        handle: {
          routeName: RouteConstants.toFreezeWindows,
          pageTitle: 'Freeze Windows'
        }
      },
      {
        path: 'external-tickets',
        element: <EmptyPage pathName="External Tickets" />,
        handle: {
          routeName: RouteConstants.toExternalTickets,
          pageTitle: 'External Tickets'
        }
      },
      {
        path: 'infrastructure-as-code',
        element: <EmptyPage pathName="Infrastructure as Code" />,
        handle: {
          routeName: RouteConstants.toInfrastructureAsCode,
          pageTitle: 'Infrastructure as Code'
        }
      },
      {
        path: 'service-reliability',
        element: <EmptyPage pathName="Service Reliability" />,
        handle: {
          routeName: RouteConstants.toServiceReliability,
          pageTitle: 'Service Reliability'
        }
      },
      {
        path: 'developer/portal',
        element: <EmptyPage pathName="Internal Developer Portal" />,
        handle: {
          routeName: RouteConstants.toDevPortal,
          pageTitle: 'Internal Developer Portal'
        }
      },
      {
        path: 'developer/environments',
        element: <EmptyPage pathName="Environments" />,
        handle: {
          routeName: RouteConstants.toDevEnvironments,
          pageTitle: 'Environments'
        }
      },
      {
        path: 'developer/insights',
        element: <EmptyPage pathName="Software Engineering Insights" />,
        handle: {
          routeName: RouteConstants.toDevInsights,
          pageTitle: 'Software Engineering Insights'
        }
      },
      {
        path: 'code-repository',
        element: <EmptyPage pathName="Code Repository" />,
        handle: {
          routeName: RouteConstants.toCode,
          pageTitle: 'Code Repository'
        }
      },
      {
        path: 'supply-chain',
        element: <EmptyPage pathName="Software Supply Chain Assurance" />,
        handle: {
          routeName: RouteConstants.toSupplyChain,
          pageTitle: 'Software Supply Chain Assurance'
        }
      },
      {
        path: 'security-tests',
        element: <EmptyPage pathName="Security Testing Orchestration" />,
        handle: {
          routeName: RouteConstants.toSecurityTests,
          pageTitle: 'Security Testing Orchestration'
        }
      },
      {
        path: 'cloud-costs',
        element: <EmptyPage pathName="Cloud Cost Management" />,
        handle: {
          routeName: RouteConstants.toCloudCosts,
          pageTitle: 'Cloud Cost Management'
        }
      },
      {
        path: 'incidents',
        element: <EmptyPage pathName="Incidents" />,
        handle: {
          routeName: RouteConstants.toIncidents,
          pageTitle: 'Incidents'
        }
      },
      {
        path: 'dashboards',
        element: <EmptyPage pathName="Dashboards" />,
        handle: {
          routeName: RouteConstants.toDashboards,
          pageTitle: 'Dashboards'
        }
      },
      {
        path: ':spaceId',
        handle: {
          breadcrumb: () => <ProjectDropdown />,
          asLink: false
        },
        children: repoRoutes
      },
      {
        path: 'admin',
        handle: {
          breadcrumb: () => <span>Account</span>
        },
        children: [
          {
            index: true,
            element: <Navigate to="default-settings" replace />
          },
          {
            index: true,
            path: 'default-settings',
            element: <UserManagementPageContainer />,
            handle: {
              breadcrumb: () => <span>Users</span>,
              routeName: RouteConstants.toAdminUsers,
              pageTitle: 'Users'
            }
          },
          {
            path: 'user-groups',
            element: <EmptyPage pathName="User Groups" />,
            handle: {
              breadcrumb: () => <span>User Groups</span>,
              routeName: RouteConstants.toUserGroups,
              pageTitle: 'User Groups'
            }
          },
          {
            path: 'service-accounts',
            element: <EmptyPage pathName="Service Accounts" />,
            handle: {
              breadcrumb: () => <span>Service Accounts</span>,
              routeName: RouteConstants.toServiceAccounts
            }
          },
          {
            path: 'resource-groups',
            element: <EmptyPage pathName="Resource Groups" />,
            handle: {
              breadcrumb: () => <span>Resource Groups</span>,
              routeName: RouteConstants.toResourceGroups
            }
          },
          {
            path: 'roles',
            element: <EmptyPage pathName="Roles" />,
            handle: {
              breadcrumb: () => <span>Roles</span>,
              routeName: RouteConstants.toRoles
            }
          }
        ]
      },
      {
        path: 'profile-settings',
        element: <ProfileSettingsLayout />,
        handle: {
          breadcrumb: () => (
            <Layout.Flex direction="row" align="center" gap="xs">
              <span>User</span>
              <Breadcrumb.Separator />
              <span>{Page.Settings}</span>
            </Layout.Flex>
          ),
          pageTitle: Page.Settings
        },
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />,
            handle: {
              breadcrumb: () => <span>{Page.General}</span>
            }
          },
          {
            path: 'general',
            element: <SettingsProfileGeneralPage />,
            handle: {
              breadcrumb: () => <span>{Page.General}</span>,
              routeName: RouteConstants.toProfileGeneral,
              pageTitle: Page.General
            }
          },
          {
            path: 'keys',
            element: <SettingsProfileKeysPage />,
            handle: {
              breadcrumb: () => <span>{Page.Keys}</span>,
              routeName: RouteConstants.toProfileKeys,
              pageTitle: Page.Keys
            }
          }
        ]
      }
    ]
  },
  {
    path: 'create',
    element: (
      <AppProvider>
        <CreateProject />
      </AppProvider>
    ),
    handle: { routeName: RouteConstants.toProjectCreate }
  },
  {
    path: 'signin',
    element: <SignIn />,
    handle: { routeName: RouteConstants.toSignIn }
  },
  {
    path: 'signup',
    element: <SignUp />
  },
  {
    path: 'logout',
    element: <Logout />,
    handle: { routeName: RouteConstants.toLogout }
  }
]

export const mfeRoutes = (mfeProjectId = '', mfeRouteRenderer: JSX.Element | null = null): CustomRouteObject[] => [
  {
    path: '/',
    element: (
      <AppRouterProvider>
        <AppProvider>
          {mfeRouteRenderer}
          <AppShellMFE />
        </AppProvider>
      </AppRouterProvider>
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
      },
      {
        path: 'profile-settings',
        element: <ProfileSettingsLayout />,
        handle: {
          breadcrumb: () => (
            <>
              <span>User</span>
              <Breadcrumb.Separator className="mx-2.5" />
              <span>{Page.Settings}</span>
            </>
          ),
          pageTitle: Page.Settings
        },
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />,
            handle: {
              breadcrumb: () => <span>{Page.General}</span>
            }
          },
          {
            path: 'general',
            element: <SettingsProfileGeneralPage />,
            handle: {
              breadcrumb: () => <span>{Page.General}</span>,
              routeName: RouteConstants.toProfileGeneral,
              pageTitle: Page.General
            }
          },
          {
            path: 'keys',
            element: <SettingsProfileKeysPage />,
            handle: {
              breadcrumb: () => <span>{Page.Keys}</span>,
              routeName: RouteConstants.toProfileKeys,
              pageTitle: Page.Keys
            }
          }
        ]
      }
    ]
  }
]
