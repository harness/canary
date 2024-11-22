import type { IconProps } from '@harnessio/canary'

export const settingsMenuData: {
  groupId: number
  title: string
  items: {
    id: number
    iconName: IconProps['name']
    title: string
    to: string
  }[]
}[] = [
  {
    groupId: 0,
    title: 'General',
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
