import { useState } from 'react'

import { DropdownMenu, Icon, Input } from '@/components'

import { FilterField } from '../../../types'

interface TextFilterProps {
  filter: FilterField<string>
  onUpdateFilter: (filterValue: string) => void
}

const Text = ({ filter, onUpdateFilter }: TextFilterProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateFilter(event.target.value)
  }

  const handleClear = () => {
    onUpdateFilter('')
  }

  return (
    <div className="flex items-center px-2 pb-2.5">
      <DropdownMenu.Item className="relative w-full p-0">
        <Input
          className="w-full"
          value={filter.value || ''}
          placeholder="Type a value..."
          onChange={handleInputChange}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        />

        {filter.value && (
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
      </DropdownMenu.Item>
    </div>
  )
}

export default Text
