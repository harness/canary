import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

import { TextInput } from '@/components'
import { cn } from '@utils/cn'
import { addDays, addHours, addMonths, format, isValid, parse } from 'date-fns'

import { Separator } from '../separator'
import type { CivilDate, CivilTime } from './types'

const civilToDate = (value: CivilDate): Date => new Date(`${value}T12:00:00`)
const toCivilDate = (date: Date): CivilDate => format(date, 'yyyy-MM-dd') as CivilDate
const formatCivilDate = (value: CivilDate): string => format(civilToDate(value), 'MMM d, yyyy')

const parseCivilDateInput = (raw: string, reference: Date): CivilDate | undefined => {
  const formats = ['MMM d, yyyy', 'MMM d yyyy', 'M/d/yyyy', 'yyyy-MM-dd']
  for (const pattern of formats) {
    const result = parse(raw.trim(), pattern, reference)
    if (isValid(result)) return toCivilDate(result)
  }
  return undefined
}

const civilTimeToDate = (value: CivilTime): Date => {
  const [hours, minutes] = value.split(':').map(Number)
  return new Date(2000, 0, 1, hours, minutes)
}

const formatCivilTime = (value: CivilTime): string => format(civilTimeToDate(value), 'h:mm a')

/** The date and time share one border. Their own input chrome has to stay off, including on hover and focus. */
const embeddedInputContainerClassName = [
  'h-full !w-auto !rounded-none !border-0 !bg-transparent !p-0 !shadow-[none]',
  'hover:!border-0 hover:!shadow-[none]',
  'focus-within:!border-0 focus-within:!shadow-[none]'
].join(' ')

const parseCivilTimeInput = (raw: string): CivilTime | undefined => {
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

interface DateTimeEndpointFieldProps {
  label: string
  date: CivilDate
  time: CivilTime
  onDateChange: (date: CivilDate) => void
  onTimeChange: (time: CivilTime) => void
  showTime?: boolean
  disabled?: boolean
  className?: string
}

export const DateTimeEndpointField = ({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  showTime = true,
  disabled,
  className
}: DateTimeEndpointFieldProps) => {
  const [dateText, setDateText] = useState(() => formatCivilDate(date))
  const [timeText, setTimeText] = useState(() => formatCivilTime(time))
  const [dateInvalid, setDateInvalid] = useState(false)
  const [timeInvalid, setTimeInvalid] = useState(false)

  useEffect(() => {
    setDateText(formatCivilDate(date))
    setDateInvalid(false)
  }, [date])

  useEffect(() => {
    setTimeText(formatCivilTime(time))
    setTimeInvalid(false)
  }, [time])

  const commitDate = (raw: string) => {
    const parsed = parseCivilDateInput(raw, civilToDate(date))
    if (!parsed) {
      setDateInvalid(true)
      return
    }
    setDateInvalid(false)
    if (parsed === date) setDateText(formatCivilDate(parsed))
    else onDateChange(parsed)
  }

  const commitTime = (raw: string) => {
    const parsed = parseCivilTimeInput(raw)
    if (!parsed) {
      setTimeInvalid(true)
      return
    }
    setTimeInvalid(false)
    if (parsed === time) setTimeText(formatCivilTime(parsed))
    else onTimeChange(parsed)
  }

  const handleDateKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const amount = event.key === 'ArrowUp' ? 1 : -1
      const next = event.shiftKey ? addMonths(civilToDate(date), amount) : addDays(civilToDate(date), amount)
      onDateChange(toCivilDate(next))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      commitDate(dateText)
    } else if (event.key === 'Escape') {
      setDateText(formatCivilDate(date))
      setDateInvalid(false)
    }
  }

  const handleTimeKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = addHours(civilTimeToDate(time), event.key === 'ArrowUp' ? 1 : -1)
      onTimeChange(format(next, 'HH:mm') as CivilTime)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      commitTime(timeText)
    } else if (event.key === 'Escape') {
      setTimeText(formatCivilTime(time))
      setTimeInvalid(false)
    }
  }

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDateText(event.target.value)
    setDateInvalid(false)
  }

  return (
    <div
      className={cn(
        'flex h-8 items-center rounded-cn-3 border border-solid bg-cn-2 transition-[border-color,box-shadow]',
        '[&_.cn-input-container]:!rounded-none [&_.cn-input-container]:!border-0 [&_.cn-input-container]:!bg-transparent [&_.cn-input-container]:!shadow-[none]',
        '[&_.cn-input-container]:hover:!border-0 [&_.cn-input-container]:hover:!shadow-[none]',
        '[&_.cn-input-container]:focus-within:!border-0 [&_.cn-input-container]:focus-within:!shadow-[none]',
        '[&_.cn-input-input]:focus:!shadow-[none] [&_.cn-input-input]:focus-visible:!shadow-[none] [&_.cn-input-input]:focus-visible:!outline-none',
        dateInvalid || timeInvalid
          ? 'border-cn-danger shadow-cn-ring-error'
          : 'border-cn-2 hover:border-cn-brand focus-within:border-cn-brand focus-within:shadow-cn-ring-selected',
        className
      )}
    >
      <TextInput
        type="text"
        value={dateText}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        aria-label={`${label} date`}
        aria-invalid={dateInvalid}
        onChange={handleDateChange}
        onKeyDown={handleDateKeyDown}
        onBlur={() => {
          if (!parseCivilDateInput(dateText, civilToDate(date))) {
            setDateText(formatCivilDate(date))
            setDateInvalid(false)
          } else {
            commitDate(dateText)
          }
        }}
        wrapperClassName="h-full min-w-0"
        inputContainerClassName={embeddedInputContainerClassName}
        className="font-body-single-line-normal h-full w-28 min-w-0 pl-cn-sm pr-cn-2xs text-cn-1 outline-none"
      />
      {showTime && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <TextInput
            type="text"
            value={timeText}
            disabled={disabled}
            spellCheck={false}
            autoComplete="off"
            aria-label={`${label} time`}
            aria-invalid={timeInvalid}
            onChange={event => {
              setTimeText(event.target.value)
              setTimeInvalid(false)
            }}
            onKeyDown={handleTimeKeyDown}
            onBlur={() => {
              if (!parseCivilTimeInput(timeText)) {
                setTimeText(formatCivilTime(time))
                setTimeInvalid(false)
              } else {
                commitTime(timeText)
              }
            }}
            wrapperClassName="h-full shrink-0"
            inputContainerClassName={embeddedInputContainerClassName}
            className="font-body-single-line-normal h-full w-20 shrink-0 text-center text-cn-1 outline-none"
          />
        </>
      )}
    </div>
  )
}
