import { FC, useMemo } from 'react'

import { Badge, Button, HoverCard, HoverCardContent, HoverCardTrigger } from '@/components'

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
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="px-0 hover:bg-transparent">
          {formattedDate}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-3 space-y-2 text-sm" avoidCollisions>
        {(['UTC', 'Local'] as const).map(zone => (
          <div key={zone} className="flex items-center gap-2">
            <Badge variant="tertiary" size="sm" borderRadius="base">
              {/* {zone === 'UTC' ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone} */}
              {zone === 'UTC' ? 'UTC' : getTimeZoneAbbreviation()}
            </Badge>
            <span>{zone === 'UTC' ? formattedDates.utcDate : formattedDates.localDate}</span>
            <span className="text-foreground-5 ml-auto">
              {zone === 'UTC' ? formattedDates.utcTime : formattedDates.localTime}
            </span>
          </div>
        ))}
      </HoverCardContent>
    </HoverCard>
  )
}
