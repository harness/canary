import { useState } from 'react'

import { DropdownMenuItem, Icon, Input } from '@/components'

import { FilterValue } from '../../types'
import { UseFiltersReturn } from '../../use-filters'

interface TextFilterProps {
  filter: FilterValue
  onUpdateFilter: UseFiltersReturn['handleUpdateFilter']
}

const Text = ({ filter, onUpdateFilter }: TextFilterProps) => {
  const [value, setValue] = useState<string>(filter.selectedValues[0] || '')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
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
    <div className="flex items-center px-2 pb-2.5">
      <DropdownMenuItem className="relative w-full p-0">
        <Input
          className="w-full"
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
            className="text-icons-1 hover:text-foreground-1 absolute right-3 transition-colors duration-200"
            onClick={e => {
              e.stopPropagation()
              handleClear()
            }}
            aria-label="Clear filter"
          >
            <Icon className="rotate-45" name="plus" size={10} />
          </button>
        )}
      </DropdownMenuItem>
    </div>
  )
}

export default Text
