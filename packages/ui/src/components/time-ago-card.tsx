import { FC, forwardRef, Fragment, memo, MouseEvent, Ref, useState } from 'react'

import { Popover, StatusBadge, Text, TextProps } from '@/components'
import { LOCALE } from '@utils/TimeUtils'
import { formatDistanceToNow } from 'date-fns'

const getTimeZoneAbbreviation = () => {
  try {
    return new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ').pop() || 'Local'
  } catch {
    return 'Local'
  }
}

type FullTimeFormatters = {
  date: string
  time: string
  label?: string
}

const safeFormat = (formatter: Intl.DateTimeFormat, time: Date, fallback = 'Invalid') => {
  try {
    return formatter.format(time)
  } catch {
    return fallback
  }
}

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
  const time = new Date(timestamp ?? 0)
  const isValidTime = !isNaN(time.getTime())
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const isBeyondCutoff = isValidTime && diff > cutoffDays * 24 * 60 * 60 * 1000

  const formattedShort = () => {
    if (!isValidTime) return 'Unknown time'

    return isBeyondCutoff
      ? new Intl.DateTimeFormat(LOCALE, dateTimeFormatOptions).format(time)
      : formatDistanceToNow(time, { addSuffix: true, includeSeconds: true })
  }

  const formatters = getFormatters(LOCALE)

  const formattedFull: FullTimeFormatters[] = isValidTime
    ? [
        {
          date: safeFormat(formatters.utcDate, time),
          time: safeFormat(formatters.utcTime, time),
          label: 'UTC'
        },
        {
          date: safeFormat(formatters.localDate, time),
          time: safeFormat(formatters.localTime, time),
          label: getTimeZoneAbbreviation()
        }
      ]
    : []

  return {
    formattedShort: formattedShort()
      .replace(/^about\s+/i, '')
      .replace(/less than\s+/i, ''),
    formattedFull,
    time,
    isBeyondCutoff
  }
}

export const TimeAgoContent: FC<{ formattedFullArray: FullTimeFormatters[] }> = ({ formattedFullArray }) => {
  return (
    <div className="cn-time-ago-card-content">
      {formattedFullArray.map(({ date, time, label }) => (
        <Fragment key={label}>
          <StatusBadge variant="secondary" size="sm">
            {label}
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
      ))}
    </div>
  )
}

interface TimeAgoCardProps {
  timestamp?: string | number | null
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions
  cutoffDays?: number
  beforeCutoffPrefix?: string
  afterCutoffPrefix?: string
  textProps?: TextProps<'time' | 'span'> & {
    ref?: Ref<HTMLSpanElement | HTMLTimeElement>
  }
}

export const TimeAgoCard = memo(
  forwardRef<HTMLButtonElement, TimeAgoCardProps>(
    ({ timestamp, cutoffDays = 8, dateTimeFormatOptions, beforeCutoffPrefix, afterCutoffPrefix, textProps }, ref) => {
      const [isOpen, setIsOpen] = useState(false)
      const { formattedShort, formattedFull, isBeyondCutoff } = useFormattedTime(
        timestamp,
        cutoffDays,
        dateTimeFormatOptions
      )

      if (timestamp === null || timestamp === undefined) {
        return (
          <Text as="span" {...textProps}>
            Unknown time
          </Text>
        )
      }

      const handleClick = (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setIsOpen(prev => !prev)
      }

      const handleClickContent = (event: MouseEvent) => {
        event.stopPropagation()
      }
      const hasPrefix = beforeCutoffPrefix || afterCutoffPrefix
      const prefix = hasPrefix ? (isBeyondCutoff ? afterCutoffPrefix : beforeCutoffPrefix) : undefined

      return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger className="cn-time-ago-card-trigger" onClick={handleClick} ref={ref}>
            <Text<'time'> as="time" {...textProps} ref={textProps?.ref as Ref<HTMLTimeElement>}>
              {prefix ? `${prefix} ${formattedShort}` : formattedShort}
            </Text>
          </Popover.Trigger>
          <Popover.Content onClick={handleClickContent} side="top">
            <TimeAgoContent formattedFullArray={formattedFull} />
          </Popover.Content>
        </Popover.Root>
      )
    }
  )
)

TimeAgoCard.displayName = 'TimeAgoCard'
