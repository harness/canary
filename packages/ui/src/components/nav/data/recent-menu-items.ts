import { NavbarItemType } from '@components/app-sidebar'

import { GetNavbarMenuDataParams } from '../types'

/**
 * No pinned menu items by default
 */
export const getRecentMenuItems = ({ t, routes, params }: GetNavbarMenuDataParams): NavbarItemType[] => [
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
  }
]
