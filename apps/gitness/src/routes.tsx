import { Navigate } from 'react-router-dom'

import { Breadcrumb, Text } from '@harnessio/ui/components'
import { EmptyPage, ProfileSettingsLayout, RepoSettingsLayout, SandboxLayout } from '@harnessio/ui/views'

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
import { ProjectLabelFormContainer } from './pages-v2/project/labels/project-label-form-container'
import { ProjectLabelsList } from './pages-v2/project/labels/project-labels-list-container'
import { ProjectGeneralSettingsPageContainer } from './pages-v2/project/project-general-settings-container'
import { ImportProjectContainer } from './pages-v2/project/project-import-container'
import { ProjectMemberListPage } from './pages-v2/project/project-member-list'
import { SettingsLayout as ProjectSettingsLayout } from './pages-v2/project/settings-layout'
import PullRequestChanges from './pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from './pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from './pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from './pages-v2/pull-request/pull-request-data-provider'
import PullRequestLayout from './pages-v2/pull-request/pull-request-layout'
import PullRequestListPage from './pages-v2/pull-request/pull-request-list'
import { RepoLabelFormContainer } from './pages-v2/repo/labels/label-form-container.tsx'
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
import { SignIn } from './pages-v2/signin'
import { SignUp } from './pages-v2/signup'
import { UserManagementPageContainer } from './pages-v2/user-management/user-management-container'
import { CreateWebhookContainer } from './pages-v2/webhooks/create-webhook-container'
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
      breadcrumb: () => <Text>{Page.Repositories}</Text>,
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
          breadcrumb: ({ repoId }: { repoId: string }) => <Text>{repoId}</Text>,
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
              breadcrumb: () => <Text>{Page.Summary}</Text>,
              routeName: RouteConstants.toRepoSummary,
              pageTitle: Page.Summary
            }
          },
          {
            path: 'commits',
            handle: {
              breadcrumb: () => <Text>{Page.Commits}</Text>,
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
              breadcrumb: () => <Text>{Page.Branches}</Text>,
              routeName: RouteConstants.toRepoBranches,
              pageTitle: Page.Branches
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
              breadcrumb: () => <Text>{Page.Files}</Text>,
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
                element: <RepoCode />
              }
            ]
          },
          {
            path: 'pulls',
            handle: {
              breadcrumb: () => <Text>{Page.Pull_Requests}</Text>,
              routeName: RouteConstants.toPullRequests
            },
            children: [
              {
                index: true,
                element: <PullRequestListPage />,
                handle: {
                  pageTitle: Page.Pull_Requests
                }
              },
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
                      breadcrumb: () => <Text>{Page.Commits}</Text>,
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
                      breadcrumb: () => <Text>{Page.Changes}</Text>,
                      routeName: RouteConstants.toPullRequestChanges,
                      pageTitle: Page.Changes
                    }
                  },
                  {
                    path: 'checks',
                    element: <EmptyPage pathName="PR Checks" />,
                    handle: {
                      breadcrumb: () => <Text>{Page.Checks}</Text>,
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
              breadcrumb: () => <Text>{Page.Pipelines}</Text>
            },
            children: [
              {
                index: true,
                element: <RepoPipelineListPage />,
                handle: {
                  pageTitle: Page.Pipelines
                }
              },
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
                      breadcrumb: () => <Text>{Page.Executions}</Text>,
                      pageTitle: Page.Executions
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
                      { index: true, element: <RepoExecutionListPage />, handle: { pageTitle: Page.Executions } },
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
              breadcrumb: () => <Text>{Page.Settings}</Text>,
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
                  breadcrumb: () => <Text>{Page.General}</Text>,
                  routeName: RouteConstants.toRepoGeneralSettings,
                  pageTitle: Page.General
                }
              },
              {
                path: 'rules',
                handle: {
                  breadcrumb: () => <Text>{Page.Branch_Rules}</Text>,
                  routeName: RouteConstants.toRepoBranchRules
                },
                children: [
                  {
                    index: true,
                    element: <RepoSettingsGeneralPageContainer />,
                    handle: {
                      pageTitle: Page.Branch_Rules
                    }
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
                    element: <WebhookListPage />,
                    handle: {
                      pageTitle: 'Webhooks'
                    }
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
                handle: {
                  breadcrumb: () => <Text>{Page.Labels}</Text>,
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
                      breadcrumb: () => <Text>Create a label</Text>
                    }
                  },
                  {
                    path: ':labelId',
                    element: <RepoLabelFormContainer />,
                    handle: {
                      breadcrumb: ({ labelId }: { labelId: string }) => <Text>{labelId}</Text>
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
      breadcrumb: () => <Text>{Page.Settings}</Text>,
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
          breadcrumb: () => <Text>{Page.General}</Text>,
          routeName: RouteConstants.toProjectGeneral,
          pageTitle: Page.General
        }
      },
      {
        path: 'members',
        element: <ProjectMemberListPage />,
        handle: {
          breadcrumb: () => <Text>{Page.Members}</Text>,
          routeName: RouteConstants.toProjectMembers,
          pageTitle: Page.Members
        }
      },
      {
        path: 'labels',
        handle: {
          breadcrumb: () => <Text>{Page.Labels}</Text>,
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
              breadcrumb: () => <Text>Create a label</Text>
            }
          },
          {
            path: ':labelId',
            element: <ProjectLabelFormContainer />,
            handle: {
              breadcrumb: ({ labelId }: { labelId: string }) => <Text>{labelId}</Text>
            }
          }
        ]
      }
    ]
  },
  {
    path: 'pipelines',
    element: <ProjectPipelineListPage />,
    handle: {
      breadcrumb: () => <Text>{Page.Pipelines}</Text>,
      pageTitle: Page.Pipelines
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
        element: <LandingPage />,
        handle: {
          pageTitle: Page.Home
        }
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
        path: 'import',
        element: <ImportProjectContainer />,
        handle: {
          breadcrumb: () => <Text>Import project</Text>
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
          breadcrumb: () => <Text>{Page.Repositories}</Text>,
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
          breadcrumb: () => <Text>{Page.Pipelines}</Text>,
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
          breadcrumb: () => <Text>{Page.Executions}</Text>,
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
          breadcrumb: () => <Text>Databases</Text>,
          routeName: RouteConstants.toDatabases,
          pageTitle: 'Databases'
        }
      },
      {
        path: 'theme',
        element: <ProfileSettingsThemePage />,
        handle: {
          routeName: RouteConstants.toTheme,
          pageTitle: Page.Theme
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
              routeName: RouteConstants.toAdminUsers,
              pageTitle: 'Users'
            }
          },
          {
            path: 'user-groups',
            element: <EmptyPage pathName="User Groups" />,
            handle: {
              breadcrumb: () => <Text>User Groups</Text>,
              routeName: RouteConstants.toUserGroups,
              pageTitle: 'User Groups'
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
        element: <ProfileSettingsLayout useTranslationStore={useTranslationStore} />,
        handle: {
          breadcrumb: () => (
            <>
              <Text>User</Text>
              <Breadcrumb.Separator className="mx-2.5" />
              <Text>{Page.Settings}</Text>
            </>
          ),
          pageTitle: Page.Settings
        },
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />,
            handle: {
              breadcrumb: () => <Text>{Page.General}</Text>
            }
          },
          {
            path: 'general',
            element: <SettingsProfileGeneralPage />,
            handle: {
              breadcrumb: () => <Text>{Page.General}</Text>,
              routeName: RouteConstants.toProfileGeneral,
              pageTitle: Page.General
            }
          },
          {
            path: 'keys',
            element: <SettingsProfileKeysPage />,
            handle: {
              breadcrumb: () => <Text>{Page.Keys}</Text>,
              routeName: RouteConstants.toProfileKeys,
              pageTitle: Page.Keys
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
            breadcrumb: () => <Text>{mfeProjectId}</Text>
          })
        },
        children: repoRoutes
      }
    ]
  }
]
