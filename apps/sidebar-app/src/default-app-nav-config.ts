import type { AppNavFixedItem, AppNavProps } from './types/app-nav-types'
import { demoAppNavHeaderItem, pinnedHomeItem } from './data/app-nav-demo-data'
import { moreMenuModuleItems } from './data/more-menu-module-items'
import { moreMenuResourceItems } from './data/more-menu-resource-items'

/** Base nav config without `footer` (footer often needs router/theme; see `useDemoAppNavFooterItem`). */
export type DefaultAppNavPropsBase = Omit<AppNavProps, 'footer'>

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

/** Sidebar chrome without `footer` or Recents; merge `footer` and `content.recentSection` at the app. */
export const defaultAppNavProps: DefaultAppNavPropsBase = {
  header: demoAppNavHeaderItem,
  content: {
    fixedItems: [defaultAppNavFixedHome, defaultAppNavFixedMore]
  }
}
