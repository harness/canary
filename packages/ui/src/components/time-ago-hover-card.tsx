import { FC, useMemo } from 'react'

import { Badge, Button, HoverCard } from '@/components'

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
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Button className="h-auto px-0 font-normal hover:bg-transparent" variant="ghost">
          {formattedDate}
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content
        className="grid w-80 grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-2 p-2.5 text-sm"
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
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
