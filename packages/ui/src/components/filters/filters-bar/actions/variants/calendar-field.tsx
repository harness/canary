import { useState } from 'react'

import { Input, Calendar as UICalendar } from '@/components'
import { cn } from '@utils/cn'
import { format, isValid, parse } from 'date-fns'

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
 * Formats a date for display in the input field using dd/mm/yyyy format
 */
const formatDateForInput = (date: Date | undefined): string => {
  return date ? format(date, 'dd/MM/yyyy') : ''
}

const parseDateString = (dateStr: string): ParsedDateResult => {
  const date = parse(dateStr, 'dd/MM/yyyy', new Date())
  return { date: isValid(date) ? date : null, formattedValue: dateStr }
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

    const { date: parsedDate, formattedValue } = parseDateString(value)
    if (parsedDate && parsedDate.getFullYear() > 1000) {
      handleSingleDateConfirm(parsedDate, formattedValue)
    }
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
        placeholder="DD/MM/YYYY"
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
              month: value,
              input: { value: formatDateForInput(value), isError: false }
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
