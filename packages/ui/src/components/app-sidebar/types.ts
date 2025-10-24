import { IconV2NamesType } from '@/components'

export enum MenuGroupTypes {
  GENERAL = 'general',
  SETTINGS = 'settings'
}

interface MenuGroupType {
  groupId: number | string
  title: string
  type: MenuGroupTypes
  items: NavbarItemType[]
}

type NavbarItemIdType = number | string

interface NavbarItemType {
  id: NavbarItemIdType
  title: string
  iconName?: IconV2NamesType
  description?: string
  to: string
  permanentlyPinned?: boolean
  subItems?: NavbarItemType[]
}

export enum UserMenuKeys {
  ACCOUNT = 'account',
  THEME = 'theme',
  CUSTOM_NAV = 'customNavigation',
  ADMINISTRATION = 'administration',
  LOG_OUT = 'logOut'
}

interface UserMenuItemType {
  key: UserMenuKeys
  iconName: IconV2NamesType
  title: string
  to: string | null
  isSeparated: boolean
}

interface NavState {
  pinnedMenu: NavbarItemType[]
  recentMenu: NavbarItemType[]
  setPinned: (items: NavbarItemType, pin: boolean) => void
  setRecent: (items: NavbarItemType, remove?: boolean) => void
  setNavLinks: (links: { pinnedMenu?: NavbarItemType[]; recentMenu?: NavbarItemType[] }) => void
}

export type { MenuGroupType, NavbarItemType, UserMenuItemType, NavbarItemIdType, NavState }
