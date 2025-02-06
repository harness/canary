import { useEffect, useState } from 'react'

import { LivelogLine } from '@harnessio/ui/views'

interface UseLogsProps {
  logs: LivelogLine[]
  delay?: number
}

/**
 *
 * @param logs - Array of log lines to display
 * @param delay - Delay in milliseconds between each log line
 * @returns - Array of log lines to display
 */
export const useLogs = ({ logs, delay = 2000 }: UseLogsProps): LivelogLine[] => {
  const [logLines, setLogLines] = useState<LivelogLine[]>(logs.slice(0, 20))
  const [currentIndex, setCurrentIndex] = useState(20)
  const [_intervalId, setIntervalId] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setLogLines(prev => {
        if (currentIndex >= logs.length) {
          clearInterval(interval)
          return prev
        }
        return [...prev, logs[currentIndex]]
      })

      setCurrentIndex(prev => prev + 1)
    }, delay) // Append one log every "delay" seconds

    setIntervalId(interval)
    return () => clearInterval(interval)
  }, [currentIndex])

  return logLines
}
