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
      <HoverCard.Content className="w-80 space-y-2 p-3 text-sm" avoidCollisions>
        {(['UTC', 'Local'] as const).map(zone => (
          <div key={zone} className="flex items-center gap-2">
            <Badge variant="tertiary" size="sm" borderRadius="base" className="w-13 flex justify-center">
              {zone === 'UTC' ? 'UTC' : getTimeZoneAbbreviation()}
            </Badge>
            <span>{zone === 'UTC' ? formattedDates.utcDate : formattedDates.localDate}</span>
            <span className="ml-auto text-foreground-5">
              {zone === 'UTC' ? formattedDates.utcTime : formattedDates.localTime}
            </span>
          </div>
        ))}
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
