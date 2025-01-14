import { Navigate } from 'react-router-dom'

import { Breadcrumb, Text } from '@harnessio/ui/components'
import { EmptyPage, RepoSettingsPage, SandboxLayout } from '@harnessio/ui/views'

import AppShell from './components-v2/app-shell'
import { ProjectDropdown } from './components-v2/breadcrumbs/project-dropdown'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { CustomRouteObject, RouteConstants } from './framework/routing/types'
import { useTranslationStore } from './i18n/stores/i18n-store'
import CreateProject from './pages-v2/create-project/create-project-container'
import { LandingPage } from './pages-v2/landing-page-container'
import { Logout } from './pages-v2/logout'
import PipelineEditPage from './pages-v2/pipeline/pipeline-edit/pipeline-edit'
import ProjectPipelineListPage from './pages-v2/pipeline/project-pipeline-list-page'
import { SettingsProfileGeneralPage } from './pages-v2/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from './pages-v2/profile-settings/profile-settings-keys-container'
import { ProfileSettingsThemePage } from './pages-v2/profile-settings/profile-settings-theme-page'
import { SettingsLayout as ProfileSettingsLayout } from './pages-v2/profile-settings/settings-layout'
import { ProjectGeneralSettingsPageContainer } from './pages-v2/project/project-general-settings-container'
import { ProjectLabelsList } from './pages-v2/project/project-labels-list-container'
import { ProjectMemberListPage } from './pages-v2/project/project-member-list'
import { SettingsLayout as ProjectSettingsLayout } from './pages-v2/project/settings-layout'
import PullRequestChanges from './pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from './pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from './pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from './pages-v2/pull-request/pull-request-data-provider'
import PullRequestLayout from './pages-v2/pull-request/pull-request-layout'
import PullRequestListPage from './pages-v2/pull-request/pull-request-list'
import RepoCommitDetailsPage from './pages-v2/repo-commit-details/commit-details-container'
import RepoCommitDiffsPage from './pages-v2/repo-commit-details/commit-diffs-container'
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
import { SignIn } from './pages-v2/signin'
import { SignUp } from './pages-v2/signup'
import { UserManagementPageContainer } from './pages-v2/user-management/user-management-container'
import { CreateWebhookContainer } from './pages-v2/webhooks/create-webhook-container'
import WebhookListPage from './pages-v2/webhooks/webhook-list'

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    handle: { routeName: 'toHome' },
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'create',
        element: <CreateProject />,
        handle: {
          breadcrumb: () => <Text>Create project</Text>
        },
        children: []
      },
      {
        path: 'repos',
        element: (
          <SandboxLayout.Main>
            <h1>Repositories</h1>
          </SandboxLayout.Main>
        ),
        handle: {
          breadcrumb: () => <Text>Repositories</Text>
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
          breadcrumb: () => <Text>Pipelines</Text>
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
          breadcrumb: () => <Text>Executions</Text>
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
          breadcrumb: () => <Text>Databases</Text>
        }
      },
      {
        path: 'theme',
        element: <ProfileSettingsThemePage />
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
      },
      {
        path: ':spaceId',
        handle: {
          breadcrumb: () => <ProjectDropdown />
        },
        children: [
          {
            path: 'repos',
            handle: {
              breadcrumb: () => <Text>Repositories</Text>,
              routeName: RouteConstants.toRepositories
            },
            children: [
              { index: true, element: <ReposListPage /> },
              {
                path: 'create',
                element: <CreateRepo />
              },
              {
                path: 'import',
                element: <ImportRepo />
              },
              {
                path: ':repoId',
                element: <RepoLayout />,
                handle: {
                  breadcrumb: ({ repoId }: { repoId: string }) => <Text>{repoId}</Text>
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
                      breadcrumb: () => <Text>Summary</Text>,
                      routeName: RouteConstants.toRepoSummary
                    }
                  },
                  {
                    path: 'commits',
                    element: <RepoCommitsPage />,
                    handle: {
                      breadcrumb: () => <Text>Commits</Text>,
                      routeName: RouteConstants.toRepoCommits
                    }
                  },
                  {
                    path: 'commits/:commitSHA',
                    element: <RepoCommitDetailsPage />,
                    children: [
                      {
                        index: true,
                        element: <RepoCommitDiffsPage />,
                        handle: {
                          breadcrumb: ({ commitSHA }: { commitSHA: string }) => (
                            <>
                              <Text>Commits</Text>
                              <Breadcrumb.Separator />
                              <Text>{commitSHA}</Text>
                            </>
                          ),
                          routeName: RouteConstants.toRepoCommitDetails
                        }
                      }
                    ]
                  },

                  {
                    path: 'branches',
                    element: <RepoBranchesListPage />,
                    handle: {
                      breadcrumb: () => <Text>Branches</Text>,
                      routeName: RouteConstants.toRepoBranches
                    }
                  },
                  {
                    path: 'code',
                    element: (
                      <ExplorerPathsProvider>
                        <RepoSidebar />
                      </ExplorerPathsProvider>
                    ),
                    handle: {
                      breadcrumb: () => <Text>Files</Text>,
                      routeName: RouteConstants.toRepoFiles
                    },
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
                    path: 'pulls',
                    handle: {
                      breadcrumb: () => <Text>Pull Requests</Text>,
                      routeName: RouteConstants.toPullRequests
                    },
                    children: [
                      { index: true, element: <PullRequestListPage /> },
                      {
                        path: 'compare/:diffRefs*?',
                        element: <CreatePullRequest />,
                        handle: {
                          routeName: RouteConstants.toPullRequestCompare
                        }
                      },
                      {
                        path: ':pullRequestId',
                        element: <PullRequestLayout />,
                        handle: {
                          breadcrumb: ({ pullRequestId }: { pullRequestId: string }) => <Text>{pullRequestId}</Text>
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
                            )
                          },
                          {
                            path: 'commits',
                            element: <PullRequestCommitPage />,
                            handle: {
                              breadcrumb: () => <Text>Commits</Text>
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
                              breadcrumb: () => <Text>Changes</Text>
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    path: 'pipelines',
                    handle: {
                      breadcrumb: () => <Text>Pipelines</Text>
                    },
                    children: [
                      { index: true, element: <RepoPipelineListPage /> },
                      {
                        path: ':pipelineId',
                        handle: {
                          breadcrumb: ({ pipelineId }: { pipelineId: string }) => <Text>{pipelineId}</Text>
                        },
                        children: [
                          {
                            index: true,
                            element: <RepoExecutionListPage />,
                            handle: {
                              breadcrumb: () => <Text>Executions</Text>
                            }
                          },
                          {
                            path: 'edit',
                            element: <PipelineEditPage />,
                            handle: {
                              breadcrumb: () => <Text>Edit</Text>,
                              routeName: RouteConstants.toPipelineEdit
                            }
                          },
                          {
                            path: 'executions',
                            handle: {
                              routeName: RouteConstants.toPipelineExecutions
                            },
                            children: [
                              {
                                path: ':executionId',
                                element: <>Execution Details Page</>,
                                handle: {
                                  breadcrumb: ({ executionId }: { executionId: string }) => <Text>{executionId}</Text>,
                                  routeName: RouteConstants.toPipelineExecution
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
                    element: <RepoSettingsPage useTranslationStore={useTranslationStore} />,
                    handle: {
                      breadcrumb: () => <Text>Settings</Text>
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
                          breadcrumb: () => <Text>General</Text>,
                          routeName: RouteConstants.toRepoGeneralSettings
                        }
                      },
                      {
                        path: 'rules',
                        element: <RepoSettingsGeneralPageContainer />,
                        handle: {
                          breadcrumb: () => <Text>Rules</Text>
                        }
                      },
                      {
                        path: 'rules/create',
                        element: <RepoBranchSettingsRulesPageContainer />,
                        children: [
                          {
                            path: ':identifier',
                            element: <RepoBranchSettingsRulesPageContainer />,
                            handle: {
                              routeName: RouteConstants.toRepoBranchRule
                            }
                          }
                        ]
                      },
                      {
                        path: 'webhooks',
                        handle: {
                          breadcrumb: () => <Text>Webhooks</Text>,
                          routeName: RouteConstants.toRepoWebhooks
                        },
                        children: [
                          {
                            index: true,
                            element: <WebhookListPage />
                          },
                          {
                            path: 'create',
                            element: <CreateWebhookContainer />,
                            handle: {
                              breadcrumb: () => <Text>Create a webhook</Text>
                            }
                          },
                          {
                            path: ':webhookId',
                            element: <CreateWebhookContainer />,
                            handle: {
                              breadcrumb: ({ webhookId }: { webhookId: string }) => <Text>{webhookId}</Text>
                            }
                          }
                        ]
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
              breadcrumb: () => <Text>Settings</Text>
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
                  breadcrumb: () => <Text>General</Text>
                }
              },
              {
                path: 'members',
                element: <ProjectMemberListPage />,
                handle: {
                  breadcrumb: () => <Text>Members</Text>
                }
              },
              {
                path: 'labels',
                element: <ProjectLabelsList />,
                handle: {
                  breadcrumb: () => <Text>Labels</Text>
                }
              }
            ]
          },
          {
            path: 'pipelines',
            element: <ProjectPipelineListPage />,
            handle: {
              breadcrumb: () => <Text>Pipelines</Text>
            }
          }
        ]
      },
      {
        path: 'admin/default-settings',
        element: <UserManagementPageContainer />,
        handle: {
          breadcrumb: () => (
            <>
              <Text>Account</Text>
              <Breadcrumb.Separator />
              <Text>Users</Text>
            </>
          )
        }
      },
      {
        path: 'profile-settings',
        element: <ProfileSettingsLayout />,
        handle: {
          breadcrumb: () => (
            <>
              <Text>User</Text>
              <Breadcrumb.Separator className="mx-2.5" />
              <Text>Settings</Text>
            </>
          )
        },
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />
          },
          {
            path: 'general',
            element: <SettingsProfileGeneralPage />,
            handle: {
              breadcrumb: () => <Text>General</Text>
            }
          },
          {
            path: 'keys',
            element: <SettingsProfileKeysPage />,
            handle: {
              breadcrumb: () => <Text>Keys</Text>
            }
          }
        ]
      }
    ]
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
    element: <Logout />
  }
]
