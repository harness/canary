import { JSX, useEffect, useRef, useState } from 'react'

import { Calendar, Input } from '@/components'

export interface CalendarInputViewProps {
  value?: string
  setValue: (date: string) => void
  placeholder?: string
}

export const CalendarInputView = ({
  value,
  setValue,
  placeholder = 'Select date'
}: CalendarInputViewProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`

      setValue(formattedDate)
      setIsOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={calendarRef}>
      <Input
        type="text"
        value={value || ''}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
        placeholder={placeholder}
        className="cursor-pointer"
      />

      {isOpen && (
        <div className="absolute z-10 mt-1 rounded border bg-cn-background-1 shadow">
          <Calendar mode="single" selected={value ? new Date(value) : undefined} onSelect={handleDaySelect} />
        </div>
      )}
    </div>
  )
}
