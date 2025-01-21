import { TFunction } from 'i18next'

import { NavbarItemType } from './types'

export const getAdminMenuItem = (t: TFunction): Pick<NavbarItemType, 'title' | 'iconName'> => {
  return {
    title: t('navbar.settings', 'Settings'),
    iconName: 'settings-1'
  }
}
