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
 * @param delay - Delay in seconds between each log line
 * @param isStreaming - Flag to enable/disable streaming of logs
 * @param defaultLogLines - Number of log lines to display initially
 * @returns logs - Array of log lines to display
 * @returns timerId - ID of the interval timer to manually stop the auto-scrolling
 */
export const useLogs = ({
  logs = [],
  delay = 1,
  isStreaming = false,
  defaultLogLines = 1
}: UseLogsProps): { logs: LivelogLine[]; timerId: number | null } => {
  const [logLines, setLogLines] = useState<LivelogLine[]>([])
  const [intervalId, setIntervalId] = useState<number | null>(null)

  // Ref to track the currentIndex without causing re-renders
  const currentIndexRef = useRef(0)

  useEffect(() => {
    if (logs.length === 0) {
      if (logLines.length !== 0) {
        setLogLines([]) // Only update if not already empty
      }
      currentIndexRef.current = 0
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      return
    }

    if (!isStreaming) {
      if (logLines.length !== logs.length) {
        setLogLines(logs) // Only update if logs actually changed
      }
      currentIndexRef.current = logs.length
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      return
    }

    setLogLines(logs.slice(0, defaultLogLines))
    currentIndexRef.current = defaultLogLines

    const interval = setInterval(() => {
      if (currentIndexRef.current >= logs.length) {
        clearInterval(interval)
        setIntervalId(null)
        return
      }

      setLogLines(prev => [...prev, logs[currentIndexRef.current]])
      currentIndexRef.current += 1
    }, delay * 1000)

    setIntervalId(interval)

    return () => clearInterval(interval)
  }, [isStreaming, logs, delay])

  return { logs: logLines, timerId: intervalId }
}
