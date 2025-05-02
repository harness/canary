import { JSX } from 'react'

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(new Date(inputValue))
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Input
          type="text"
          value={value ? new Date(value).toLocaleDateString() : ''}
          onChange={handleInputChange}
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
