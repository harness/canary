import { useState } from 'react'

import { Icon, Input } from '@/components'

import { FilterHandlers, FilterValue } from '../../../types'

interface NumberFilterProps {
  filter: FilterValue
  onUpdateFilter: FilterHandlers['handleUpdateFilter']
}

const Number = ({ filter, onUpdateFilter }: NumberFilterProps) => {
  const [value, setValue] = useState<string>(filter.selectedValues[0] || '')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    if (!/^\d*\.?\d*$/.test(newValue) && newValue !== '') {
      return
    }

    setValue(newValue)

    if (filter.condition === 'is_empty' || filter.condition === 'is_not_empty') {
      onUpdateFilter(filter.type, [])
      return
    }

    if (!newValue) {
      onUpdateFilter(filter.type, [])
      return
    }

    onUpdateFilter(filter.type, [newValue])
  }

  const handleClear = () => {
    setValue('')
    onUpdateFilter(filter.type, [])
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
          className="absolute right-3 text-icons-1 transition-colors duration-200 hover:text-cn-foreground-1"
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
