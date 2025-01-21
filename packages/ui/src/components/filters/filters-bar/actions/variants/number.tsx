import { useState } from 'react'

import { Icon, Input } from '@/components'

import { FilterValue } from '../../../types'

interface NumberFilterProps<T extends object> {
  filter: FilterValue<{[key in keyof T]: string}>
  onUpdateFilter: (type: keyof T, selectedValues: T[keyof T]) => void
}

const Number = <T extends object>({ filter, onUpdateFilter }: NumberFilterProps<T>) => {
  const [value, setValue] = useState<string>(filter.selectedValues || '')
  const emptyValue =  '' as T[keyof T]

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    if (!/^\d*\.?\d*$/.test(newValue) && newValue !== '') {
      return
    }

    setValue(newValue)

    if (filter.condition === 'is_empty' || filter.condition === 'is_not_empty') {
      onUpdateFilter(filter.type, emptyValue)
      return
    }

    if (!newValue) {
      onUpdateFilter(filter.type, emptyValue)
      return
    }

    onUpdateFilter(filter.type, newValue as T[keyof T])
  }

  const handleClear = () => {
    setValue('')
    onUpdateFilter(filter.type, emptyValue)
  }

  if (filter.condition === 'is_empty' || filter.condition === 'is_not_empty') {
    return null
  }

  return (
    <div className="relative flex items-center px-2 pb-2.5">
      <Input
        className="w-full"
        type="text"
        value={value}
        placeholder="Type a value..."
        onChange={handleInputChange}
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
      />

      {value && (
        <button
          className="absolute right-3 text-icons-1 transition-colors duration-200 hover:text-foreground-1"
          onClick={e => {
            e.stopPropagation()
            handleClear()
          }}
          aria-label="Clear filter"
        >
          <Icon className="rotate-45" name="plus" size={10} />
        </button>
      )}
    </div>
  )
}

export default Number
