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
    title: t('component:navbar.account', 'Account'),
    to: '/account',
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
    key: UserMenuKeys.ADMINISTRATION,
    iconName: 'settings-1',
    title: t('component:navbar.administration', 'Administration'),
    to: '/settings/general',
    isSeparated: true
  },
  {
    key: UserMenuKeys.LOG_OUT,
    iconName: 'logOut',
    title: t('component:navbar.logout', 'Log out'),
    to: null,
    isSeparated: true
  }
]
