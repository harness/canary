import { MenuGroupType, MenuGroupTypes } from '@harnessio/ui/components'

export const useRootViewWrapperStore = () => {
  const moreMenu = [
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
          to: '/iatopilskii/repos'
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
          to: '/:spaceId/repos/:repoId/pipelines/:pipelineId/executions'
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
          to: '/artifacts'
        },
        {
          id: 5,
          iconName: 'infrastructure-gradient',
          title: 'Infrastructure',
          description: 'Manage all your infrastructure.',
          to: '/infrastructure-as-code'
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
          to: '/security-tests'
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
          title: 'Dashboard',
          description: 'Intelligent cost management.',
          to: '/cloud-costs'
        }
      ]
    }
  ] as MenuGroupType[]

  const settingsMenu = [
    {
      groupId: 6,
      title: 'General',
      type: MenuGroupTypes.SETTINGS,
      items: [
        {
          id: 16,
          iconName: 'settings-2',
          title: 'Settings',
          to: '/iatopilskii/settings/general'
        },
        {
          id: 17,
          iconName: 'notification',
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
          iconName: 'wrench',
          title: 'Services',
          to: '/service-reliability'
        },
        {
          id: 19,
          iconName: 'environment',
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
          iconName: 'hierarchy',
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
          iconName: 'file-icon',
          title: 'File Store',
          to: '/delegates'
        },
        {
          id: 24,
          iconName: 'sidebar-icon',
          title: 'Templates',
          to: '/templates'
        },
        {
          id: 25,
          iconName: 'variable',
          title: 'Variables',
          to: '/variables'
        },
        {
          id: 26,
          iconName: 'clock-icon',
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
          iconName: 'stack',
          title: 'Overrides',
          to: '/overrides'
        },
        {
          id: 30,
          iconName: 'bookmark-icon',
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
      title: 'Acces Control',
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
          iconName: 'users',
          title: 'User Groups',
          to: '/admin/user-groups'
        },
        {
          id: 34,
          iconName: 'account-icon',
          title: 'Service Accounts',
          to: '/admin/service-accounts'
        },
        {
          id: 35,
          iconName: 'folder-icon',
          title: 'Resource Groups',
          to: '/admin/resource-groups'
        },
        {
          id: 36,
          iconName: 'briefcase',
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
          iconName: 'snow',
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
          iconName: 'ticket',
          title: 'External Tickets',
          to: '/external-tickets'
        }
      ]
    }
  ] as MenuGroupType[]

  return { moreMenu, settingsMenu }
}
