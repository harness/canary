import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useTabVisible } from './use-tab-visible'

const DEFAULT_POLLING_INTERVAL_IN_MS = 30_000
const INACTIVE_TAB_POLLING_INTERVAL_IN_MS = 60_000

export interface UsePollingOptions {
  /**
   * Polling interval in milliseconds when tab is active
   * @default 30000 (30 seconds)
   */
  pollingInterval?: number
  /**
   * Start polling based on a condition
   * @example Poll only on first page
   * @default false
   */
  startPolling?: boolean
  /**
   * Polling interval in milliseconds when tab is inactive
   * @default 60000 (60 seconds)
   */
  inactiveTabPollingInterval?: number
  /**
   * Enable polling even on inactive tabs with inactiveTabPollingInterval
   * Use with caution - needs a stop condition from userland
   * @default false
   */
  pollOnInactiveTab?: boolean
}

/**
 * Hook for polling with smart tab visibility handling.
 * Automatically adjusts polling interval based on tab visibility and ensures
 * only one request is in flight at a time.
 *
 * @param callback - Promise-returning function to be called at each polling interval (e.g., refetch)
 * @param options - Polling configuration options
 * @returns boolean - true if currently polling, false otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { refetch } = useQuery(...)
 *
 *   const isPolling = usePolling(refetch, {
 *     startPolling: true,
 *     pollingInterval: 10000, // 10 seconds
 *     pollOnInactiveTab: false
 *   })
 *
 *   return <div>{isPolling ? 'Polling...' : 'Idle'}</div>
 * }
 * ```
 *
 * @remarks
 * - Remembers last call and re-polls only after it's resolved
 * - Automatically pauses polling when tab is inactive (unless pollOnInactiveTab is true)
 * - Uses longer interval for inactive tabs to reduce resource usage
 */
export function usePolling(
  callback: () => Promise<void> | undefined,
  {
    startPolling = false,
    pollingInterval = DEFAULT_POLLING_INTERVAL_IN_MS,
    inactiveTabPollingInterval = INACTIVE_TAB_POLLING_INTERVAL_IN_MS,
    pollOnInactiveTab = false
  }: UsePollingOptions
): boolean {
  const savedCallback = useRef(callback)
  const [isPolling, setIsPolling] = useState(false)
  const tabVisible = useTabVisible()
  const interval = tabVisible ? pollingInterval : inactiveTabPollingInterval

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    // Poll only if polling condition from component is met
    if (!startPolling) return
    // Poll only if tab is visible OR pollOnInactiveTab is true
    if (!tabVisible && !pollOnInactiveTab) return

    // Poll only when the current request is resolved
    if (!isPolling) {
      const timerId = setTimeout(async () => {
        setIsPolling(true)
        try {
          await savedCallback.current?.()
        } finally {
          setIsPolling(false)
        }
      }, interval)

      return () => clearTimeout(timerId)
    }
  }, [interval, isPolling, pollOnInactiveTab, startPolling, tabVisible])

  return isPolling
}
