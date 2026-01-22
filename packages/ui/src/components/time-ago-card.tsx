import { ButtonHTMLAttributes, FC, forwardRef, Fragment, memo, Ref, useEffect, useState } from 'react'

import { StatusBadge, Text, TextProps, Tooltip, TooltipProps } from '@/components'
import { cn } from '@utils/cn'
import { formatRelativeTime, LOCALE } from '@utils/TimeUtils'

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

/**
 * This will be used as a placeholder for invalid/unknown timestamps
 */
const INVALID_TIME_INDICATOR = ''

export const useFormattedTime = (timestamp?: string | number | null, live = false) => {
  // Handle null, undefined, empty string, or invalid values
  const time = timestamp ? new Date(timestamp) : new Date(0)
  const isValidTime = !isNaN(time.getTime()) && isFinite(time.getTime())

  // State to trigger re-renders when live is true
  const [, setTick] = useState(0)

  // Set up interval for live updates
  useEffect(() => {
    if (!live || !isValidTime || time.getTime() === 0) {
      return
    }

    const intervalId = setInterval(() => {
      setTick(prev => prev + 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [live, isValidTime, time])

  const formattedShort = () => {
    // Additional check for epoch time (0) which might indicate missing data
    if (!isValidTime || time.getTime() === 0) {
      console.warn('Invalid timestamp:', timestamp)
      return INVALID_TIME_INDICATOR
    }

    return formatRelativeTime(timestamp, LOCALE)
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
    formattedShort: formattedShort(),
    formattedFull,
    time
  }
}

export const TimeAgoContent: FC<{ formattedFullArray: FullTimeFormatters[] }> = ({ formattedFullArray }) => {
  // Handle empty array case
  if (formattedFullArray.length === 0) {
    return (
      <div className="cn-time-ago-card-content">
        <Text variant="body-single-line-normal">Unknown time</Text>
      </div>
    )
  }

  return (
    <div className="cn-time-ago-card-content">
      {formattedFullArray.map(({ date, time, label }) => (
        <Fragment key={label}>
          <StatusBadge variant="secondary" size="sm">
            {label}
          </StatusBadge>
          <Text<'time'> color="inherit" variant="body-single-line-normal" as="time" dateTime={date}>
            {date}
          </Text>
          <Text<'time'> variant="body-single-line-normal" as="time" dateTime={time} color="inherit" className="ml-auto">
            {time}
          </Text>
        </Fragment>
      ))}
    </div>
  )
}

interface TimeAgoCardProps {
  timestamp?: string | number | null
  prefix?: string
  live?: boolean
  textProps?: Omit<TextProps<'time' | 'span'>, 'ref'>
  tooltipProps?: TooltipProps
  triggerProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
  triggerClassName?: string
}

export const TimeAgoCard = memo(
  forwardRef<HTMLButtonElement | HTMLSpanElement, TimeAgoCardProps>(
    ({ timestamp, prefix, live = false, textProps, tooltipProps, triggerProps, triggerClassName }, ref) => {
      const { formattedShort, formattedFull } = useFormattedTime(timestamp, live)

      // Handle invalid timestamps
      if (timestamp === null || timestamp === undefined || formattedShort === INVALID_TIME_INDICATOR) {
        return (
          <Text as="span" {...textProps} ref={ref as Ref<HTMLSpanElement>}>
            {INVALID_TIME_INDICATOR}
          </Text>
        )
      }

      return (
        <Tooltip content={<TimeAgoContent formattedFullArray={formattedFull} />} {...tooltipProps}>
          <button
            ref={ref as Ref<HTMLButtonElement>}
            className={cn('cn-time-ago-card-trigger', triggerClassName)}
            {...triggerProps}
          >
            <Text<'time'> as="time" {...textProps} dateTime={timestamp.toString()}>
              {prefix ? `${prefix} ${formattedShort}` : formattedShort}
            </Text>
          </button>
        </Tooltip>
      )
    }
  )
)

TimeAgoCard.displayName = 'TimeAgoCard'
