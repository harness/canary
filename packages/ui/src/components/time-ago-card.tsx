import { FC, Fragment, useMemo, useState } from 'react'

import { Popover, StatusBadge, Text } from '@/components'
import { LOCALE } from '@utils/TimeUtils'
import { formatDistanceToNow } from 'date-fns'

const getTimeZoneAbbreviation = () =>
  new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ').pop()

const getFormatters = (locale?: string | string[]) => ({
  utcDate: new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }),
  utcTime: new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC'
  }),
  localDate: new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }),
  localTime: new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

export const useFormattedTime = (
  timestamp?: string | number | null,
  cutoffDays: number = 8,
  dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }
) => {
  const time = useMemo(() => new Date(timestamp ?? 0), [timestamp])
  const now = useMemo(() => new Date(), [])
  const diff = now.getTime() - time.getTime()
  const isBeyondCutoff = diff > cutoffDays * 24 * 60 * 60 * 1000

  const formattedShort = useMemo(() => {
    if (timestamp === null || timestamp === undefined) return 'Unknown time'

    return isBeyondCutoff
      ? new Intl.DateTimeFormat(LOCALE, dateTimeFormatOptions).format(time)
      : formatDistanceToNow(time, { addSuffix: true, includeSeconds: true })
  }, [timestamp, isBeyondCutoff, dateTimeFormatOptions, time])

  const formatters = getFormatters(LOCALE)

  const formattedFull = {
    utcDate: formatters.utcDate.format(time),
    utcTime: formatters.utcTime.format(time),
    localDate: formatters.localDate.format(time),
    localTime: formatters.localTime.format(time)
  }

  return {
    formattedShort,
    formattedFull,
    time
  }
}

export const TimeAgoContent: FC<{
  utcDate: string
  utcTime: string
  localDate: string
  localTime: string
}> = ({ utcDate, utcTime, localDate, localTime }) => {
  return (
    <div className="cn-time-ago-card-content">
      {(['UTC', 'Local'] as const).map(zone => {
        const date = zone === 'UTC' ? utcDate : localDate
        const time = zone === 'UTC' ? utcTime : localTime

        return (
          <Fragment key={zone}>
            <StatusBadge variant="secondary" size="sm">
              {zone === 'UTC' ? 'UTC' : getTimeZoneAbbreviation()}
            </StatusBadge>
            <Text<'time'> variant="body-single-line-normal" as="time" dateTime={date}>
              {date}
            </Text>
            <Text<'time'>
              variant="body-single-line-normal"
              as="time"
              dateTime={time}
              color="foreground-3"
              className="ml-auto"
            >
              {time}
            </Text>
          </Fragment>
        )
      })}
    </div>
  )
}

interface TimeAgoCardProps {
  timestamp?: string | number | null
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions
  cutoffDays?: number
}

export const TimeAgoCard: FC<TimeAgoCardProps> = ({ timestamp, cutoffDays = 8, dateTimeFormatOptions }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { formattedShort, formattedFull } = useFormattedTime(timestamp, cutoffDays, dateTimeFormatOptions)

  if (timestamp === null || timestamp === undefined) {
    return <>Unknown time</>
  }

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    setIsOpen(prev => !prev)
  }

  const handleClickContent = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger className="cn-time-ago-card-trigger" onClick={handleClick}>
        <time>{formattedShort}</time>
      </Popover.Trigger>
      <Popover.Content onClick={handleClickContent} side="top">
        <TimeAgoContent
          utcDate={formattedFull.utcDate}
          utcTime={formattedFull.utcTime}
          localDate={formattedFull.localDate}
          localTime={formattedFull.localTime}
        />
      </Popover.Content>
    </Popover.Root>
  )
}
