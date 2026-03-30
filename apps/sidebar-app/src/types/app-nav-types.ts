import type { ReactNode } from 'react'

import type { SidebarItemProps } from '@harnessio/ui/components'

import type { MoreMenuDrawerItem } from '../data/more-menu-module-items'

export const DEFAULT_MORE_DRAWER_PREVIEW_COUNT = 6

/** One collapsible block inside the “more” drawer (e.g. Modules, Resources). */
export type AppNavMoreItemGroup = {
  groupId: string
  label: string
  /** When collapsed, only this many rows show before More. Defaults to {@link DEFAULT_MORE_DRAWER_PREVIEW_COUNT}. */
  previewCount?: number
  defaultExpanded: boolean
  items: MoreMenuDrawerItem[]
}

/** Pinned row that opens the more-menu drawer with grouped links + search. */
export type AppNavFixedItemMore = {
  type: 'more'
  id: string
  /** Row shown in the sidebar; drawer open/close is wired internally. */
  trigger: SidebarItemProps
  drawerSearchPlaceholder?: string
  /** Optional id for the search input (a11y); default derived from `id` */
  drawerSearchInputId?: string
  itemGroups: AppNavMoreItemGroup[]
}

/** Normal sidebar row (link/button); optional `children` for submenu. */
export type AppNavFixedItemRow = {
  type: 'item'
  item: SidebarItemProps
  children?: ReactNode
}

export type AppNavFixedItem = AppNavFixedItemRow | AppNavFixedItemMore

/** Scrollable list under the pinned block: either a flat item list or custom nodes. */
export type AppNavRecentSection =
  | { label: string; items: SidebarItemProps[] }
  | { label: string; children: ReactNode }

export type AppNavProps = {
  /** Top-of-sidebar row (e.g. workspace switcher). */
  headerItem: SidebarItemProps
  fixedItems: AppNavFixedItem[]
  recentSection?: AppNavRecentSection
}
