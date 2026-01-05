import { useCallback, useEffect, useRef } from 'react'

export interface UseInfiniteScrollOptions {
  /** Callback when sentinel becomes visible */
  onLoadMore: () => void | Promise<void>
  /** Whether more items are available */
  hasMore: boolean
  /** Prevents duplicate calls while loading */
  isLoading?: boolean
  /** Enable/disable the hook */
  enabled?: boolean
  /** Root margin for early triggering (default: "100px") */
  rootMargin?: string
  /** Intersection threshold 0-1 (default: 0.1) */
  threshold?: number
}

export interface UseInfiniteScrollReturn {
  /** Ref to attach to sentinel element at end of list */
  sentinelRef: React.RefObject<HTMLDivElement>
}

/**
 * Hook for infinite scroll functionality using IntersectionObserver.
 * Triggers a callback when the sentinel element becomes visible in the viewport.
 *
 * @param options - Configuration options for infinite scroll behavior
 * @returns Object containing the sentinel ref to attach to a trigger element
 *
 * @example
 * ```tsx
 * function MyList() {
 *   const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(...)
 *
 *   const { sentinelRef } = useInfiniteScroll({
 *     onLoadMore: fetchNextPage,
 *     hasMore: hasNextPage ?? false,
 *     isLoading: isFetching,
 *     rootMargin: '200px'
 *   })
 *
 *   return (
 *     <ScrollArea>
 *       {data.pages.flat().map(item => <ListItem key={item.id} {...item} />)}
 *       <div ref={sentinelRef} />
 *     </ScrollArea>
 *   )
 * }
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading = false,
  enabled = true,
  rootMargin = '100px',
  threshold = 0.1
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef(onLoadMore)

  // Keep callback ref updated to avoid stale closures
  useEffect(() => {
    loadMoreRef.current = onLoadMore
  }, [onLoadMore])

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry?.isIntersecting && hasMore && !isLoading) {
        loadMoreRef.current()
      }
    },
    [hasMore, isLoading]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || !enabled || !hasMore) {
      return
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold
    })

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [enabled, hasMore, handleIntersection, rootMargin, threshold])

  return { sentinelRef }
}
