import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

import { TextInput } from '@/components'
import { cn } from '@utils/cn'
import { isValid, parse } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

import { shiftCivilDateTimeHours } from './timezone-utils'
import type { CivilDateTime } from './types'

const DISPLAY_WITH_SECONDS = 'MMM d, yyyy, h:mm:ss a'
const DISPLAY_WITH_TIME = 'MMM d, yyyy, h:mm a'
const DISPLAY_DATE = 'MMM d, yyyy'

const pad = (value: number): string => String(value).padStart(2, '0')

/** Civil parts live on a UTC date so an hour step never follows the browser's daylight-saving gap. */
const toUtcDate = (value: CivilDateTime): Date => {
  const [date, time] = value.split('T')
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute, second] = time.split(':').map(Number)
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second))
}

const fromLocalDate = (value: Date): CivilDateTime =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}` as CivilDateTime

const formatCivilDateTime = (value: CivilDateTime, showTime: boolean, showSeconds: boolean): string => {
  const pattern = !showTime ? DISPLAY_DATE : showSeconds ? DISPLAY_WITH_SECONDS : DISPLAY_WITH_TIME
  return formatInTimeZone(toUtcDate(value), 'UTC', pattern)
}

/** Text shapes accepted on blur. The first match wins, including the string this field displays. */
const PARSE_FORMATS = [
  DISPLAY_WITH_SECONDS,
  DISPLAY_WITH_TIME,
  DISPLAY_DATE,
  'MMM d, yyyy, H:mm:ss',
  'MMM d, yyyy, H:mm',
  'M/d/yyyy, h:mm:ss a',
  'M/d/yyyy, h:mm a',
  'M/d/yyyy',
  "yyyy-MM-dd'T'HH:mm:ss",
  "yyyy-MM-dd'T'HH:mm",
  'yyyy-MM-dd'
]

const hasTime = (pattern: string): boolean => pattern.includes('H') || pattern.includes('h')
const hasSeconds = (pattern: string): boolean => pattern.includes('ss')

const parseCivilDateTimeInput = (
  raw: string
): { value: CivilDateTime; withTime: boolean; withSeconds: boolean } | undefined => {
  const text = raw.trim()
  for (const pattern of PARSE_FORMATS) {
    const result = parse(text, pattern, new Date())
    if (!isValid(result)) continue
    return { value: fromLocalDate(result), withTime: hasTime(pattern), withSeconds: hasSeconds(pattern) }
  }
  return undefined
}

interface DateTimeEndpointFieldProps {
  label: string
  value?: CivilDateTime
  onChange: (value: CivilDateTime) => void
  showTime?: boolean
  showSeconds?: boolean
  /** Clock written when the user enters a date without a time. */
  dateOnlyClock?: '00:00:00' | '23:59:59'
  /** Hour step from the arrow keys. A typed value still goes through `onChange`. */
  onStep?: (hours: number) => void
  disabled?: boolean
  className?: string
}

export const DateTimeEndpointField = ({
  label,
  value,
  onChange,
  showTime = true,
  showSeconds = false,
  dateOnlyClock = '00:00:00',
  onStep,
  disabled,
  className
}: DateTimeEndpointFieldProps) => {
  const [text, setText] = useState(() => (value ? formatCivilDateTime(value, showTime, showSeconds) : ''))
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    setText(value ? formatCivilDateTime(value, showTime, showSeconds) : '')
    setInvalid(false)
  }, [value, showTime, showSeconds])

  const commit = (raw: string) => {
    if (!raw.trim()) {
      setText(value ? formatCivilDateTime(value, showTime, showSeconds) : '')
      setInvalid(false)
      return
    }
    const parsed = parseCivilDateTimeInput(raw)
    if (!parsed) {
      setInvalid(true)
      return
    }
    let next = parsed.value
    if (!showTime || !parsed.withTime) next = `${next.slice(0, 10)}T${dateOnlyClock}` as CivilDateTime
    else if (!parsed.withSeconds) {
      next =
        !showSeconds && value && next.slice(0, 16) === value.slice(0, 16)
          ? value
          : (`${next.slice(0, 16)}:00` as CivilDateTime)
    }
    setInvalid(false)
    if (next === value) setText(formatCivilDateTime(next, showTime, showSeconds))
    else onChange(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && value) {
      event.preventDefault()
      const hours = event.key === 'ArrowUp' ? 1 : -1
      if (onStep) onStep(hours)
      else onChange(shiftCivilDateTimeHours(value, hours))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      commit(text)
    } else if (event.key === 'Escape') {
      setText(value ? formatCivilDateTime(value, showTime, showSeconds) : '')
      setInvalid(false)
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
    setInvalid(false)
  }

  return (
    <TextInput
      type="text"
      value={text}
      disabled={disabled}
      spellCheck={false}
      autoComplete="off"
      aria-label={label}
      aria-invalid={invalid}
      placeholder={showTime ? 'Describe date and time' : 'Describe date'}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => commit(text)}
      wrapperClassName={cn('min-w-0', className)}
      className="font-body-single-line-normal"
    />
  )
}
