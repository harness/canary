import { TFunction } from 'i18next'

import { NavbarItemType, UserMenuItemType, UserMenuKeys } from './types'

export const getAdminMenuItem = (t: TFunction): Pick<NavbarItemType, 'title' | 'iconName'> => {
  return {
    title: t('navbar.settings', 'Settings'),
    iconName: 'settings-1'
  }
}

export const getUserMenuItems = (t: TFunction): UserMenuItemType[] => [
  {
    key: UserMenuKeys.ACCOUNT,
    iconName: 'user',
    title: t('component:navbar.profile', 'Profile'),
    to: '/profile',
    isSeparated: false
  },
  {
    key: UserMenuKeys.THEME,
    iconName: 'paint',
    title: t('component:navbar.theme', 'Theme'),
    to: '/theme',
    isSeparated: false
  },
  {
    key: UserMenuKeys.CUSTOM_NAV,
    iconName: 'navigation',
    title: t('component:navbar.customNav', 'Customize navigation'),
    to: null,
    isSeparated: false
  },

  {
    key: UserMenuKeys.LOG_OUT,
    iconName: 'logOut',
    title: t('component:navbar.logout', 'Log out'),
    to: null,
    isSeparated: true
  }
]
