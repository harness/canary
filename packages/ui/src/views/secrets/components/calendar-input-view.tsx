import { JSX, useState } from 'react'

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

  return (
    <div className="relative">
      <Input
        type="text"
        value={value || ''}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
        placeholder={placeholder}
        className="cursor-pointer"
      />

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-cn-background-1 shadow rounded border">
          <Calendar mode="single" selected={value ? new Date(value) : undefined} onSelect={handleDaySelect} />
        </div>
      )}
    </div>
  )
}
