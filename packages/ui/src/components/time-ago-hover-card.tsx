import { FC, Fragment, useMemo } from 'react'

import { StatusBadge, Tooltip } from '@/components'

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

const getTimeZoneAbbreviation = () =>
  new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ').pop()

export const TimeAgoHoverCard: FC<TimeAgoHoverCardProps> = ({ formattedDate, timeStamp }) => {
  const content = useMemo(() => {
    const formattedDates = {
      utcDate: utcFormatter.format(timeStamp),
      utcTime: utcTimeFormatter.format(timeStamp),
      localDate: localFormatter.format(timeStamp),
      localTime: localTimeFormatter.format(timeStamp)
    }

    return (
      <div className="grid min-w-80 grid-cols-[auto_1fr_auto] gap-x-3 gap-y-2 whitespace-nowrap py-2 text-sm">
        {(['UTC', 'Local'] as const).map(zone => {
          const date = zone === 'UTC' ? formattedDates.utcDate : formattedDates.localDate
          const time = zone === 'UTC' ? formattedDates.utcTime : formattedDates.localTime

          return (
            <Fragment key={zone}>
              <StatusBadge variant="secondary" size="sm">
                {zone === 'UTC' ? 'UTC' : getTimeZoneAbbreviation()}
              </StatusBadge>
              <time dateTime={date}>{date}</time>
              <time dateTime={time} className="ml-auto text-cn-foreground-3">
                {time}
              </time>
            </Fragment>
          )
        })}
      </div>
    )
  }, [timeStamp])

  return (
    <Tooltip content={content}>
      <time className="mx-1 h-auto p-0 text-cn-foreground-2 data-[state=delayed-open]:text-cn-foreground-1">
        {formattedDate}
      </time>
    </Tooltip>
  )
}
