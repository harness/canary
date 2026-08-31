import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

import { cn } from '@utils/cn'
import { addDays, addHours, addMonths, format } from 'date-fns'

import { Separator } from '../separator'
import { parseCivilDateInput } from './parse-date-range-query'
import { CivilDate, CivilTime } from './types'

// Midday keeps the civil date stable regardless of the browser's local offset.
const civilToDate = (value: CivilDate): Date => new Date(`${value}T12:00:00`)
const toCivilDate = (date: Date): CivilDate => format(date, 'yyyy-MM-dd') as CivilDate

export const formatCivilDate = (value: CivilDate): string => format(civilToDate(value), 'MMM d, yyyy')

const civilTimeToDate = (value: CivilTime): Date => {
  const [hours, minutes] = value.split(':').map(Number)
  return new Date(2000, 0, 1, hours, minutes)
}

export const formatCivilTime = (value: CivilTime): string => format(civilTimeToDate(value), 'h:mm a')

export const parseCivilTimeInput = (raw: string): CivilTime | undefined => {
  const match = raw
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?::?(\d{2}))?\s*(am|pm)?$/)
  if (!match) return undefined

  let hours = Number(match[1])
  const minutes = Number(match[2] ?? 0)
  const meridiem = match[3]
  if (minutes > 59 || (meridiem ? hours < 1 || hours > 12 : hours > 23)) return undefined
  if (meridiem) {
    hours %= 12
    if (meridiem === 'pm') hours += 12
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` as CivilTime
}

export interface DateTimeEndpointFieldProps {
  /** Names the endpoint for assistive tech, for example `Start`. */
  label: string
  date: CivilDate
  /** Omit to render the field as a date-only endpoint. */
  time?: CivilTime
  onDateChange: (date: CivilDate) => void
  onTimeChange?: (time: CivilTime) => void
  disabled?: boolean
  className?: string
}

/**
 * Combined endpoint control: both halves are editable. Date arrows step by a
 * day and time arrows step by an hour.
 */
export const DateTimeEndpointField = ({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  disabled,
  className
}: DateTimeEndpointFieldProps) => {
  const [text, setText] = useState(() => formatCivilDate(date))
  const [timeText, setTimeText] = useState(() => (time ? formatCivilTime(time) : ''))
  const [invalid, setInvalid] = useState(false)
  const [timeInvalid, setTimeInvalid] = useState(false)

  useEffect(() => {
    setText(formatCivilDate(date))
    setInvalid(false)
  }, [date])

  useEffect(() => {
    setTimeText(time ? formatCivilTime(time) : '')
    setTimeInvalid(false)
  }, [time])

  const commit = (raw: string) => {
    const parsed = parseCivilDateInput(raw, civilToDate(date))
    if (!parsed) {
      setInvalid(true)
      return
    }

    setInvalid(false)
    if (parsed === date) setText(formatCivilDate(parsed))
    else onDateChange(parsed)
  }

  const step = (amount: number, unit: 'day' | 'month') => {
    const base = civilToDate(date)
    onDateChange(toCivilDate(unit === 'month' ? addMonths(base, amount) : addDays(base, amount)))
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
    if (invalid) setInvalid(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      step(event.key === 'ArrowUp' ? 1 : -1, event.shiftKey ? 'month' : 'day')
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      commit(text)
      return
    }

    if (event.key === 'Escape') {
      setText(formatCivilDate(date))
      setInvalid(false)
    }
  }

  const handleBlur = () => {
    if (!parseCivilDateInput(text, civilToDate(date))) {
      setText(formatCivilDate(date))
      setInvalid(false)
      return
    }
    commit(text)
  }

  const commitTime = (raw: string) => {
    if (time === undefined || !onTimeChange) return
    const parsed = parseCivilTimeInput(raw)
    if (!parsed) {
      setTimeInvalid(true)
      return
    }
    setTimeInvalid(false)
    if (parsed === time) setTimeText(formatCivilTime(parsed))
    else onTimeChange(parsed)
  }

  const handleTimeKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (time === undefined || !onTimeChange) return
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const stepped = addHours(civilTimeToDate(time), event.key === 'ArrowUp' ? 1 : -1)
      onTimeChange(format(stepped, 'HH:mm') as CivilTime)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      commitTime(timeText)
    } else if (event.key === 'Escape') {
      setTimeText(formatCivilTime(time))
      setTimeInvalid(false)
    }
  }

  return (
    <div
      className={cn(
        'flex h-8 items-center rounded-cn-3 border border-solid bg-cn-2',
        invalid || timeInvalid ? 'border-cn-danger' : 'border-transparent focus-within:border-cn-1',
        className
      )}
    >
      <input
        type="text"
        value={text}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        aria-label={`${label} date`}
        aria-invalid={invalid}
        title="Type a date, or use the up and down arrow keys"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        // Sized to the longest formatted date so the time sits beside it, not across the field.
        className="font-body-single-line-normal h-full w-28 min-w-0 bg-transparent pl-cn-sm pr-cn-2xs text-cn-1 outline-none disabled:text-cn-disabled"
      />
      {time !== undefined && onTimeChange && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <input
            type="text"
            value={timeText}
            disabled={disabled}
            spellCheck={false}
            autoComplete="off"
            aria-label={`${label} time`}
            aria-invalid={timeInvalid}
            title="Type a time, or use the up and down arrow keys to change the hour"
            onChange={event => {
              setTimeText(event.target.value)
              if (timeInvalid) setTimeInvalid(false)
            }}
            onKeyDown={handleTimeKeyDown}
            onBlur={() => {
              if (!parseCivilTimeInput(timeText)) {
                setTimeText(formatCivilTime(time))
                setTimeInvalid(false)
                return
              }
              commitTime(timeText)
            }}
            className="font-body-single-line-normal h-full w-20 shrink-0 bg-transparent px-cn-xs text-center text-cn-1 outline-none disabled:text-cn-disabled"
          />
        </>
      )}
    </div>
  )
}

DateTimeEndpointField.displayName = 'DateTimeEndpointField'
