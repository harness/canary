import { JSX } from 'react'

import { Calendar } from './calendar'
import { TextInput } from './inputs/text-input'
import { Popover } from './popover'

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
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <TextInput
          type="text"
          readOnly
          value={value ? new Date(value).toLocaleDateString() : ''}
          placeholder={placeholder}
          className="cursor-pointer"
        />
      </Popover.Trigger>
      <Popover.Content hideArrow>
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={date => setValue(date ?? new Date())}
        />
      </Popover.Content>
    </Popover.Root>
  )
}
