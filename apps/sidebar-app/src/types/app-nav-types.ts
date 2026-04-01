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

export type MoreDrawerSectionGroupProps = { section: AppNavMoreItemGroup }

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
  /**
   * When set with {@link AppNavContentProps.onReorderSortableFixedItems}, this row joins the sortable block
   * (must be one contiguous run — e.g. pins between Home and More). Grip + drag use `Sidebar.Item` dnd props.
   */
  sortableId?: string
}

export type AppNavFixedItemRowWithSortable = AppNavFixedItemRow & { sortableId: string }

export type SortableFixedSidebarRowProps = {
  entry: AppNavFixedItemRowWithSortable
  showGrip: boolean
}

export type AppNavFixedItem = AppNavFixedItemRow | AppNavFixedItemMore

/** Scrollable list under the pinned block: either a flat item list or custom nodes. */
export type AppNavRecentSection =
  | { label: string; items: SidebarItemProps[] }
  | { label: string; children: ReactNode }

/** Scrollable middle: pinned / more drawer rows and optional Recents. */
export type AppNavContentProps = {
  fixedItems: AppNavFixedItem[]
  recentSection?: AppNavRecentSection
  /**
   * Called after a successful reorder within the contiguous `sortableId` fixed rows.
   * Provide together with `sortableId` on those rows to enable drag-and-drop.
   */
  onReorderSortableFixedItems?: (orderedSortableIds: string[]) => void
  /**
   * Per-row gate for showing the drag grip and enabling drag (rows still need `sortableId` + `onReorderSortableFixedItems`).
   * Omit to show grip for every sortable row.
   */
  showFixedItemDragGrip?: (row: AppNavFixedItemRow) => boolean
}

export type AppNavProps = {
  /** Top row — same `Sidebar.Item` props shape as rows in `content`. */
  header: SidebarItemProps
  content: AppNavContentProps
  /** Bottom row — same `Sidebar.Item` props shape as rows in `content`. */
  footer: SidebarItemProps
}
