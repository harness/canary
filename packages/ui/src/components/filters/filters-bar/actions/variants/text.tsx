import { DropdownMenuItem, Icon, Input } from '@/components'

import { FilterValue } from '../../../types'

interface TextFilterProps<T extends object> {
  filter: FilterValue<{ [key in keyof T]: string }>
  onUpdateFilter: (type: keyof T, selectedValues: T[keyof T]) => void
}

const Text = <T extends object>({ filter, onUpdateFilter }: TextFilterProps<T>) => {
  const value = filter.selectedValues || ''
  const emptyValue = '' as T[keyof T]

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    if (!newValue) {
      onUpdateFilter(filter.type, emptyValue)
      return
    }

    onUpdateFilter(filter.type, newValue as T[keyof T])
  }

  const handleClear = () => {
    onUpdateFilter(filter.type, emptyValue)
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
      </DropdownMenuItem>
    </div>
  )
}

export default Text
