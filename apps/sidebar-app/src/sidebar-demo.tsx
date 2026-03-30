import { type FC, useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { type SidebarItemProps } from '@harnessio/ui/components'

import { App } from './App'
import { recentSectionLabel } from './data/app-nav-demo-data'
import {
  defaultAppNavFixedHome,
  defaultAppNavFixedMore,
  defaultAppNavProps
} from './default-app-nav-config'
import { getSidebarItemForPathname } from './nav-path-to-item'
import type { AppNavFixedItem, AppNavProps } from './types/app-nav-types'
import { useRecentNavItems } from './use-recent-nav-items'

const recentNavMaxItems = 5
const recentNavStorageKey = 'sidebar-app-recent-nav-v1'
const recentPinAriaLabel = 'Pin'
const pinnedUnpinAriaLabel = 'Unpin'

const defaultFixedNavPath =
  defaultAppNavFixedHome.type === 'item' &&
  'to' in defaultAppNavFixedHome.item &&
  typeof defaultAppNavFixedHome.item.to === 'string'
    ? defaultAppNavFixedHome.item.to
    : null

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
  const [pinnedFromRecents, setPinnedFromRecents] = useState<SidebarItemProps[]>([])

  const pinnedPaths = useMemo(
    () =>
      pinnedFromRecents
        .map(p => ('to' in p && typeof p.to === 'string' ? p.to : '') as string)
        .filter(Boolean),
    [pinnedFromRecents]
  )

  const { recentItems, removeRecentByTo, prependRecentItem } = useRecentNavItems({
    maxItems: recentNavMaxItems,
    storageKey: recentNavStorageKey,
    getItemForPath: getSidebarItemForPathname,
    excludeFromRecents: pinnedPaths
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
    return [defaultAppNavFixedHome, ...pinRows, defaultAppNavFixedMore]
  }, [handleUnpinToRecents, pinnedFromRecents, location.pathname])

  const nav: AppNavProps = useMemo(
    () => ({
      ...defaultAppNavProps,
      fixedItems,
      onReorderSortableFixedItems: handleReorderPinned,
      showFixedItemDragGrip: row => Boolean(row.sortableId),
      recentSection:
        recentItems.length > 0
          ? {
              label: recentSectionLabel,
              items: recentItems.map(item => {
                const row: SidebarItemProps = {
                  ...item,
                  active: 'to' in item && item.to === location.pathname
                }
                const isAlreadyDefaultFixed =
                  defaultFixedNavPath != null &&
                  'to' in item &&
                  item.to === defaultFixedNavPath
                if (isAlreadyDefaultFixed) {
                  return row
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
    }),
    [fixedItems, handlePinFromRecents, handleReorderPinned, recentItems, location.pathname]
  )

  return <App nav={nav} />
}
