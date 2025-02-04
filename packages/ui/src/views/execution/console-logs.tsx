import { FC, useCallback } from 'react'

import { Text } from '@/components'

import { formatDuration, formatTimestamp } from '../../utils/TimeUtils'
import { ConsoleLogsProps, LivelogLine } from './types'

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
        return <Text className="ml-2 flex gap-1 font-mono text-sm font-normal text-ring">{log}</Text>
      }
      const matchIndex = match?.index || 0
      const startText = log.slice(0, matchIndex)
      const matchedText = log.slice(matchIndex, matchIndex + query?.length)
      const endText = log.slice(matchIndex + query?.length)
      return (
        <Text className="flex gap-1 font-mono text-sm font-normal text-ring">
          {startText ? <span>{startText}</span> : null}
          {matchedText ? <mark>{matchedText}</mark> : null}
          {endText ? <span>{endText}</span> : null}
        </Text>
      )
    },
    [query]
  )

  return (
    <>
      {logs
        .filter(item => item !== null)
        .map(({ pos, out, time, duration }, index) => (
          <div className="mb-2 flex items-baseline justify-between leading-[21px]" key={index}>
            <div className="flex items-baseline gap-2">
              {pos !== undefined && !isNaN(pos) && pos >= 0 && (
                <Text className="text-log flex min-w-5 justify-end">{pos}</Text>
              )}
              {time ? (
                <Text className="text-log flex text-sm font-normal">[{formatTimestamp(time * 1_000)}]</Text>
              ) : null}
              {out ? logText(out) : null}
            </div>
            <Text className="text-log mr-2 text-sm font-normal">
              {formatDuration(duration && duration > 0 ? duration * 1_000 : 0)}
            </Text>
          </div>
        ))}
    </>
  )
}

export default ConsoleLogs
