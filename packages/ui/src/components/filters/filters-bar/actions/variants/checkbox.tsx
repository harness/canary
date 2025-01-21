import { useState } from 'react'

import { DropdownMenuCheckboxItem, Icon, Input } from '@/components'

import { CheckboxFilterOption, FilterValue } from '../../../types'

interface CheckboxFilterProps<T extends object> {
  filter: FilterValue<{ [key in keyof T]: string[] }>
  filterOption: CheckboxFilterOption<T>
  onUpdateFilter: (type: keyof T, selectedValues: T[keyof T]) => void
}

const Checkbox = <T extends object>({ filter, filterOption, onUpdateFilter }: CheckboxFilterProps<T>) => {
  const [searchInput, setSearchInput] = useState('')

  const filteredOptions = filterOption.options.filter(
    option => !searchInput || option.label.toLowerCase().includes(searchInput.toLowerCase())
  )

  const selectedValues = filter.selectedValues || []

  return (
    <>
      <div className="border-b border-borders-1 px-3 pb-2.5">
        <div className="flex min-h-8 justify-between gap-x-1 rounded border border-borders-2 px-1 py-[3px] outline-none transition-colors duration-200 focus-within:border focus-within:border-borders-3">
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {!!selectedValues.length &&
              selectedValues.map(value => {
                const label = filterOption.options?.find(opt => opt.value === value)?.label
                return (
                  <div className="flex h-6 items-center gap-x-1.5 rounded bg-background-8 px-2" key={value}>
                    <span className="text-14 text-foreground-8">{label}</span>
                    <button
                      className="text-icons-1 transition-colors duration-200 hover:text-foreground-1"
                      onClick={() => {
                        const newValues = filter.selectedValues.filter(v => v !== value)
                        onUpdateFilter(filter.type, newValues as unknown as T[keyof T])
                      }}
                    >
                      <Icon className="rotate-45" name="plus" size={10} />
                    </button>
                  </div>
                )
              })}

            <Input
              className="h-6 flex-1 border-none outline-none hover:border-none focus:border-none focus-visible:ring-0"
              type="text"
              placeholder={selectedValues.length ? '' : 'Select one or more options...'}
              value={searchInput || ''}
              onChange={e => setSearchInput(e.target.value)}
              onClick={e => {
                e.preventDefault()
              }}
              onKeyDown={e => e.stopPropagation()}
            />
          </div>
          {(!!selectedValues.length || searchInput) && (
            <button
              className="flex p-1.5 text-foreground-4 transition-colors duration-200 hover:text-foreground-1"
              onClick={() => {
                onUpdateFilter(filter.type, [] as T[keyof T])
                setSearchInput('')
              }}
              aria-label="Clear filter"
            >
              <Icon className="rotate-45" name="plus" size={12} />
            </button>
          )}
        </div>
      </div>

      {!!filteredOptions.length && (
        <div className="px-2 py-1">
          {filteredOptions.map(option => (
            <DropdownMenuCheckboxItem
              className="pl-[34px]"
              checked={selectedValues.includes(option.value)}
              onSelect={event => {
                event?.preventDefault()
                event?.stopPropagation()
                const newValues = selectedValues.includes(option.value)
                  ? selectedValues.filter(v => v !== option.value)
                  : [...selectedValues, option.value]
                onUpdateFilter(filter.type, newValues as T[keyof T])
              }}
              key={option.value}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      )}
      {!filteredOptions.length && (
        <div className="flex items-center justify-center p-4">
          <span className="text-1 text-foreground-2 leading-none">No results</span>
        </div>
      )}
    </>
  )
}

export default Checkbox
