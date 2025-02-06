import { useEffect, useRef, useState } from 'react'

import { LivelogLine } from '@harnessio/ui/views'

interface UseLogsProps {
  logs: LivelogLine[]
  delay?: number
  isStreaming?: boolean
  defaultLogLines?: number
}

/**
 *
 * @param logs - Array of log lines to display
 * @param delay - Delay in milliseconds between each log line
 * @param isStreaming - Flag to enable/disable streaming of logs
 * @param defaultLogLines - Number of log lines to display initially
 * @returns logs - Array of log lines to display
 * @returns timerId - ID of the interval timer to manually stop the auto-scrolling
 */
export const useLogs = ({
  logs,
  delay = 2000,
  isStreaming = false,
  defaultLogLines = 20
}: UseLogsProps): { logs: LivelogLine[]; timerId: number | null } => {
  const [logLines, setLogLines] = useState<LivelogLine[]>([])
  const [intervalId, setIntervalId] = useState<number | null>(null)

  // Ref to track the currentIndex without causing re-renders
  const currentIndexRef = useRef(0)

  useEffect(() => {
    // Handle case when streaming is off, return all logs
    if (!isStreaming) {
      setLogLines(logs) // Set all logs when streaming is false
      currentIndexRef.current = logs.length // Make sure currentIndex points to the end
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      return
    }

    setLogLines(logs.slice(0, defaultLogLines))
    currentIndexRef.current = defaultLogLines

    // Start a new interval to stream logs
    const interval = setInterval(() => {
      if (currentIndexRef.current >= logs.length) {
        clearInterval(interval)
        setIntervalId(null)
        return
      }

      setLogLines(prev => [...prev, logs[currentIndexRef.current]])

      currentIndexRef.current += 1
    }, delay)

    setIntervalId(interval)

    // Cleanup on effect cleanup or when isStreaming changes
    return () => {
      clearInterval(interval)
    }
  }, [isStreaming, logs, delay])

  return { logs: logLines, timerId: intervalId }
}
