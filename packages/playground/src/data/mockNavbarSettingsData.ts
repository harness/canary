import { IconProps } from '@chaos-engineeringio/canary'

export const navbarSettingsData: {
  groupId: number
  title: string
  items: {
    id: number
    iconName: IconProps['name']
    title: string
    description: string
    to: string
  }[]
}[] = [
  {
    groupId: 0,
    title: 'General',
    items: [
      {
        id: 0,
        iconName: 'settings-default',
        title: 'Default Settings',
        description: 'App to production with no scripts.',
        to: '/sandbox/settings/project/general'
      },
      {
        id: 1,
        iconName: 'settings-notifications',
        title: 'Notifications',
        description: 'Manage notification settings for alerts.',
        to: '/sandbox/settings/general/notifications'
      }
    ]
  },
  {
    groupId: 1,
    title: 'Project-level Resources',
    items: [
      {
        id: 2,
        iconName: 'settings-default',
        title: 'Services',
        description: 'Manage your services and integrations.',
        to: '/sandbox/settings/project-level-resources/services'
      },
      {
        id: 3,
        iconName: 'settings-environment',
        title: 'Environments',
        description: 'Define and manage deployment environments.',
        to: '/sandbox/settings/project-level-resources/environments'
      },
      {
        id: 4,
        iconName: 'chaos-engineering',
        title: 'Connectors',
        description: 'Integrate with third-party services.',
        to: '/sandbox/settings/project-level-resources/connectors'
      },
      {
        id: 5,
        iconName: 'chaos-engineering',
        title: 'Delegates',
        description: 'Manage your delegate configurations.',
        to: '/sandbox/settings/project-level-resources/delegates'
      },
      {
        id: 6,
        iconName: 'chaos-engineering',
        title: 'Secrets',
        description: 'Store and manage sensitive information securely.',
        to: '/sandbox/settings/project-level-resources/secrets'
      },
      {
        id: 7,
        iconName: 'chaos-engineering',
        title: 'File Store',
        description: 'Manage files and assets for your project.',
        to: '/sandbox/settings/project-level-resources/file-store'
      },
      {
        id: 8,
        iconName: 'chaos-engineering',
        title: 'Templates',
        description: 'Create and manage deployment templates.',
        to: '/sandbox/settings/project-level-resources/templates'
      },
      {
        id: 9,
        iconName: 'chaos-engineering',
        title: 'Variables',
        description: 'Manage project-level variables.',
        to: '/sandbox/settings/project-level-resources/variables'
      },
      {
        id: 10,
        iconName: 'chaos-engineering',
        title: 'SLO Downtime',
        description: 'Manage service level objectives and downtimes.',
        to: '/sandbox/settings/project-level-resources/slo-downtime'
      },
      {
        id: 11,
        iconName: 'chaos-engineering',
        title: 'Discovery',
        description: 'Discover services and their dependencies.',
        to: '/sandbox/settings/project-level-resources/discovery'
      },
      {
        id: 12,
        iconName: 'chaos-engineering',
        title: 'Monitored Services',
        description: 'Monitor and manage your services.',
        to: '/sandbox/settings/project-level-resources/monitored-services'
      },
      {
        id: 13,
        iconName: 'chaos-engineering',
        title: 'Overrides',
        description: 'Override default configurations for specific services.',
        to: '/sandbox/settings/project-level-resources/overrides'
      },
      {
        id: 14,
        iconName: 'chaos-engineering',
        title: 'Certificates',
        description: 'Manage SSL certificates and keys.',
        to: '/sandbox/settings/project-level-resources/certificates'
      },
      {
        id: 15,
        iconName: 'chaos-engineering',
        title: 'Webhooks',
        description: 'Manage webhooks for external integrations.',
        to: '/sandbox/settings/project-level-resources/webhooks'
      }
    ]
  },
  {
    groupId: 2,
    title: 'Access Control',
    items: [
      {
        id: 16,
        iconName: 'chaos-engineering',
        title: 'Users',
        description: 'Manage user accounts and permissions.',
        to: '/sandbox/settings/access-control/users'
      },
      {
        id: 17,
        iconName: 'chaos-engineering',
        title: 'User Group',
        description: 'Organize users into groups for easier management.',
        to: '/sandbox/settings/access-control/user-group'
      },
      {
        id: 18,
        iconName: 'chaos-engineering',
        title: 'Service Accounts',
        description: 'Manage service accounts for automated processes.',
        to: '/sandbox/settings/access-control/service-accounts'
      },
      {
        id: 19,
        iconName: 'chaos-engineering',
        title: 'Resource Groups',
        description: 'Manage resource group configurations.',
        to: '/sandbox/settings/access-control/resource-groups'
      },
      {
        id: 20,
        iconName: 'chaos-engineering',
        title: 'Roles',
        description: 'Define roles and permissions for users.',
        to: '/sandbox/settings/access-control/roles'
      }
    ]
  },
  {
    groupId: 3,
    title: 'Security and Governance',
    items: [
      {
        id: 21,
        iconName: 'chaos-engineering',
        title: 'Policies',
        description: 'Manage security and compliance policies.',
        to: '/sandbox/settings/security-and-governance/policies'
      },
      {
        id: 22,
        iconName: 'chaos-engineering',
        title: 'Freeze Windows',
        description: 'Manage scheduled freeze windows for deployments.',
        to: '/sandbox/settings/security-and-governance/freeze-windows'
      }
    ]
  },
  {
    groupId: 4,
    title: 'External Tickets',
    items: [
      {
        id: 23,
        iconName: 'chaos-engineering',
        title: 'External Tickets',
        description: 'Manage external ticketing integrations.',
        to: '/sandbox/settings/external-tickets/external-tickets'
      }
    ]
  }
]
