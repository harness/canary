import { FC, useCallback, useEffect, useRef } from 'react'

import { cn } from '@utils/cn'

import { formatTimestamp } from '../../utils/TimeUtils'
import { ConsoleLogsProps, LivelogLine, LivelogLineType } from './types'

export const createStreamedLogLineElement = (log: LivelogLine) => {
  const lineElement = document.createElement('div')
  lineElement.className = ''

  if (typeof log.pos === 'number') {
    const lineNumberElement = document.createElement('span')
    lineNumberElement.className = ''
    lineNumberElement.textContent = (log.pos + 1).toString()
    lineElement.appendChild(lineNumberElement)
  }

  const logTextElement = document.createElement('span')
  logTextElement.className = ''
  logTextElement.textContent = log.out as string
  lineElement.appendChild(logTextElement)

  const flexExpanderElement = document.createElement('span')
  flexExpanderElement.className = ''
  lineElement.appendChild(flexExpanderElement)

  const timeElement = document.createElement('span')
  timeElement.className = ''
  timeElement.textContent = `${log.time}s`
  lineElement.appendChild(timeElement)

  return lineElement
}

const ConsoleLogs: FC<ConsoleLogsProps> = ({ logs, query }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

  const logText = useCallback(
    (log: string) => {
      if (!query?.length) {
        return <span className="ml-2 flex gap-1 font-mono text-sm font-normal">{log}</span>
      }

      const match = log.match(new RegExp(query, 'i'))
      if (!match) return <span className="ml-2 flex gap-1 font-mono text-sm font-normal">{log}</span>

      const matchIndex = match.index ?? 0
      return (
        <span className="flex gap-1 font-mono text-sm font-normal">
          {log.slice(0, matchIndex)}
          <mark>{log.slice(matchIndex, matchIndex + query.length)}</mark>
          {log.slice(matchIndex + query.length)}
        </span>
      )
    },
    [query]
  )

  if (!logs || !logs.length) return null

  return (
    <div ref={containerRef} className="overflow-y-auto pl-5">
      {logs.filter(Boolean).map(({ pos, out, time, type = LivelogLineType.INFO }, index) => (
        <div className="w-full" key={index}>
          <div className="flex w-full items-baseline gap-5 font-mono text-15">
            {pos !== undefined && pos >= 0 ? (
              <span className="text-log flex min-w-5 justify-end text-foreground-7">{pos}</span>
            ) : null}
            <span
              className={cn(
                'text-log flex shrink-0 grow font-normal',
                type === LivelogLineType.ERROR && 'text-foreground-danger bg-tag-background-red-2',
                type === LivelogLineType.WARNING && 'text-foreground-alert bg-tag-background-amber-2'
              )}
            >
              {time ? `[${formatTimestamp(time * 1_000)}]` : null}
              {out ? logText(out) : null}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConsoleLogs
