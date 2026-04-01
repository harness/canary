import { type FC, useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import '@harnessio/ui/styles.css'
import '../styles/App.css'
import '../styles/sidebar.css'

import { type SidebarItemProps } from '@harnessio/ui/components'

import { AppShell } from '../components/app-shell'
import { recentSectionLabel } from '../data/app-nav-demo-data'
import {
  defaultAppNavFixedHome,
  defaultAppNavFixedMore,
  defaultAppNavProps
} from '../default-app-nav-config'
import { getSidebarItemForPathname } from '../nav-path-to-item'
import type { AppNavFixedItem, AppNavFixedItemRow, AppNavProps } from '../types/app-nav-types'
import type { AppProps } from '../types/app-shell-types'
import { useRecentNavItems } from '../use-recent-nav-items'
import { useDemoAppNavFooterItem } from '../components/use-demo-app-nav-footer-item'

/** Layout only: `AppShell.Layout` → `AppShell.Nav` + `AppShell.Content`. Providers and nav data live outside (e.g. `AppRoot`, `SidebarDemo`). */
export const App = ({ nav, header }: AppProps) => (
  <AppShell.Layout header={header}>
    <AppShell.Nav {...nav} />
    <AppShell.Content />
  </AppShell.Layout>
)

const recentNavMaxItems = 5
const recentNavStorageKey = 'sidebar-app-recent-nav-v1'
const recentPinAriaLabel = 'Pin'
const pinnedUnpinAriaLabel = 'Unpin'

/** `to` values for default fixed rows (excludes `more` and other non-route fixed entries). */
const defaultFixedNavPaths = defaultAppNavProps.content.fixedItems.flatMap(entry =>
  entry.type === 'item' && 'to' in entry.item && typeof entry.item.to === 'string'
    ? [entry.item.to]
    : []
)

function sidebarItemWithoutRowActions(item: SidebarItemProps): SidebarItemProps {
  const { actionButtons: _actionButtons, active: _active, ...rest } = item as SidebarItemProps & {
    actionButtons?: unknown
    active?: boolean
  }
  return rest as SidebarItemProps
}

/** Demo: pinned-from-recents, reorder, and `nav` config for `App`. */
export const SidebarDemo: FC = () => {
  const location = useLocation()
  const footerItem = useDemoAppNavFooterItem()
  const [pinnedFromRecents, setPinnedFromRecents] = useState<SidebarItemProps[]>([])

  const excludeFromRecents = useMemo(() => {
    const paths = new Set<string>(defaultFixedNavPaths)
    for (const p of pinnedFromRecents) {
      if ('to' in p && typeof p.to === 'string' && p.to) paths.add(p.to)
    }
    return Array.from(paths)
  }, [pinnedFromRecents])

  const { recentItems, removeRecentByTo, prependRecentItem } = useRecentNavItems({
    maxItems: recentNavMaxItems,
    storageKey: recentNavStorageKey,
    getItemForPath: getSidebarItemForPathname,
    excludeFromRecents
  })

  const handlePinFromRecents = useCallback(
    (item: SidebarItemProps) => {
      if (!('to' in item) || typeof item.to !== 'string') return
      const to = item.to
      const clean = sidebarItemWithoutRowActions(item)
      setPinnedFromRecents(prev => {
        if (prev.some(p => 'to' in p && p.to === to)) return prev
        return [...prev, clean]
      })
      removeRecentByTo(to)
    },
    [removeRecentByTo]
  )

  const handleReorderPinned = useCallback((orderedIds: string[]) => {
    setPinnedFromRecents(prev => {
      const byTo = new Map(
        prev.map(p => {
          const to = 'to' in p && typeof p.to === 'string' ? p.to : ''
          return [to, p] as const
        }).filter((e): e is readonly [string, SidebarItemProps] => e[0] !== '')
      )
      return orderedIds.map(id => byTo.get(id)).filter((p): p is SidebarItemProps => p != null)
    })
  }, [])

  const handleUnpinToRecents = useCallback(
    (item: SidebarItemProps) => {
      if (!('to' in item) || typeof item.to !== 'string') return
      const to = item.to
      setPinnedFromRecents(prev => prev.filter(p => !('to' in p) || p.to !== to))
      prependRecentItem(sidebarItemWithoutRowActions(item))
    },
    [prependRecentItem]
  )

  const fixedItems = useMemo<AppNavFixedItem[]>(() => {
    const pinRows: AppNavFixedItem[] = pinnedFromRecents.map(p => {
      const base = sidebarItemWithoutRowActions(p)
      const to = 'to' in base && typeof base.to === 'string' ? base.to : null
      return {
        type: 'item' as const,
        item: {
          ...base,
          active: 'to' in base && base.to === location.pathname,
          actionButtons: to
            ? [
                {
                  iconName: 'pin-slash' as const,
                  iconOnly: true,
                  onClick: () => {
                    handleUnpinToRecents(p)
                  },
                  'aria-label': pinnedUnpinAriaLabel
                }
              ]
            : undefined
        },
        ...(to ? { sortableId: to } : {})
      }
    })
    const homeItem = (defaultAppNavFixedHome as AppNavFixedItemRow).item
    const homeTo = 'to' in homeItem && typeof homeItem.to === 'string' ? homeItem.to : null
    const homeFixed: AppNavFixedItem = {
      type: 'item',
      item: {
        ...homeItem,
        active: homeTo != null && homeTo === location.pathname
      }
    }

    return [homeFixed, ...pinRows, defaultAppNavFixedMore]
  }, [handleUnpinToRecents, pinnedFromRecents, location.pathname])

  const nav: AppNavProps = useMemo(() => {
    const recentsForList = recentItems.filter(
      item =>
        !('to' in item) ||
        typeof item.to !== 'string' ||
        !excludeFromRecents.includes(item.to)
    )

    return {
      ...defaultAppNavProps,
      footer: footerItem,
      content: {
        ...defaultAppNavProps.content,
        fixedItems,
        onReorderSortableFixedItems: handleReorderPinned,
        showFixedItemDragGrip: row => Boolean(row.sortableId),
        recentSection:
          recentsForList.length > 0
            ? {
                label: recentSectionLabel,
                items: recentsForList.map(item => {
                  const row: SidebarItemProps = {
                    ...item,
                    active: 'to' in item && item.to === location.pathname
                  }
                  return {
                    ...row,
                    actionButtons: [
                      {
                        iconName: 'pin' as const,
                        iconOnly: true,
                        onClick: () => {
                          handlePinFromRecents(item)
                        },
                        'aria-label': recentPinAriaLabel
                      }
                    ]
                  }
                })
              }
            : undefined
      }
    }
  }, [
    excludeFromRecents,
    fixedItems,
    footerItem,
    handlePinFromRecents,
    handleReorderPinned,
    recentItems,
    location.pathname
  ])

  return <App nav={nav} />
}
