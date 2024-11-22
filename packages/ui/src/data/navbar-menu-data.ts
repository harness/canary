import { MenuGroupType, MenuGroupTypes } from '@components/navbar/types'

export const navbarMenuData: MenuGroupType[] = [
  {
    groupId: 0,
    title: 'Devops',
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 0,
        iconName: 'repositories-gradient',
        title: 'Repositories',
        description: 'Integrated & familiar git experience.',
        to: '/repos'
      },
      {
        id: 1,
        iconName: 'pipelines-gradient',
        title: 'Pipelines',
        description: 'Up to 4X faster than other solutions.',
        to: '/pipelines'
      },
      {
        id: 2,
        iconName: 'execution-gradient',
        title: 'Executions',
        description: 'Optimize feature rollout velocity.',
        to: '/executions'
      },
      {
        id: 3,
        iconName: 'database-gradient',
        title: 'Databases',
        description: 'Manage all your infrastructure.',
        to: '/databases'
      },
      {
        id: 4,
        iconName: 'artifacts-gradient',
        title: 'Artifacts',
        description: 'Validate service resilience.',
        to: '/sandbox/executions/artifacts'
      },
      {
        id: 5,
        iconName: 'infrastructure-gradient',
        title: 'Infrastructure',
        description: 'Manage all your infrastructure.',
        to: '/infrastructure'
      },
      {
        id: 6,
        iconName: 'flag-gradient',
        title: 'Feature Flags',
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
        title: 'Developer Portal',
        description: 'Built for developers, onboard in minutes.',
        to: '/developer/portal'
      },
      {
        id: 8,
        iconName: 'dev-envs-gradient',
        title: 'Developer Environments',
        description: 'Integrated & familiar git experience.',
        to: '/developer/environments'
      },
      {
        id: 9,
        iconName: 'dev-insights-gradient',
        title: 'Developer Insights',
        description: 'Actionable insights on SDLC.',
        to: '/developer/insights'
      }
    ]
  },
  {
    groupId: 2,
    title: 'Secops',
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 10,
        iconName: 'security-tests-gradient',
        title: 'Security Tests',
        description: 'Shift left security testing.',
        to: '/sandbox/executions/security-tests'
      },
      {
        id: 11,
        iconName: 'supply-chain-gradient',
        title: 'Supply Chain',
        description: 'Artifact integrity and governance.',
        to: '/supply-chain'
      }
    ]
  },
  {
    groupId: 3,
    title: 'Finops',
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 12,
        iconName: 'cloud-costs-gradient',
        title: 'Cloud Costs',
        description: 'Intelligent cost management.',
        to: '/cloud-costs'
      }
    ]
  },
  {
    groupId: 4,
    title: 'Reliability',
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 13,
        iconName: 'incidents-gradient',
        title: 'Incidents',
        description: 'Shift left security testing.',
        to: '/incidents'
      },
      {
        id: 14,
        iconName: 'chaos-engineering-gradient',
        title: 'Chaos Engineering',
        description: 'Validate service resilience.',
        to: '/chaos'
      }
    ]
  },
  {
    groupId: 5,
    title: 'Platform',
    type: MenuGroupTypes.GENERAL,
    items: [
      {
        id: 15,
        iconName: 'dashboards-gradient',
        title: 'Dashboards',
        description: 'Intelligent cost management.',
        to: '/dashboards'
      }
    ]
  },
  {
    groupId: 0,
    title: 'General',
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 0,
        iconName: 'settings-2',
        title: 'Settings',
        to: '/admin/default-settings'
      },
      {
        id: 1,
        iconName: 'notification',
        title: 'Notifications',
        to: '/admin/notifications'
      }
    ]
  },
  {
    groupId: 1,
    title: 'Resources',
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 2,
        iconName: 'wrench',
        title: 'Services',
        to: '/admin/services'
      },
      {
        id: 3,
        iconName: 'environment',
        title: 'Environments',
        to: '/admin/environments'
      },
      {
        id: 4,
        iconName: 'connectors',
        title: 'Connectors',
        to: '/admin/connectors'
      },
      {
        id: 5,
        iconName: 'hierarchy',
        title: 'Delegates',
        to: '/admin/delegates'
      },
      {
        id: 6,
        iconName: 'key',
        title: 'Secrets',
        to: '/admin/secrets'
      },
      {
        id: 7,
        iconName: 'file-icon',
        title: 'File Store',
        to: '/admin/filte-store'
      },
      {
        id: 8,
        iconName: 'sidebar-icon',
        title: 'Templates',
        to: '/admin/templates'
      },
      {
        id: 9,
        iconName: 'variable',
        title: 'Variables',
        to: '/admin/variables'
      },
      {
        id: 10,
        iconName: 'clock-icon',
        title: 'SLO Downtime',
        to: '/admin/slo-downtime'
      },
      {
        id: 11,
        iconName: 'search',
        title: 'Discovery',
        to: '/admin/discovery'
      },
      {
        id: 12,
        iconName: 'eye',
        title: 'Monitored Services',
        to: '/admin/monitored-services'
      },
      {
        id: 13,
        iconName: 'stack',
        title: 'Overrides',
        to: '/admin/overrides'
      },
      {
        id: 14,
        iconName: 'bookmark-icon',
        title: 'Certificates',
        to: '/admin/certificates'
      },
      {
        id: 15,
        iconName: 'webhook',
        title: 'Webhooks',
        to: '/admin/webhooks'
      }
    ]
  },
  {
    groupId: 2,
    title: 'Access Control',
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 16,
        iconName: 'user',
        title: 'Users',
        to: '/admin/users'
      },
      {
        id: 17,
        iconName: 'users',
        title: 'User Groups',
        to: '/admin/users-group'
      },
      {
        id: 18,
        iconName: 'account-icon',
        title: 'Service Accounts',
        to: '/admin/service-accounts'
      },
      {
        id: 19,
        iconName: 'folder-icon',
        title: 'Resource Groups',
        to: '/admin/resource-groups'
      },
      {
        id: 20,
        iconName: 'briefcase',
        title: 'Roles',
        to: '/admin/roles'
      }
    ]
  },
  {
    groupId: 3,
    title: 'Security and Governance',
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 21,
        iconName: 'shield',
        title: 'Policies',
        to: '/admin/policies'
      },
      {
        id: 22,
        iconName: 'snow',
        title: 'Freeze Windows',
        to: '/admin/freeze-windows'
      }
    ]
  },
  {
    groupId: 4,
    title: 'External Tickets',
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 23,
        iconName: 'ticket',
        title: 'External Tickets',
        to: '/admin/external-tickets'
      }
    ]
  }
]
