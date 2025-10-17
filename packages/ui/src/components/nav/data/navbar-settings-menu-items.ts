import { MenuGroupTypes } from '@/components'

import { GetNavbarMenuData } from '../types'

export const getNavbarSettingsMenuData: GetNavbarMenuData = ({ t, routes, params }) => [
  {
    groupId: 6,
    title: t('component:navbar.settings', 'Settings'),
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 16,
        iconName: 'settings',
        title: t('component:navbar.general', 'General'),
        to: routes?.toSettings?.(params) || ''
      },
      {
        id: 32,
        iconName: 'user',
        title: t('component:navbar.access-control', 'Access Control'),
        to: routes?.toAccessControl?.(params) || ''
      },
      {
        id: 17,
        iconName: 'bell',
        title: t('component:navbar.notifications', 'Notifications'),
        to: routes?.toNotificationsManagement?.(params) || ''
      }
    ]
  },
  {
    groupId: 7,
    title: t('component:navbar.resources', 'Resources'),
    type: MenuGroupTypes.SETTINGS,
    items: [
      {
        id: 30,
        iconName: 'bookmark',
        title: t('component:navbar.certificates', 'Certificates'),
        to: routes?.toCertificates?.(params) || ''
      },
      {
        id: 20,
        iconName: 'connectors',
        title: t('component:navbar.connectors', 'Connectors'),
        to: routes?.toConnectors?.(params) || ''
      },
      {
        id: 18,
        iconName: 'services',
        title: t('component:navbar.services', 'Services'),
        to: routes?.toSettingsServices?.(params) || ''
      },
      {
        id: 22,
        iconName: 'key',
        title: t('component:navbar.secrets', 'Secrets'),
        to: routes?.toSecretsSettings?.(params) || ''
      },
      {
        id: 21,
        iconName: 'delegates',
        title: t('component:navbar.delegates', 'Delegates'),
        to: routes?.toDelegateList?.(params) || ''
      },
      {
        id: 19,
        iconName: 'environments',
        title: t('component:navbar.environments', 'Environments'),
        to: routes?.toSettingsEnvironments?.(params) || ''
      },
      {
        id: 25,
        iconName: 'variables',
        title: t('component:navbar.variables', 'Variables'),
        to: routes?.toVariables?.(params) || ''
      },
      {
        id: 24,
        iconName: 'sidebar',
        title: t('component:navbar.templates', 'Templates'),
        to: routes?.toTemplates?.(params) || ''
      },
      {
        id: 37,
        iconName: 'shield',
        title: t('component:navbar.policies', 'Policies'),
        to: routes?.toGovernancePolicyListingSettings?.(params) || ''
      },
      {
        id: 31,
        iconName: 'webhook',
        title: t('component:navbar.webhooks', 'Webhooks'),
        to: routes?.toWebhooks?.(params) || ''
      }
    ]
  }
]
