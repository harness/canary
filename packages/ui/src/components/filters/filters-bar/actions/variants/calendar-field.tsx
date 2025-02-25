import { useState } from 'react'

import { Input, Calendar as UICalendar } from '@/components'
import { cn } from '@utils/cn'

import { FilterField } from '../../../types'

interface CalendarProps {
  filter: FilterField<Date>
  onUpdateFilter: (filterValue?: Date) => void
}

interface DateInputState {
  value: string
  isError: boolean
}

interface ParsedDateResult {
  date: Date | null
  formattedValue: string
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
  const initialDate = filter.value ? new Date(filter.value) : new Date()

  // State for single mode
  const [singleState, setSingleState] = useState<SingleState>({
    input: {
      value: filter.value ? formatDateForInput(new Date(filter.value)) : '',
      isError: false
    },
    date: filter.value ? new Date(filter.value) : undefined,
    month: initialDate
  })

  /**
   * Handles date input changes and resets error state
   */
  const handleDateInput = (value: string) => {
    setSingleState(prev => ({
      ...prev,
      input: { value, isError: false }
    }))
  }

  /**
   * Handles date confirmation on Enter or blur
   */
  const handleDateConfirm = (value: string) => {
    // If value is empty, don't show error
    if (!value.trim()) {
      setSingleState(prev => ({
        ...prev,
        input: { value: '', isError: false }
      }))
      return
    }

    const { date: parsedDate, formattedValue } = parseDateString(value)
    handleSingleDateConfirm(parsedDate, formattedValue)
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
      onUpdateFilter(parsedDate)
    } else {
      onUpdateFilter()
    }
  }

  /**
   * Handles keyboard events
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = singleState.input.value
      handleDateConfirm(value)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        className={cn(
          {
            'border-borders-danger focus:border-borders-danger': singleState.input.isError
          },
          'w-auto mx-3'
        )}
        value={singleState.input.value}
        onChange={e => handleDateInput(e.target.value)}
        onBlur={e => handleDateConfirm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Select or type a date..."
      />
      <UICalendar
        className="mt-2.5 px-2 pb-3 pt-1"
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
            onUpdateFilter(value)
          }
        }}
        initialFocus
      />
    </div>
  )
}

export default Calendar
