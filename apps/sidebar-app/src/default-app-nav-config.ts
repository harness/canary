import type { AppNavFixedItem, AppNavProps } from './types/app-nav-types'
import { pinnedHomeItem, workspaceSwitcher } from './data/app-nav-demo-data'
import { moreMenuModuleItems } from './data/more-menu-module-items'
import { moreMenuResourceItems } from './data/more-menu-resource-items'

const moreMenuSearchPlaceholder = 'Search'

const moreMenuTriggerTitle = 'more'
const moreMenuIconName = 'menu-more-horizontal' as const

export const defaultAppNavFixedHome: AppNavFixedItem = { type: 'item', item: pinnedHomeItem }

export const defaultAppNavFixedMore: AppNavFixedItem = {
  type: 'more',
  id: 'more-menu',
  trigger: {
    title: moreMenuTriggerTitle,
    icon: moreMenuIconName,
    withRightIndicator: true
  },
  drawerSearchPlaceholder: moreMenuSearchPlaceholder,
  drawerSearchInputId: 'more-menu-search',
  itemGroups: [
    {
      groupId: 'modules',
      label: 'Modules',
      defaultExpanded: true,
      items: moreMenuModuleItems
    },
    {
      groupId: 'resources',
      label: 'Resources',
      defaultExpanded: false,
      items: moreMenuResourceItems
    }
  ]
}

/** Sidebar chrome without Recents; consumers merge `recentSection` from app-level state. */
export const defaultAppNavProps: AppNavProps = {
  headerItem: workspaceSwitcher,
  fixedItems: [defaultAppNavFixedHome, defaultAppNavFixedMore]
}
