import { FC, useMemo } from 'react'

import { Badge, Tooltip } from '@/components'

const utcFormatter = new Intl.DateTimeFormat(undefined, {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
})

const utcTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'UTC'
})

const localFormatter = new Intl.DateTimeFormat(undefined, {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})

const localTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})

interface TimeAgoHoverCardProps {
  formattedDate: string
  timeStamp: number
}

export const TimeAgoHoverCard: FC<TimeAgoHoverCardProps> = ({ formattedDate, timeStamp }) => {
  const getTimeZoneAbbreviation = () =>
    new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ').pop()

  const formattedDates = useMemo(
    () => ({
      utcDate: utcFormatter.format(timeStamp),
      utcTime: utcTimeFormatter.format(timeStamp),
      localDate: localFormatter.format(timeStamp),
      localTime: localTimeFormatter.format(timeStamp)
    }),
    [timeStamp]
  )

  return (
    <Tooltip.Root>
      <Tooltip.Trigger className="text-cn-foreground-2 data-[state=delayed-open]:text-cn-foreground-1">
        <time className="mx-1 h-auto p-0">{formattedDate}</time>
      </Tooltip.Trigger>
      <Tooltip.Content
        className="grid min-w-80 grid-cols-[auto_1fr_auto] gap-x-3 gap-y-2 whitespace-nowrap p-2.5 text-sm"
        avoidCollisions
        side="top"
      >
        {(['UTC', 'Local'] as const).map(zone => {
          const date = zone === 'UTC' ? formattedDates.utcDate : formattedDates.localDate
          const time = zone === 'UTC' ? formattedDates.utcTime : formattedDates.localTime

          return (
            <>
              <Badge variant="soft" size="sm">
                {zone === 'UTC' ? 'UTC' : getTimeZoneAbbreviation()}
              </Badge>
              <time dateTime={date}>{date}</time>
              <time dateTime={time} className="text-cn-foreground-3 ml-auto">
                {time}
              </time>
            </>
          )
        })}
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
