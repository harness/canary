import { useState } from 'react'

import { Calendar as UICalendar, type CalendarDateRange } from '@components/calendar'
import { Input } from '@components/form'
import { cn } from '@utils/cn'

import { FilterValue } from '../../types'
import { UseFiltersReturn } from '../../use-filters'

interface CalendarProps {
  filter: FilterValue
  onUpdateFilter: UseFiltersReturn['handleUpdateFilter']
}

interface DateInputState {
  value: string
  isError: boolean
}

interface ParsedDateResult {
  date: Date | null
  formattedValue: string
}

interface RangeState {
  from: DateInputState
  to: DateInputState
  month: Date
  range: CalendarDateRange | undefined
}

interface SingleState {
  input: DateInputState
  date: Date | undefined
  month: Date
}

/**
 * Formats a date for display in the input field using MM.DD.YYYY format
 */
const formatDateForInput = (date: Date | undefined): string => {
  if (!date) return ''
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${month}.${day}.${year}`
}

/**
 * Parses a date string in various formats and returns a Date object with formatted value
 * Supported formats:
 * - MM.DD.YY -> automatically converts to MM.DD.YYYY
 * - MM.DD.YYYY
 * - MM/DD/YY -> automatically converts to MM/DD/YYYY
 * - MM/DD/YYYY
 */
const parseDateString = (dateStr: string): ParsedDateResult => {
  try {
    dateStr = dateStr.trim()

    // Check format for both two-digit and four-digit years
    const dateRegex = /^(0?[1-9]|1[0-2])[./](0?[1-9]|[12]\d|3[01])[./](\d{2}|\d{4})$/
    if (!dateRegex.test(dateStr)) {
      return { date: null, formattedValue: dateStr }
    }

    const separators = /[./]/
    const parts = dateStr.split(separators)
    const separator = dateStr.includes('.') ? '.' : '/'

    if (parts.length !== 3) {
      return { date: null, formattedValue: dateStr }
    }

    const month = parseInt(parts[0])
    const day = parseInt(parts[1])
    let year = parseInt(parts[2])

    // Convert two-digit year to four-digit
    if (parts[2].length === 2) {
      year = 2000 + year
    }

    // Validate date values
    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > 2100
    ) {
      return { date: null, formattedValue: dateStr }
    }

    // Validate date existence
    const date = new Date(year, month - 1, day)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return { date: null, formattedValue: dateStr }
    }

    // Format value with leading zeros
    const formattedMonth = month.toString().padStart(2, '0')
    const formattedDay = day.toString().padStart(2, '0')
    const formattedValue = `${formattedMonth}${separator}${formattedDay}${separator}${year}`

    return { date, formattedValue }
  } catch (error) {
    console.error('Error parsing date:', error)
    return { date: null, formattedValue: dateStr }
  }
}

const Calendar = ({ filter, onUpdateFilter }: CalendarProps) => {
  // Initialize states based on filter mode
  const isBetweenMode = filter.condition === 'is_between'
  const initialDate = filter.selectedValues[0] ? new Date(filter.selectedValues[0]) : new Date()

  // State for range mode
  const [rangeState, setRangeState] = useState<RangeState>({
    from: {
      value: filter.selectedValues[0] ? formatDateForInput(new Date(filter.selectedValues[0])) : '',
      isError: false
    },
    to: {
      value: filter.selectedValues[1] ? formatDateForInput(new Date(filter.selectedValues[1])) : '',
      isError: false
    },
    month: initialDate,
    range:
      filter.selectedValues.length === 2
        ? {
            from: new Date(filter.selectedValues[0]),
            to: new Date(filter.selectedValues[1])
          }
        : undefined
  })

  // State for single mode
  const [singleState, setSingleState] = useState<SingleState>({
    input: {
      value: filter.selectedValues[0] ? formatDateForInput(new Date(filter.selectedValues[0])) : '',
      isError: false
    },
    date: filter.selectedValues[0] ? new Date(filter.selectedValues[0]) : undefined,
    month: initialDate
  })

  /**
   * Handles date input changes and resets error state
   */
  const handleDateInput = (value: string, type?: 'from' | 'to') => {
    if (isBetweenMode) {
      setRangeState(prev => ({
        ...prev,
        [type === 'from' ? 'from' : 'to']: { value, isError: false }
      }))
    } else {
      setSingleState(prev => ({
        ...prev,
        input: { value, isError: false }
      }))
    }
  }

  /**
   * Handles date confirmation on Enter or blur
   */
  const handleDateConfirm = (value: string, type?: 'from' | 'to') => {
    // If value is empty, don't show error
    if (!value.trim()) {
      if (isBetweenMode) {
        setRangeState(prev => ({
          ...prev,
          [type === 'from' ? 'from' : 'to']: { value: '', isError: false }
        }))
      } else {
        setSingleState(prev => ({
          ...prev,
          input: { value: '', isError: false }
        }))
      }
      return
    }

    const { date: parsedDate, formattedValue } = parseDateString(value)

    if (isBetweenMode) {
      handleRangeDateConfirm(parsedDate, formattedValue, type as 'from' | 'to')
    } else {
      handleSingleDateConfirm(parsedDate, formattedValue)
    }
  }

  /**
   * Handles date confirmation for range mode
   */
  const handleRangeDateConfirm = (parsedDate: Date | null, formattedValue: string, type: 'from' | 'to') => {
    setRangeState(prev => {
      const newState = {
        ...prev,
        [type]: {
          value: formattedValue,
          // Show error only if value is not empty and incorrect
          isError: formattedValue.trim() !== '' && !parsedDate
        }
      }

      if (parsedDate) {
        newState.month = parsedDate
        newState.range = {
          ...prev.range,
          [type]: parsedDate
        } as CalendarDateRange
      } else {
        newState.range = {
          ...prev.range,
          [type]: undefined
        } as CalendarDateRange
      }

      return newState
    })

    // Update filter
    if (parsedDate) {
      const newRange =
        type === 'from'
          ? { from: parsedDate, to: rangeState.range?.to }
          : { from: rangeState.range?.from, to: parsedDate }

      if (newRange.from && newRange.to) {
        onUpdateFilter(filter.type, [newRange.from.toISOString(), newRange.to.toISOString()])
      } else if (newRange.from) {
        onUpdateFilter(filter.type, [newRange.from.toISOString()])
      } else if (newRange.to) {
        onUpdateFilter(filter.type, [newRange.to.toISOString()])
      }
    }
  }

  /**
   * Handles date confirmation for single mode
   */
  const handleSingleDateConfirm = (parsedDate: Date | null, formattedValue: string) => {
    setSingleState(prev => ({
      ...prev,
      input: {
        value: formattedValue,
        // Show error only if value is not empty and incorrect
        isError: formattedValue.trim() !== '' && !parsedDate
      },
      date: parsedDate || undefined,
      month: parsedDate || prev.month
    }))

    if (parsedDate) {
      onUpdateFilter(filter.type, [parsedDate.toISOString()])
    } else {
      onUpdateFilter(filter.type, [])
    }
  }

  /**
   * Handles keyboard events
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type?: 'from' | 'to') => {
    if (e.key === 'Enter') {
      const value = isBetweenMode
        ? type === 'from'
          ? rangeState.from.value
          : rangeState.to.value
        : singleState.input.value
      handleDateConfirm(value, type)
    }
  }

  if (isBetweenMode) {
    return (
      <div className="flex flex-col">
        <div className="grid max-w-[240px] grid-cols-2 items-center gap-x-2 px-3">
          <Input
            type="text"
            className={cn({
              'border-borders-danger focus:border-borders-danger': rangeState.from.isError
            })}
            value={rangeState.from.value}
            onChange={e => handleDateInput(e.target.value, 'from')}
            onBlur={e => handleDateConfirm(e.target.value, 'from')}
            onKeyDown={e => handleKeyDown(e, 'from')}
            placeholder="Starting"
          />

          <Input
            type="text"
            className={cn({
              'border-borders-danger focus:border-borders-danger': rangeState.to.isError
            })}
            value={rangeState.to.value}
            onChange={e => handleDateInput(e.target.value, 'to')}
            onBlur={e => handleDateConfirm(e.target.value, 'to')}
            onKeyDown={e => handleKeyDown(e, 'to')}
            placeholder="Ending"
          />
        </div>
        <div className="mt-2.5 px-2 pb-3 pt-1">
          <UICalendar
            className="p-0"
            mode="range"
            selected={rangeState.range}
            month={rangeState.month}
            onMonthChange={month => setRangeState(prev => ({ ...prev, month }))}
            onSelect={(value: CalendarDateRange | undefined) => {
              if (value) {
                setRangeState(prev => ({
                  ...prev,
                  range: value,
                  from: { value: formatDateForInput(value.from), isError: false },
                  to: { value: formatDateForInput(value.to), isError: false },
                  month: value.from || prev.month
                }))

                if (value.from && value.to) {
                  onUpdateFilter(filter.type, [value.from.toISOString(), value.to.toISOString()])
                }
              }
            }}
            initialFocus
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="px-3">
        <Input
          type="text"
          className={cn({
            'border-borders-danger focus:border-borders-danger': singleState.input.isError
          })}
          value={singleState.input.value}
          onChange={e => handleDateInput(e.target.value)}
          onBlur={e => handleDateConfirm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Select or type a date..."
        />
      </div>
      <div className="mt-2.5 px-2 pb-3 pt-1">
        <UICalendar
          className="p-0"
          mode="single"
          selected={singleState.date}
          month={singleState.month}
          onMonthChange={month => setSingleState(prev => ({ ...prev, month }))}
          onSelect={(value: Date | undefined) => {
            if (value) {
              setSingleState(prev => ({
                ...prev,
                date: value,
                month: value
              }))
              onUpdateFilter(filter.type, [value.toISOString()])
            }
          }}
          initialFocus
        />
      </div>
    </div>
  )
}

export default Calendar
