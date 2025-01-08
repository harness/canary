import { TFunction } from 'i18next'

import { MenuGroupType, MenuGroupTypes } from '@harnessio/ui/components'

export const getNavbarMenuData = (t: TFunction, space_ref?: string): MenuGroupType[] => [
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
        to: '/repos'
      },
      {
        id: 1,
        iconName: 'pipelines-gradient',
        title: t('component:navbar.pipelines'),
        description: 'Up to 4X faster than other solutions.',
        to: '/pipelines'
      },
      {
        id: 2,
        iconName: 'execution-gradient',
        title: t('component:navbar.executions'),
        description: 'Optimize feature rollout velocity.',
        to: '/executions'
      },
      {
        id: 3,
        iconName: 'database-gradient',
        title: t('component:navbar.databases'),
        description: 'Manage all your infrastructure.',
        to: '/databases'
      },
      {
        id: 4,
        iconName: 'artifacts-gradient',
        title: t('component:navbar.artifacts'),
        description: 'Validate service resilience.',
        to: '/artifacts'
      },
      {
        id: 5,
        iconName: 'infrastructure-gradient',
        title: t('component:navbar.infrastructure'),
        description: 'Manage all your infrastructure.',
        to: '/infrastructure'
      },
      {
        id: 6,
        iconName: 'flag-gradient',
        title: t('component:navbar.feature-flags'),
        description: 'Optimize feature rollout velocity.',
        to: '/feature-flags'
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
        to: '/developer/portal'
      },
      {
        id: 8,
        iconName: 'dev-envs-gradient',
        title: t('component:navbar.developer-environments'),
        description: 'Integrated & familiar git experience.',
        to: '/developer/environments'
      },
      {
        id: 9,
        iconName: 'dev-insights-gradient',
        title: t('component:navbar.developer-insights'),
        description: 'Actionable insights on SDLC.',
        to: '/developer/insights'
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
        to: '/security-tests'
      },
      {
        id: 11,
        iconName: 'supply-chain-gradient',
        title: t('component:navbar.supply-chain'),
        description: 'Artifact integrity and governance.',
        to: '/supply-chain'
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
        to: '/cloud-costs'
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
        to: '/incidents'
      },
      {
        id: 14,
        iconName: 'chaos-engineering-gradient',
        title: t('component:navbar.chaos-engineering'),
        description: 'Validate service resilience.',
        to: '/chaos'
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
        to: '/dashboards'
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
        to: space_ref ? `${space_ref}/settings/members` : '/'
      },
      {
        id: 17,
        iconName: 'notification',
        title: t('component:navbar.notifications'),
        to: '/admin/notifications'
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
        to: '/admin/services'
      },
      {
        id: 19,
        iconName: 'environment',
        title: t('component:navbar.environments'),
        to: '/admin/environments'
      },
      {
        id: 20,
        iconName: 'connectors',
        title: t('component:navbar.connectors'),
        to: '/admin/connectors'
      },
      {
        id: 21,
        iconName: 'hierarchy',
        title: t('component:navbar.delegates'),
        to: '/admin/delegates'
      },
      {
        id: 22,
        iconName: 'key',
        title: t('component:navbar.secrets'),
        to: '/admin/secrets'
      },
      {
        id: 23,
        iconName: 'file-icon',
        title: t('component:navbar.file-store'),
        to: '/admin/filte-store'
      },
      {
        id: 24,
        iconName: 'sidebar-icon',
        title: t('component:navbar.templates'),
        to: '/admin/templates'
      },
      {
        id: 25,
        iconName: 'variable',
        title: t('component:navbar.variables'),
        to: '/admin/variables'
      },
      {
        id: 26,
        iconName: 'clock-icon',
        title: t('component:navbar.slo-downtime'),
        to: '/admin/slo-downtime'
      },
      {
        id: 27,
        iconName: 'search',
        title: t('component:navbar.discovery'),
        to: '/admin/discovery'
      },
      {
        id: 28,
        iconName: 'eye',
        title: t('component:navbar.monitored-services'),
        to: '/admin/monitored-services'
      },
      {
        id: 29,
        iconName: 'stack',
        title: t('component:navbar.overrides'),
        to: '/admin/overrides'
      },
      {
        id: 30,
        iconName: 'bookmark-icon',
        title: t('component:navbar.certificates'),
        to: '/admin/certificates'
      },
      {
        id: 31,
        iconName: 'webhook',
        title: t('component:navbar.webhooks'),
        to: '/admin/webhooks'
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
        to: '/admin/users'
      },
      {
        id: 33,
        iconName: 'users',
        title: t('component:navbar.user-groups'),
        to: '/admin/users-group'
      },
      {
        id: 34,
        iconName: 'account-icon',
        title: t('component:navbar.service-accounts'),
        to: '/admin/service-accounts'
      },
      {
        id: 35,
        iconName: 'folder-icon',
        title: t('component:navbar.resource-groups'),
        to: '/admin/resource-groups'
      },
      {
        id: 36,
        iconName: 'briefcase',
        title: t('component:navbar.roles'),
        to: '/admin/roles'
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
        to: '/admin/policies'
      },
      {
        id: 38,
        iconName: 'snow',
        title: t('component:navbar.freeze-windows'),
        to: '/admin/freeze-windows'
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
        to: '/admin/external-tickets'
      }
    ]
  }
]
