import { MenuGroupType, MenuGroupTypes } from '@harnessio/ui/components'

export const useRootViewWrapperStore = () => {
  const moreMenu: MenuGroupType[] = [
    {
      groupId: 0,
      title: 'Devops',
      type: MenuGroupTypes.GENERAL,
      items: [
        {
          id: 0,
          iconName: 'repository',
          title: 'Repositories',
          description: 'Integrated & familiar git experience.',
          to: '/iatopilskii/repos'
        },
        {
          id: 1,
          iconName: 'pipeline',
          title: 'Pipelines',
          description: 'Up to 4X faster than other solutions.',
          to: '/pipelines'
        },
        {
          id: 2,
          iconName: 'executions',
          title: 'Executions',
          description: 'Optimize feature rollout velocity.',
          to: '/:spaceId/repos/:repoId/pipelines/:pipelineId/executions'
        },
        {
          id: 3,
          iconName: 'database',
          title: 'Databases',
          description: 'Manage all your infrastructure.',
          to: '/databases'
        },
        {
          id: 4,
          iconName: 'artifact',
          title: 'Artifacts',
          description: 'Validate service resilience.',
          to: '/artifacts'
        },
        {
          id: 5,
          iconName: 'infrastructure',
          title: 'Infrastructure',
          description: 'Manage all your infrastructure.',
          to: '/infrastructure-as-code'
        },
        {
          id: 6,
          iconName: 'featured-flags',
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
          iconName: 'dev-portal',
          title: 'Developer Portal',
          description: 'Built for developers, onboard in minutes.',
          to: '/developer/portal'
        },
        {
          id: 8,
          iconName: 'developer-environments',
          title: 'Developer Environments',
          description: 'Integrated & familiar git experience.',
          to: '/developer/environments'
        },
        {
          id: 9,
          iconName: 'developer-insights',
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
          iconName: 'security-test',
          title: 'Security Tests',
          description: 'Shift left security testing.',
          to: '/security-tests'
        },
        {
          id: 11,
          iconName: 'supply-chain',
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
          iconName: 'cloud-costs',
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
          iconName: 'warning-triangle',
          title: 'Incidents',
          description: 'Shift left security testing.',
          to: '/incidents'
        },
        {
          id: 14,
          iconName: 'chaos-engineering',
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
          iconName: 'dashboard',
          title: 'Dashboard',
          description: 'Intelligent cost management.',
          to: '/cloud-costs'
        }
      ]
    }
  ]

  const settingsMenu: MenuGroupType[] = [
    {
      groupId: 6,
      title: 'General',
      type: MenuGroupTypes.SETTINGS,
      items: [
        {
          id: 16,
          iconName: 'settings',
          title: 'Settings',
          to: '/iatopilskii/settings/general'
        },
        {
          id: 17,
          iconName: 'bell',
          title: 'Notifications',
          to: '/notifications'
        }
      ]
    },
    {
      groupId: 7,
      title: 'Resources',
      type: MenuGroupTypes.SETTINGS,
      items: [
        {
          id: 18,
          iconName: 'services',
          title: 'Services',
          to: '/service-reliability'
        },
        {
          id: 19,
          iconName: 'environments',
          title: 'Environments',
          to: '/environments'
        },
        {
          id: 20,
          iconName: 'connectors',
          title: 'Connectors',
          to: '/connectors'
        },
        {
          id: 21,
          iconName: 'delegates',
          title: 'Delegeates',
          to: '/file-store'
        },
        {
          id: 22,
          iconName: 'key',
          title: 'Secrets',
          to: '/secrets'
        },
        {
          id: 23,
          iconName: 'page',
          title: 'File Store',
          to: '/delegates'
        },
        {
          id: 24,
          iconName: 'sidebar',
          title: 'Templates',
          to: '/templates'
        },
        {
          id: 25,
          iconName: 'variables',
          title: 'Variables',
          to: '/variables'
        },
        {
          id: 26,
          iconName: 'clock',
          title: 'SLO Downtime',
          to: '/slo-downtime'
        },
        {
          id: 27,
          iconName: 'search',
          title: 'Discovery',
          to: '/discovery'
        },
        {
          id: 28,
          iconName: 'eye',
          title: 'Monitored Services',
          to: '/monitored-services'
        },
        {
          id: 29,
          iconName: 'overrides',
          title: 'Overrides',
          to: '/overrides'
        },
        {
          id: 30,
          iconName: 'bookmark',
          title: 'Certificates',
          to: '/certificates'
        },
        {
          id: 31,
          iconName: 'webhook',
          title: 'Webhooks',
          to: '/iatopilskii/repos/:repoId/settings/webhooks'
        }
      ]
    },
    {
      groupId: 8,
      title: 'Access Control',
      type: MenuGroupTypes.SETTINGS,
      items: [
        {
          id: 32,
          iconName: 'user',
          title: 'Users',
          to: '/admin/default-settings'
        },
        {
          id: 33,
          iconName: 'group-1',
          title: 'User Groups',
          to: '/admin/user-groups'
        },
        {
          id: 34,
          iconName: 'service-accounts',
          title: 'Service Accounts',
          to: '/admin/service-accounts'
        },
        {
          id: 35,
          iconName: 'folder',
          title: 'Resource Groups',
          to: '/admin/resource-groups'
        },
        {
          id: 36,
          iconName: 'roles',
          title: 'Roles',
          to: '/admin/roles'
        }
      ]
    },
    {
      groupId: 9,
      title: 'Security and Governance',
      type: MenuGroupTypes.SETTINGS,
      items: [
        {
          id: 37,
          iconName: 'shield',
          title: 'Policies',
          to: '/policies'
        },
        {
          id: 38,
          iconName: 'snowflake',
          title: 'Freeze Windows',
          to: '/freeze-windows'
        }
      ]
    },
    {
      groupId: 10,
      title: 'External Tickets',
      type: MenuGroupTypes.SETTINGS,
      items: [
        {
          id: 39,
          iconName: 'externaltickets',
          title: 'External Tickets',
          to: '/external-tickets'
        }
      ]
    }
  ]

  return { moreMenu, settingsMenu }
}
