import { Navigate } from 'react-router-dom'

import { Breadcrumb, Layout, Sidebar } from '@harnessio/ui/components'
import { ComponentProvider } from '@harnessio/ui/context'
import { EmptyPage, ProfileSettingsLayout, SandboxLayout } from '@harnessio/ui/views'

import { ProjectDropdown } from '../../components-v2/project-dropdown'
import { AppShell } from '../../components-v2/standalone/app-shell'
import { AppProvider } from '../../framework/context/AppContext'
import { AppRouterProvider } from '../../framework/context/AppRouterProvider'
import { PageTitleProvider } from '../../framework/context/PageTitleContext'
import { RbacButton } from '../../framework/rbac/rbac-button'
import { RbacSplitButton } from '../../framework/rbac/rbac-split-button'
import { CustomRouteObject, RouteConstants } from '../../framework/routing/types'
import { CreateProject } from '../../pages-v2/create-project'
import { LandingPage } from '../../pages-v2/landing-page-container'
import { Logout } from '../../pages-v2/logout'
import { SettingsProfileGeneralPage } from '../../pages-v2/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from '../../pages-v2/profile-settings/profile-settings-keys-container'
import { ImportProjectContainer } from '../../pages-v2/project/project-import-container'
import { SignIn } from '../../pages-v2/signin'
import { SignUp } from '../../pages-v2/signup'
import { UserManagementPageContainer } from '../../pages-v2/user-management/user-management-container'
import { Page, repoRoutes } from '../common-routes'

export const routes: CustomRouteObject[] = [
  {
    path: '/',
    element: (
      <AppRouterProvider>
        <PageTitleProvider>
          <AppProvider>
            <Sidebar.Provider className="min-h-svh">
              <ComponentProvider components={{ RbacButton, RbacSplitButton }}>
                <AppShell />
              </ComponentProvider>
            </Sidebar.Provider>
          </AppProvider>
        </PageTitleProvider>
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
