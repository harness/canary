import { useEffect } from 'react'

// Note: This is a Chrome-only API
interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

interface ExtendedPerformance extends Performance {
  memory?: MemoryInfo
}

declare global {
  interface Window {
    performance: ExtendedPerformance
  }
}

const BYTES_TO_MB = 1024 * 1024

/**
 * Checks if the browser supports performance.memory API
 */
const hasMemoryAPI = (): boolean => {
  try {
    return !!(window.performance && window.performance.memory)
  } catch {
    return false
  }
}

/**
 * Gets the current memory usage in MB if available
 */
const getMemoryUsage = (): number | null => {
  try {
    if (!hasMemoryAPI()) return null

    const memoryInfo = window.performance.memory
    if (!memoryInfo) return null

    return Math.round(memoryInfo.usedJSHeapSize / BYTES_TO_MB)
  } catch {
    return null
  }
}

/**
 * Hook to monitor memory usage and run cleanup when threshold is exceeded
 * Note: Memory monitoring only works in Chromium-based browsers
 * @param cleanupFn Function to run when memory threshold is exceeded
 * @param threshold Memory threshold in MB
 * @param interval Check interval in ms
 */
export const useMemoryCleanup = (cleanupFn: () => void, threshold = 1200, interval = 30000) => {
  useEffect(() => {
    if (!hasMemoryAPI()) {
      console.debug('Memory API not available - memory cleanup disabled')
      return
    }

    const checkMemory = () => {
      const usedMemory = getMemoryUsage()

      if (usedMemory !== null && usedMemory > threshold) {
        console.debug(`Memory usage (${usedMemory}MB) exceeded threshold (${threshold}MB). Running cleanup...`)
        cleanupFn()
      }
    }

    const intervalId = setInterval(checkMemory, interval)
    return () => clearInterval(intervalId)
  }, [cleanupFn, threshold, interval])
}
