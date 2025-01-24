import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

import { Breadcrumb, Text } from '@harnessio/ui/components'
import { EmptyPage, RepoSettingsLayout, SandboxLayout } from '@harnessio/ui/views'

import { AppShell, AppShellMFE } from './components-v2/app-shell'
import { ProjectDropdown } from './components-v2/breadcrumbs/project-dropdown'
import { AppProvider } from './framework/context/AppContext'
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
import { RepoBranchesListPage } from './pages-v2/repo/repo-branch-list'
import { RepoBranchSettingsRulesPageContainer } from './pages-v2/repo/repo-branch-rules-container'
import { RepoCode } from './pages-v2/repo/repo-code'
import RepoCommitDetailsPage from './pages-v2/repo/repo-commit-details'
import { CommitDiffContainer } from './pages-v2/repo/repo-commit-details-diff'
import RepoCommitsPage from './pages-v2/repo/repo-commits'
import { CreateRepo } from './pages-v2/repo/repo-create-page'
import RepoExecutionListPage from './pages-v2/repo/repo-execution-list'
import { ImportRepo } from './pages-v2/repo/repo-import-page'
import { RepoLabelsList } from './pages-v2/repo/repo-labels-container'
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

const repoRoutes: CustomRouteObject[] = [
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
        element: <CreateRepo />,
        handle: {
          routeName: RouteConstants.toCreateRepo
        }
      },
      {
        path: 'import',
        element: <ImportRepo />,
        handle: {
          routeName: RouteConstants.toImportRepo
        }
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
            handle: {
              breadcrumb: () => <Text>Commits</Text>,
              routeName: RouteConstants.toRepoCommits
            },
            children: [
              {
                index: true,
                element: <RepoCommitsPage />
              },
              {
                path: ':commitSHA',
                element: <RepoCommitDetailsPage showSidebar={false} />,
                handle: {
                  breadcrumb: ({ commitSHA }: { commitSHA: string }) => (
                    <>
                      <Text>{commitSHA.substring(0, 7)}</Text>
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
                path: 'compare',
                handle: {
                  breadcrumb: () => <Text>Compare</Text>,
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
                  breadcrumb: ({ pullRequestId }: { pullRequestId: string }) => <Text>{pullRequestId}</Text>,
                  routeName: RouteConstants.toPullRequest
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
                      routeName: RouteConstants.toPullRequestConversation
                    }
                  },
                  {
                    path: 'commits',
                    element: <PullRequestCommitPage />,
                    handle: {
                      breadcrumb: () => <Text>Commits</Text>,
                      routeName: RouteConstants.toPullRequestCommits
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
                      breadcrumb: () => <Text>Changes</Text>,
                      routeName: RouteConstants.toPullRequestChanges
                    }
                  },
                  {
                    path: 'checks',
                    element: <EmptyPage pathName="PR Checks" />,
                    handle: {
                      breadcrumb: () => <Text>Checks</Text>,
                      routeName: RouteConstants.toPullRequestChecks
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
                      routeName: RouteConstants.toExecutions
                    },
                    children: [
                      { index: true, element: <RepoExecutionListPage /> },
                      {
                        path: ':executionId',
                        element: <>Execution Details Page</>,
                        handle: {
                          breadcrumb: ({ executionId }: { executionId: string }) => <Text>{executionId}</Text>,
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
            element: <RepoSettingsLayout useTranslationStore={useTranslationStore} />,
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
                handle: {
                  breadcrumb: () => <Text>Rules</Text>,
                  routeName: RouteConstants.toRepoBranchRules
                },
                children: [
                  {
                    index: true,
                    element: <RepoSettingsGeneralPageContainer />
                  },
                  {
                    path: 'create',
                    element: <RepoBranchSettingsRulesPageContainer />,
                    handle: {
                      breadcrumb: () => <Text>Create a rule</Text>
                    }
                  },
                  {
                    path: ':identifier',
                    element: <RepoBranchSettingsRulesPageContainer />,
                    handle: {
                      breadcrumb: ({ identifier }: { identifier: string }) => <Text>{identifier}</Text>,
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
              },
              {
                path: 'labels',
                element: <RepoLabelsList />
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
          breadcrumb: () => <Text>General</Text>,
          routeName: RouteConstants.toProjectGeneral
        }
      },
      {
        path: 'members',
        element: <ProjectMemberListPage />,
        handle: {
          breadcrumb: () => <Text>Members</Text>,
          routeName: RouteConstants.toProjectMembers
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
    },
    children: []
  }
]

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: (
      <AppProvider>
        <AppShell />
      </AppProvider>
    ),
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
          breadcrumb: () => <Text>Repositories</Text>,
          routeName: RouteConstants.toRepositories
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
          breadcrumb: () => <Text>Pipelines</Text>,
          routeName: RouteConstants.toPipelines
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
          breadcrumb: () => <Text>Executions</Text>,
          routeName: RouteConstants.toExecutions
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
          breadcrumb: () => <Text>Databases</Text>,
          routeName: RouteConstants.toDatabases
        }
      },
      {
        path: 'theme',
        element: <ProfileSettingsThemePage />,
        handle: {
          routeName: RouteConstants.toTheme
        }
      },
      {
        path: 'chaos',
        element: <EmptyPage pathName="Chaos Engineering" />,
        handle: {
          routeName: RouteConstants.toChaos
        }
      },
      {
        path: 'artifacts',
        element: <EmptyPage pathName="Artifacts" />,
        handle: {
          routeName: RouteConstants.toArtifacts
        }
      },
      {
        path: 'secrets',
        element: <EmptyPage pathName="Secrets" />,
        handle: {
          routeName: RouteConstants.toSecrets
        }
      },
      {
        path: 'connectors',
        element: <EmptyPage pathName="Connectors" />,
        handle: {
          routeName: RouteConstants.toConnectors
        }
      },
      {
        path: 'continuous-delivery-gitops',
        element: <EmptyPage pathName="Continuous Delivery GitOps" />,
        handle: {
          routeName: RouteConstants.toGitOps
        }
      },
      {
        path: 'continuous-integration',
        element: <EmptyPage pathName="Continuous Integration" />,
        handle: {
          routeName: RouteConstants.toCI
        }
      },
      {
        path: 'feature-flags',
        element: <EmptyPage pathName="Feature Flags" />,
        handle: {
          routeName: RouteConstants.toFeatureFlags
        }
      },
      {
        path: 'notifications',
        element: <EmptyPage pathName="Notifications" />,
        handle: {
          routeName: RouteConstants.toNotifications
        }
      },
      {
        path: 'environments',
        element: <EmptyPage pathName="Environments" />,
        handle: {
          routeName: RouteConstants.toEnvironments
        }
      },
      {
        path: 'delegates',
        element: <EmptyPage pathName="File Store" />,
        handle: {
          routeName: RouteConstants.toFileStore
        }
      },
      {
        path: 'file-store',
        element: <EmptyPage pathName="Delegates" />,
        handle: {
          routeName: RouteConstants.toDelegates
        }
      },
      {
        path: 'templates',
        element: <EmptyPage pathName="Templates" />,
        handle: {
          routeName: RouteConstants.toTemplates
        }
      },
      {
        path: 'variables',
        element: <EmptyPage pathName="Variables" />,
        handle: {
          routeName: RouteConstants.toVariables
        }
      },
      {
        path: 'slo-downtime',
        element: <EmptyPage pathName="SLO Downtime" />,
        handle: {
          routeName: RouteConstants.toSloDowntime
        }
      },
      {
        path: 'discovery',
        element: <EmptyPage pathName="Discovery" />,
        handle: {
          routeName: RouteConstants.toDiscovery
        }
      },
      {
        path: 'monitored-services',
        element: <EmptyPage pathName="Monitored Services" />,
        handle: {
          routeName: RouteConstants.toMonitoredServices
        }
      },
      {
        path: 'overrides',
        element: <EmptyPage pathName="Overrides" />,
        handle: {
          routeName: RouteConstants.toOverrides
        }
      },
      {
        path: 'certificates',
        element: <EmptyPage pathName="Certificates" />,
        handle: {
          routeName: RouteConstants.toCertificates
        }
      },
      {
        path: 'policies',
        element: <EmptyPage pathName="Policies" />,
        handle: {
          routeName: RouteConstants.toPolicies
        }
      },
      {
        path: 'freeze-windows',
        element: <EmptyPage pathName="Freeze Windows" />,
        handle: {
          routeName: RouteConstants.toFreezeWindows
        }
      },
      {
        path: 'external-tickets',
        element: <EmptyPage pathName="External Tickets" />,
        handle: {
          routeName: RouteConstants.toExternalTickets
        }
      },
      {
        path: 'infrastructure-as-code',
        element: <EmptyPage pathName="Infrastructure as Code" />,
        handle: {
          routeName: RouteConstants.toInfrastructureAsCode
        }
      },
      {
        path: 'service-reliability',
        element: <EmptyPage pathName="Service Reliability" />,
        handle: {
          routeName: RouteConstants.toServiceReliability
        }
      },
      {
        path: 'developer/portal',
        element: <EmptyPage pathName="Internal Developer Portal" />,
        handle: {
          routeName: RouteConstants.toDevPortal
        }
      },
      {
        path: 'developer/environments',
        element: <EmptyPage pathName="Environments" />,
        handle: {
          routeName: RouteConstants.toDevEnvironments
        }
      },
      {
        path: 'developer/insights',
        element: <EmptyPage pathName="Software Engineering Insights" />,
        handle: {
          routeName: RouteConstants.toDevInsights
        }
      },
      {
        path: 'code-repository',
        element: <EmptyPage pathName="Code Repository" />,
        handle: {
          routeName: RouteConstants.toCode
        }
      },
      {
        path: 'supply-chain',
        element: <EmptyPage pathName="Software Supply Chain Assurance" />,
        handle: {
          routeName: RouteConstants.toSupplyChain
        }
      },
      {
        path: 'security-tests',
        element: <EmptyPage pathName="Security Testing Orchestration" />,
        handle: {
          routeName: RouteConstants.toSecurityTests
        }
      },
      {
        path: 'cloud-costs',
        element: <EmptyPage pathName="Cloud Cost Management" />,
        handle: {
          routeName: RouteConstants.toCloudCosts
        }
      },
      {
        path: 'incidents',
        element: <EmptyPage pathName="Incidents" />,
        handle: {
          routeName: RouteConstants.toIncidents
        }
      },
      {
        path: 'dashboards',
        element: <EmptyPage pathName="Dashboards" />,
        handle: {
          routeName: RouteConstants.toDashboards
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
          breadcrumb: () => <Text>Account</Text>
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
              breadcrumb: () => <Text>Users</Text>,
              routeName: RouteConstants.toAdminUsers
            }
          },
          {
            path: 'user-groups',
            element: <EmptyPage pathName="User Groups" />,
            handle: {
              breadcrumb: () => <Text>User Groups</Text>,
              routeName: RouteConstants.toUserGroups
            }
          },
          {
            path: 'service-accounts',
            element: <EmptyPage pathName="Service Accounts" />,
            handle: {
              breadcrumb: () => <Text>Service Accounts</Text>,
              routeName: RouteConstants.toServiceAccounts
            }
          },
          {
            path: 'resource-groups',
            element: <EmptyPage pathName="Resource Groups" />,
            handle: {
              breadcrumb: () => <Text>Resource Groups</Text>,
              routeName: RouteConstants.toResourceGroups
            }
          },
          {
            path: 'roles',
            element: <EmptyPage pathName="Roles" />,
            handle: {
              breadcrumb: () => <Text>Roles</Text>,
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
            element: <SettingsProfileGeneralPage />,
            handle: {
              breadcrumb: () => <Text>General</Text>
            }
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
              breadcrumb: () => <Text>Keys</Text>,
              routeName: RouteConstants.toProfileKeys
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
    element: <Logout />,
    handle: { routeName: RouteConstants.toLogout }
  }
]

export const mfeRoutes = (mfeProjectId = '', mfeRouteRenderer: ReactElement | null = null): CustomRouteObject[] => [
  {
    path: '/',
    element: (
      <>
        {mfeRouteRenderer}
        <AppShellMFE />
      </>
    ),
    handle: { routeName: 'toHome' },
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'repos',
        handle: {
          breadcrumb: () => <Text>Repositories</Text>
        },
        children: [{ index: true, element: <ReposListPage /> }]
      },
      {
        path: '',
        handle: {
          breadcrumb: () => <span>{mfeProjectId ?? ''}</span>
        },
        children: repoRoutes
      }
    ]
  }
]
