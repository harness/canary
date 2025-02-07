import { FC, useCallback } from 'react'

import { Text } from '@/components'
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
  const logText = useCallback(
    (log: string) => {
      const match = log.match(new RegExp(query || ''))
      if (!match || !query?.length) {
        return <span className="ml-2 flex gap-1 font-mono text-sm font-normal">{log}</span>
      }
      const matchIndex = match?.index || 0
      const startText = log.slice(0, matchIndex)
      const matchedText = log.slice(matchIndex, matchIndex + query?.length)
      const endText = log.slice(matchIndex + query?.length)
      return (
        <span className="flex gap-1 font-mono text-sm font-normal">
          {startText ? <span>{startText}</span> : null}
          {matchedText ? <mark>{matchedText}</mark> : null}
          {endText ? <span>{endText}</span> : null}
        </span>
      )
    },
    [query]
  )

  return (
    <>
      {logs
        .filter(item => item !== null)
        .map(({ pos, out, time, type = LivelogLineType.INFO }, index) => (
          <div className="w-full" key={index}>
            <div className="text-15 flex w-full items-baseline gap-5 font-mono">
              {pos !== undefined && !isNaN(pos) && pos >= 0 && (
                <span className="text-log text-foreground-7 flex min-w-5 justify-end">{pos}</span>
              )}
              <span
                className={cn(
                  'text-log flex shrink-0 grow font-normal',
                  type === LivelogLineType.ERROR && 'text-foreground-danger bg-tag-background-red-2',
                  type === LivelogLineType.WARNING && 'text-foreground-alert bg-tag-background-amber-2'
                )}
              >
                {time && `[${formatTimestamp(time * 1_000)}]`} {out && logText(out)}
              </span>
            </div>
          </div>
        ))}
    </>
  )
}

export default ConsoleLogs
