import { Navigate, RouteObject } from 'react-router-dom'

import { BreadcrumbSeparator } from '@harnessio/canary'
import { Text } from '@harnessio/ui/components'
import { EmptyPage, RepoSettingsPage } from '@harnessio/ui/views'
import { SandboxLayout } from '@harnessio/views'

import AppShell from './components-v2/app-shell'
import BreadcrumbsV1 from './components-v2/breadcrumbs/breadcrumbs'
import { ProjectDropdown } from './components-v2/breadcrumbs/project-dropdown'
import { ExplorerPathsProvider } from './framework/context/ExplorerPathsContext'
import { useTranslationStore } from './i18n/stores/i18n-store'
import { PullRequestLayout } from './layouts/PullRequestLayout'
import CreateProject from './pages-v2/create-project/create-project-container'
import { LandingPage } from './pages-v2/landing-page-container'
import { SettingsProfileGeneralPage } from './pages-v2/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from './pages-v2/profile-settings/profile-settings-keys-container'
import { SettingsLayout as ProfileSettingsLayout } from './pages-v2/profile-settings/settings-layout'
import { ProjectMemberListPage } from './pages-v2/project/project-member-list'
import { SettingsLayout as ProjectSettingsLayout } from './pages-v2/project/settings-layout'
import PullRequestChanges from './pages-v2/pull-request/pull-request-changes'
import { PullRequestCommitPage } from './pages-v2/pull-request/pull-request-commits'
import { CreatePullRequest } from './pages-v2/pull-request/pull-request-compare'
import PullRequestConversationPage from './pages-v2/pull-request/pull-request-conversation'
import PullRequestDataProvider from './pages-v2/pull-request/pull-request-data-provider'
import PullRequestListPage from './pages-v2/pull-request/pull-request-list'
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
import { CreateWebhookContainer } from './pages-v2/webhooks/create-webhook-container'
import WebhookListPage from './pages-v2/webhooks/webhook-list'
import { Logout } from './pages/logout'
import { ProfileSettingsThemePage } from './pages/profile-settings/profile-settings-theme-page'

// Define a custom handle with the breadcrumb property
interface CustomHandle {
  breadcrumb?: (params: Record<string, string>) => string
}

// Create a new type by intersecting RouteObject with the custom handle
type CustomRouteObject = RouteObject & {
  handle?: CustomHandle
}

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: (
      <>
        {/* <BreadcrumbsV1 /> */}
        <AppShell />
      </>
    ),
    handle: {
      breadcrumb: () => <ProjectDropdown />
    },
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: ':spaceId/repos',
        handle: {
          breadcrumb: () => <Text>Repositories</Text>
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
                  breadcrumb: () => <Text>Summary</Text>
                }
              },
              {
                path: 'commits',
                element: <RepoCommitsPage />,
                handle: {
                  breadcrumb: () => <Text>Commits</Text>
                }
              },
              {
                path: 'branches',
                element: <RepoBranchesListPage />,
                handle: {
                  breadcrumb: () => <Text>Branches</Text>
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
                  breadcrumb: () => <Text>Files</Text>
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
                  breadcrumb: () => <Text>Pull Requests</Text>
                },
                children: [
                  { index: true, element: <PullRequestListPage /> },
                  {
                    path: 'compare/:diffRefs*?',
                    element: <CreatePullRequest />
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
                    element: <RepoExecutionListPage />,
                    handle: {
                      breadcrumb: ({ pipelineId }: { pipelineId: string }) => (
                        <div className="flex items-center gap-1">
                          <Text>{pipelineId}</Text>
                          <BreadcrumbSeparator>/</BreadcrumbSeparator>
                          <Text>Executions</Text>
                        </div>
                      )
                    }
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
                      breadcrumb: () => <Text>General</Text>
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
                        element: <RepoBranchSettingsRulesPageContainer />
                      }
                    ]
                  },
                  {
                    path: 'webhooks',
                    element: <WebhookListPage />,
                    handle: {
                      breadcrumb: () => <Text>Webhooks</Text>
                    }
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
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: ':spaceId/settings',
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
            element: <>General</>,
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
          }
        ]
      }
    ]
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
    path: 'signin',
    element: <SignIn />
  },
  {
    path: 'signup',
    element: <SignUp />
  },
  {
    path: 'settings',
    element: (
      <>
        <BreadcrumbsV1 />
        <ProfileSettingsLayout />
      </>
    ),
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
  },
  {
    path: 'theme',
    element: <ProfileSettingsThemePage />
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
]