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
        return <span className="font-body-code ml-cn-xs flex gap-1 text-sm font-normal">{log}</span>
      }

      const match = log.match(new RegExp(query, 'i'))
      if (!match) return <span className="font-body-code ml-cn-xs flex gap-1 text-sm font-normal">{log}</span>

      const matchIndex = match.index ?? 0
      return (
        <span className="font-body-code flex gap-1 text-sm font-normal">
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
    // TODO: bg-logs-background- classnames are no longer supported and need to be replaced
    <div ref={containerRef} className="bg-logs-background-1 pt-cn-md overflow-y-auto">
      {logs.filter(Boolean).map(({ out, time, type }, index) => {
        const dateTime = time ? formatTimestamp(time * 1_000) : ''

        return (
          <div
            key={index}
            className={cn('text-2 flex w-full items-center pl-cn-lg  font-body-code leading-normal', {
              'bg-logs-background-6': type === LivelogLineType.WARNING,
              'bg-logs-background-7': type === LivelogLineType.ERROR,
              'pt-cn-2xs': index !== 0
            })}
          >
            <div
              className={cn('w-1 h-[21px] mr-cn-2xs bg-logs-background-2', {
                'bg-logs-background-3': type === LivelogLineType.INFO,
                'bg-logs-background-4': type === LivelogLineType.WARNING,
                'bg-logs-background-5': type === LivelogLineType.ERROR
              })}
            />

            <span className="flex shrink-0 grow font-normal">
              <time dateTime={dateTime}>{`[${dateTime}]`}</time>
              {out ? logText(out) : null}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default ConsoleLogs
