import { JSX, useEffect, useRef, useState } from 'react'

import { Calendar, Input, Popover } from '@/components'

export interface CalendarInputViewProps {
  value?: string
  setValue: (date: Date) => void
  placeholder?: string
}

export const CalendarInputView = ({
  value,
  setValue,
  placeholder = 'Select date'
}: CalendarInputViewProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  // const calendarRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(new Date(inputValue))
  }

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
  //       setIsOpen(false)
  //     }
  //   }

  //   if (isOpen) {
  //     document.addEventListener('mousedown', handleClickOutside)
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [isOpen])

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Input
          type="text"
          value={value ? new Date(value).toLocaleDateString() : ''}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className="cursor-pointer"
        />
      </Popover.Trigger>
      <Popover.Content>
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={date => setValue(date ?? new Date())}
        />
      </Popover.Content>
    </Popover.Root>
  )
}
