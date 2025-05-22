import { MenuGroupType, MenuGroupTypes } from '@harnessio/ui/components'
import { TFunctionWithFallback } from '@harnessio/ui/context'

import { RouteFunctionMap } from '../framework/routing/types'

export type GetNavbarMenuDataParams = {
  t: TFunctionWithFallback
  routes: RouteFunctionMap
  spaceId?: string
  repoId?: string
}

export type GetNavbarMenuData = ({ t, spaceId, repoId, routes }: GetNavbarMenuDataParams) => MenuGroupType[]

export const getNavbarMenuData: GetNavbarMenuData = ({ t, spaceId, repoId, routes }) => [
  {
    groupId: 0,
    title: t('component:navbar.devops'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 0,
        iconName: 'repositories-gradient',
        title: t('component:navbar.repositories'),
        description: 'Integrated & familiar git experience.',
        to: routes.toRepositories({ spaceId })
      },
      // {
      //   id: 1,
      //   iconName: 'pipelines-gradient',
      //   title: t('component:navbar.pipelines'),
      //   description: 'Up to 4X faster than other solutions.',
      //   to: routes.toPipelines()
      // },
      // {
      //   id: 2,
      //   iconName: 'execution-gradient',
      //   title: t('component:navbar.executions'),
      //   description: 'Optimize feature rollout velocity.',
      //   to: routes.toExecutions()
      // },
      {
        id: 3,
        iconName: 'database-gradient',
        title: t('component:navbar.databases'),
        description: 'Manage all your infrastructure.',
        to: routes.toDatabases()
      },
      {
        id: 4,
        iconName: 'artifacts-gradient',
        title: t('component:navbar.artifacts'),
        description: 'Validate service resilience.',
        to: routes.toArtifacts()
      },
      {
        id: 5,
        iconName: 'infrastructure-gradient',
        title: t('component:navbar.infrastructure'),
        description: 'Manage all your infrastructure.',
        to: routes.toInfrastructureAsCode()
      },
      {
        id: 6,
        iconName: 'flag-gradient',
        title: t('component:navbar.feature-flags'),
        description: 'Optimize feature rollout velocity.',
        to: routes.toFeatureFlags()
      }
    ]
  },
  {
    groupId: 1,
    title: 'Devex',
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 7,
        iconName: 'dev-portal-gradient',
        title: t('component:navbar.developer-portal'),
        description: 'Built for developers, onboard in minutes.',
        to: routes.toDevPortal()
      },
      {
        id: 8,
        iconName: 'dev-envs-gradient',
        title: t('component:navbar.developer-environments'),
        description: 'Integrated & familiar git experience.',
        to: routes.toDevEnvironments()
      },
      {
        id: 9,
        iconName: 'dev-insights-gradient',
        title: t('component:navbar.developer-insights'),
        description: 'Actionable insights on SDLC.',
        to: routes.toDevInsights()
      }
    ]
  },
  {
    groupId: 2,
    title: t('component:navbar.secops'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 10,
        iconName: 'security-tests-gradient',
        title: t('component:navbar.security-tests'),
        description: 'Shift left security testing.',
        to: routes.toSecurityTests()
      },
      {
        id: 11,
        iconName: 'supply-chain-gradient',
        title: t('component:navbar.supply-chain'),
        description: 'Artifact integrity and governance.',
        to: routes.toSupplyChain()
      }
    ]
  },
  {
    groupId: 3,
    title: t('component:navbar.finops'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 12,
        iconName: 'cloud-costs-gradient',
        title: t('component:navbar.cloud-costs'),
        description: 'Intelligent cost management.',
        to: routes.toCloudCosts()
      }
    ]
  },
  {
    groupId: 4,
    title: t('component:navbar.reliability'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 13,
        iconName: 'incidents-gradient',
        title: t('component:navbar.incidents'),
        description: 'Shift left security testing.',
        to: routes.toIncidents()
      },
      {
        id: 14,
        iconName: 'chaos-engineering-gradient',
        title: t('component:navbar.chaos-engineering'),
        description: 'Validate service resilience.',
        to: routes.toChaos()
      }
    ]
  },
  {
    groupId: 5,
    title: t('component:navbar.platform'),
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 15,
        iconName: 'dashboards-gradient',
        title: t('component:navbar.dashboards'),
        description: 'Intelligent cost management.',
        to: routes.toCloudCosts()
      }
    ]
  },
  {
    groupId: 6,
    title: t('component:navbar.general'),
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 16,
        iconName: 'settings-2',
        title: t('component:navbar.settings'),
        to: spaceId ? routes.toProjectGeneral({ spaceId }) : '/'
      },
      {
        id: 17,
        iconName: 'notification',
        title: t('component:navbar.notifications'),
        to: routes.toNotifications()
      }
    ]
  },
  {
    groupId: 7,
    title: t('component:navbar.resources'),
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 18,
        iconName: 'wrench',
        title: t('component:navbar.services'),
        to: routes.toServiceReliability()
      },
      {
        id: 19,
        iconName: 'environment',
        title: t('component:navbar.environments'),
        to: routes.toEnvironments()
      },
      {
        id: 20,
        iconName: 'connectors',
        title: t('component:navbar.connectors'),
        to: routes.toConnectors()
      },
      {
        id: 21,
        iconName: 'hierarchy',
        title: t('component:navbar.delegates'),
        to: routes.toDelegates()
      },
      {
        id: 22,
        iconName: 'key',
        title: t('component:navbar.secrets'),
        to: routes.toSecrets()
      },
      {
        id: 23,
        iconName: 'file-icon',
        title: t('component:navbar.file-store'),
        to: routes.toFileStore()
      },
      {
        id: 24,
        iconName: 'sidebar-icon',
        title: t('component:navbar.templates'),
        to: routes.toTemplates()
      },
      {
        id: 25,
        iconName: 'variable',
        title: t('component:navbar.variables'),
        to: routes.toVariables()
      },
      {
        id: 26,
        iconName: 'clock-icon',
        title: t('component:navbar.slo-downtime'),
        to: routes.toSloDowntime()
      },
      {
        id: 27,
        iconName: 'search',
        title: t('component:navbar.discovery'),
        to: routes.toDiscovery()
      },
      {
        id: 28,
        iconName: 'eye',
        title: t('component:navbar.monitored-services'),
        to: routes.toMonitoredServices()
      },
      {
        id: 29,
        iconName: 'stack',
        title: t('component:navbar.overrides'),
        to: routes.toOverrides()
      },
      {
        id: 30,
        iconName: 'bookmark-icon',
        title: t('component:navbar.certificates'),
        to: routes.toCertificates()
      },
      {
        id: 31,
        iconName: 'webhook',
        title: t('component:navbar.webhooks'),
        to: routes.toRepoWebhooks({ spaceId, repoId })
      }
    ]
  },
  {
    groupId: 8,
    title: t('component:navbar.access-control'),
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 32,
        iconName: 'user',
        title: t('component:navbar.users'),
        to: routes.toAdminUsers()
      },
      {
        id: 33,
        iconName: 'users',
        title: t('component:navbar.user-groups'),
        to: routes.toUserGroups()
      },
      {
        id: 34,
        iconName: 'account-icon',
        title: t('component:navbar.service-accounts'),
        to: routes.toServiceAccounts()
      },
      {
        id: 35,
        iconName: 'folder-icon',
        title: t('component:navbar.resource-groups'),
        to: routes.toResourceGroups()
      },
      {
        id: 36,
        iconName: 'briefcase',
        title: t('component:navbar.roles'),
        to: routes.toRoles()
      }
    ]
  },
  {
    groupId: 9,
    title: t('component:navbar.security-and-governance'),
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 37,
        iconName: 'shield',
        title: t('component:navbar.policies'),
        to: routes.toPolicies()
      },
      {
        id: 38,
        iconName: 'snow',
        title: t('component:navbar.freeze-windows'),
        to: routes.toFreezeWindows()
      }
    ]
  },
  {
    groupId: 10,
    title: t('component:navbar.external-tickets'),
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 39,
        iconName: 'ticket',
        title: t('component:navbar.external-tickets'),
        to: routes.toExternalTickets()
      }
    ]
  }
]
