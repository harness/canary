import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import type { SidebarItemProps } from '@harnessio/ui/components'

/** Minimal shape stored in memory / optional localStorage (no `active`, etc.). */
export type RecentNavStorageEntry = Pick<SidebarItemProps, 'to' | 'title' | 'icon'> & { to: string }

function isRecentNavStorageEntry(x: unknown): x is RecentNavStorageEntry {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return typeof o.to === 'string' && typeof o.title === 'string'
}

function toStorageEntry(item: SidebarItemProps): RecentNavStorageEntry | null {
  if (!('to' in item) || typeof item.to !== 'string') return null
  return { to: item.to, title: item.title, icon: item.icon }
}

function fromStorageEntry(e: RecentNavStorageEntry): SidebarItemProps {
  return { to: e.to, title: e.title, icon: e.icon }
}

function readStored(storageKey: string | undefined, maxItems: number): SidebarItemProps[] {
  if (!storageKey) return []
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isRecentNavStorageEntry)
      .slice(0, maxItems)
      .map(fromStorageEntry)
  } catch {
    return []
  }
}

export type UseRecentNavItemsOptions = {
  /** Max recents to keep (consumer-defined). */
  maxItems: number
  /** Map current path to a sidebar row, or `null` to skip (e.g. workspace root). */
  getItemForPath: (pathname: string) => SidebarItemProps | null
  /** When set, load/save recents via `localStorage` under this key. Omit for session-only memory. */
  storageKey?: string
  /**
   * `Sidebar.Item` `to` values that must never be added to recents (e.g. routes pinned to fixed nav).
   * Pass a memoized array when contents change (e.g. `useMemo(() => pinned.map(p => p.to), [pinned])`).
   */
  excludeFromRecents?: string[]
}

export type UseRecentNavItemsResult = {
  recentItems: SidebarItemProps[]
  clearRecents: () => void
  removeRecentByTo: (to: string) => void
  /**
   * Insert or promote a row to the front of Recents (e.g. after unpin from fixed nav).
   * Respects `maxItems`, dedupes by `to`, and persists when `storageKey` is set.
   */
  prependRecentItem: (item: SidebarItemProps) => void
}

/**
 * Tracks most-recently visited nav targets from the router path.
 * Persistence and cap are controlled by the consumer (`storageKey`, `maxItems`).
 */
export function useRecentNavItems(options: UseRecentNavItemsOptions): UseRecentNavItemsResult {
  const { maxItems, getItemForPath, storageKey, excludeFromRecents = [] } = options
  const location = useLocation()
  const getItemRef = useRef(getItemForPath)
  getItemRef.current = getItemForPath

  const [recentItems, setRecentItems] = useState<SidebarItemProps[]>(() =>
    readStored(storageKey, maxItems)
  )

  const persist = useCallback(
    (items: SidebarItemProps[]) => {
      if (!storageKey) return
      try {
        const serializable = items
          .map(toStorageEntry)
          .filter((x): x is RecentNavStorageEntry => x != null)
        localStorage.setItem(storageKey, JSON.stringify(serializable))
      } catch {
        /* ignore quota / private mode */
      }
    },
    [storageKey]
  )

  useEffect(() => {
    const excluded = new Set(excludeFromRecents)
    if (excluded.size === 0) return
    setRecentItems(prev => {
      const next = prev.filter(p => !('to' in p) || !excluded.has(p.to))
      if (next.length === prev.length) return prev
      persist(next)
      return next
    })
  }, [excludeFromRecents, persist])

  useEffect(() => {
    const item = getItemRef.current(location.pathname)
    const entry = item && toStorageEntry(item)
    if (!entry) return
    if (excludeFromRecents.includes(entry.to)) return

    setRecentItems(prev => {
      const without = prev.filter(p => !('to' in p) || p.to !== entry.to)
      const next = [fromStorageEntry(entry), ...without].slice(0, maxItems)
      persist(next)
      return next
    })
  }, [location.pathname, maxItems, persist, excludeFromRecents])

  const clearRecents = useCallback(() => {
    setRecentItems([])
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey)
      } catch {
        /* ignore */
      }
    }
  }, [storageKey])

  const removeRecentByTo = useCallback(
    (to: string) => {
      setRecentItems(prev => {
        const next = prev.filter(p => !('to' in p) || p.to !== to)
        persist(next)
        return next
      })
    },
    [persist]
  )

  const prependRecentItem = useCallback(
    (item: SidebarItemProps) => {
      const entry = toStorageEntry(item)
      if (!entry) return
      setRecentItems(prev => {
        const without = prev.filter(p => !('to' in p) || p.to !== entry.to)
        const next = [fromStorageEntry(entry), ...without].slice(0, maxItems)
        persist(next)
        return next
      })
    },
    [maxItems, persist]
  )

  return { recentItems, clearRecents, removeRecentByTo, prependRecentItem }
}
