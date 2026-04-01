import type { SidebarItemProps } from '@harnessio/ui/components'

import { buildsNav, demoItems, infrastructureNav, pinnedHomeItem } from './data/app-nav-demo-data'
import { moreMenuModuleItems } from './data/more-menu-module-items'
import { moreMenuResourceItems } from './data/more-menu-resource-items'

function pathMapFromEntries(entries: Iterable<SidebarItemProps>): Map<string, SidebarItemProps> {
  const map = new Map<string, SidebarItemProps>()
  for (const item of entries) {
    if ('to' in item && typeof item.to === 'string') {
      map.set(item.to, { ...item, active: undefined })
    }
  }
  return map
}

const exactPathToItem: Map<string, SidebarItemProps> = (() => {
  const map = new Map<string, SidebarItemProps>()

  const merge = (m: Map<string, SidebarItemProps>) => {
    for (const [k, v] of m) {
      map.set(k, v)
    }
  }

  merge(pathMapFromEntries([pinnedHomeItem]))
  merge(pathMapFromEntries(demoItems))
  merge(pathMapFromEntries([buildsNav.parent]))
  merge(pathMapFromEntries(buildsNav.subItems as SidebarItemProps[]))
  merge(pathMapFromEntries(Array.from(infrastructureNav.subItems, i => ({ ...i })) as SidebarItemProps[]))
  merge(pathMapFromEntries(moreMenuModuleItems))
  merge(pathMapFromEntries(moreMenuResourceItems))

  return map
})()

/**
 * Demo app: resolve `location.pathname` to a single sidebar row for recent tracking.
 * Returns `null` for paths that should not appear in Recents (e.g. `/`).
 */
export function getSidebarItemForPathname(pathname: string): SidebarItemProps | null {
  if (pathname === '/') {
    return null
  }

  const direct = exactPathToItem.get(pathname)
  if (direct) {
    return direct
  }

  return null
}
