import { FC, Fragment, useMemo, useState } from 'react'

import { Popover, StatusBadge, Text } from '@/components'

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

interface TimeAgoCardProps {
  formattedDate: string
  timeStamp: number
}

const getTimeZoneAbbreviation = () =>
  new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ').pop()

export const TimeAgoCard: FC<TimeAgoCardProps> = ({ formattedDate, timeStamp }) => {
  const [isOpen, setIsOpen] = useState(false)

  const content = useMemo(() => {
    const formattedDates = {
      utcDate: utcFormatter.format(timeStamp),
      utcTime: utcTimeFormatter.format(timeStamp),
      localDate: localFormatter.format(timeStamp),
      localTime: localTimeFormatter.format(timeStamp)
    }

    return (
      <div className="cn-time-ago-card-content">
        {(['UTC', 'Local'] as const).map(zone => {
          const date = zone === 'UTC' ? formattedDates.utcDate : formattedDates.localDate
          const time = zone === 'UTC' ? formattedDates.utcTime : formattedDates.localTime

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
  }, [timeStamp])

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
        <time>{formattedDate}</time>
      </Popover.Trigger>
      <Popover.Content onClick={handleClickContent} side="top">
        {content}
      </Popover.Content>
    </Popover.Root>
  )
}
