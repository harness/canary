import { TFunction } from 'i18next'

import { MenuGroupType, MenuGroupTypes } from '../types'

const PREFIX_ROUTE = '/canary/repos/canary'

export const getNavbarMenuData = (t: TFunction): MenuGroupType[] => [
  {
    groupId: 0,
    title: 'Devops',
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 0,
        iconName: 'repositories-gradient',
        title: t('component:navbar.repositories'),
        description: t('component:navbar.repoDesc', 'Integrated & familiar git experience.'),
        to: `${PREFIX_ROUTE}/repositories`
      },
      {
        id: 1,
        iconName: 'pipelines-gradient',
        title: t('component:navbar.pipelines'),
        description: t('component:navbar.pipelineDesc', 'Up to 4X faster than other solutions.'),
        to: `${PREFIX_ROUTE}/pipelines`
      },
      {
        id: 40,
        iconName: 'execution-gradient',
        title: t('component:navbar.executions'),
        description: t('component:navbar.executionDesc', 'Optimize feature rollout velocity.'),
        to: `${PREFIX_ROUTE}/executions`
      },
      {
        id: 41,
        iconName: 'database-gradient',
        title: t('component:navbar.databases'),
        description: t('component:navbar.databaseDesc', 'Manage all your infrastructure.'),
        to: `${PREFIX_ROUTE}/databases`
      },
      {
        id: 42,
        iconName: 'artifacts-gradient',
        title: t('component:navbar.artifacts'),
        description: t('component:navbar.artifactDesc', 'Validate service resilience.'),
        to: `${PREFIX_ROUTE}/artifacts`
      },
      {
        id: 5,
        iconName: 'infrastructure-gradient',
        title: t('component:navbar.infrastructure'),
        description: t('component:navbar.infrastructureDesc', 'Manage all your infrastructure.'),
        to: `${PREFIX_ROUTE}/infrastructure`
      },
      {
        id: 6,
        iconName: 'flag-gradient',
        title: t('component:navbar.feature-flags'),
        description: t('component:navbar.featureFlagsDesc', 'Optimize feature rollout velocity.'),
        to: `${PREFIX_ROUTE}/feature-flags`
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
        description: t('component:navbar.devPortalDesc', 'Built for developers, onboard in minutes.'),
        to: `${PREFIX_ROUTE}/dev-portal`
      },
      {
        id: 8,
        iconName: 'dev-envs-gradient',
        title: t('component:navbar.developer-environments'),
        description: t('component:navbar.devEnvsDesc', 'Integrated & familiar git experience.'),
        to: `${PREFIX_ROUTE}/dev-environments`
      },
      {
        id: 9,
        iconName: 'dev-insights-gradient',
        title: t('component:navbar.developer-insights'),
        description: t('component:navbar.devInsightsDesc', 'Actionable insights on SDLC.'),
        to: `${PREFIX_ROUTE}/dev-insights`
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
        description: t('component:navbar.securityTestsDesc', 'Shift left security testing.'),
        to: `${PREFIX_ROUTE}/security-tests`
      },
      {
        id: 11,
        iconName: 'supply-chain-gradient',
        title: t('component:navbar.supply-chain'),
        description: t('component:navbar.supplyChainDesc', 'Artifact integrity and governance.'),
        to: `${PREFIX_ROUTE}/supply-chain`
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
        description: t('component:navbar.cloudCostsDesc', 'Intelligent cost management.'),
        to: `${PREFIX_ROUTE}/cloud-costs`
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
        description: t('component:navbar.incidentsDesc', 'Shift left security testing.'),
        to: `${PREFIX_ROUTE}/incidents`
      },
      {
        id: 14,
        iconName: 'chaos-engineering-gradient',
        title: t('component:navbar.chaos-engineering'),
        description: t('component:navbar.chaosEngineeringDesc', 'Validate service resilience.'),
        to: `${PREFIX_ROUTE}/chaos`
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
        to: `${PREFIX_ROUTE}/dashboards`
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
        to: `${PREFIX_ROUTE}/settings`
      },
      {
        id: 17,
        iconName: 'notification',
        title: t('component:navbar.notifications'),
        to: `${PREFIX_ROUTE}/notifications`
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
        to: `${PREFIX_ROUTE}/resources`
      },
      {
        id: 19,
        iconName: 'environment',
        title: t('component:navbar.environments'),
        to: `${PREFIX_ROUTE}/environments`
      },
      {
        id: 20,
        iconName: 'connectors',
        title: t('component:navbar.connectors'),
        to: `${PREFIX_ROUTE}/connectors`
      },
      {
        id: 21,
        iconName: 'hierarchy',
        title: t('component:navbar.delegates'),
        to: `${PREFIX_ROUTE}/delegates`
      },
      {
        id: 22,
        iconName: 'key',
        title: t('component:navbar.secrets'),
        to: `${PREFIX_ROUTE}/secrets`
      },
      {
        id: 23,
        iconName: 'file-icon',
        title: t('component:navbar.file-store'),
        to: `${PREFIX_ROUTE}/file-store`
      },
      {
        id: 24,
        iconName: 'sidebar-icon',
        title: t('component:navbar.templates'),
        to: `${PREFIX_ROUTE}/templates`
      },
      {
        id: 25,
        iconName: 'variable',
        title: t('component:navbar.variables'),
        to: `${PREFIX_ROUTE}/variables`
      },
      {
        id: 26,
        iconName: 'clock-icon',
        title: t('component:navbar.slo-downtime'),
        to: `${PREFIX_ROUTE}/slo-downtime`
      },
      {
        id: 27,
        iconName: 'search',
        title: t('component:navbar.discovery'),
        to: `${PREFIX_ROUTE}/discovery`
      },
      {
        id: 28,
        iconName: 'eye',
        title: t('component:navbar.monitored-services'),
        to: `${PREFIX_ROUTE}/monitored-services`
      },
      {
        id: 29,
        iconName: 'stack',
        title: t('component:navbar.overrides'),
        to: `${PREFIX_ROUTE}/overrides`
      },
      {
        id: 30,
        iconName: 'bookmark-icon',
        title: t('component:navbar.certificates'),
        to: `${PREFIX_ROUTE}/certificates`
      },
      {
        id: 31,
        iconName: 'webhook',
        title: t('component:navbar.webhooks'),
        to: `${PREFIX_ROUTE}/webhooks`
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
        to: `${PREFIX_ROUTE}/users`
      },
      {
        id: 33,
        iconName: 'users',
        title: t('component:navbar.user-groups'),
        to: `${PREFIX_ROUTE}/user-groups`
      },
      {
        id: 34,
        iconName: 'account-icon',
        title: t('component:navbar.service-accounts'),
        to: `${PREFIX_ROUTE}/service-accounts`
      },
      {
        id: 35,
        iconName: 'folder-icon',
        title: t('component:navbar.resource-groups'),
        to: `${PREFIX_ROUTE}/resource-groups`
      },
      {
        id: 36,
        iconName: 'briefcase',
        title: t('component:navbar.roles'),
        to: `${PREFIX_ROUTE}/roles`
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
        to: `${PREFIX_ROUTE}/policies`
      },
      {
        id: 38,
        iconName: 'snow',
        title: t('component:navbar.freeze-windows'),
        to: `${PREFIX_ROUTE}/freeze-windows`
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
        to: `${PREFIX_ROUTE}/external-tickets`
      }
    ]
  }
]
