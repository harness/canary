import { NavbarItemType, UserMenuItemType, UserMenuKeys } from './types'

export const adminMenuItem: Pick<NavbarItemType, 'title' | 'iconName'> = {
  title: 'Settings',
  iconName: 'settings-1'
}

export const userMenuItems: UserMenuItemType[] = [
  {
    key: UserMenuKeys.ACCOUNT,
    iconName: 'user',
    title: 'Account',
    to: '/account',
    isSeparated: false
  },
  {
    key: UserMenuKeys.THEME,
    iconName: 'paint',
    title: 'Theme',
    to: '/theme',
    isSeparated: false
  },
  {
    key: UserMenuKeys.CUSTOM_NAV,
    iconName: 'navigation',
    title: 'Customize navigation',
    to: null,
    isSeparated: false
  },
  {
    key: UserMenuKeys.ADMINISTRATION,
    iconName: 'settings-1',
    title: 'Administration',
    to: '/sandbox/settings/profile/general',
    isSeparated: true
  },
  {
    key: UserMenuKeys.LOG_OUT,
    iconName: 'logOut',
    title: 'Log out',
    to: null,
    isSeparated: true
  }
]
