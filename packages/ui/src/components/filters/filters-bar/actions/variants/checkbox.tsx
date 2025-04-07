import { useState } from 'react'

import { DropdownMenu, Icon, Input } from '@/components'
import { CheckboxOptions } from '@components/filters/types'

interface CheckboxFilterProps {
  filter: Array<CheckboxOptions>
  filterOption: Array<CheckboxOptions>
  onUpdateFilter: (values: Array<CheckboxOptions>) => void
}

const Checkbox = ({ filter, filterOption, onUpdateFilter }: CheckboxFilterProps) => {
  const filteredOptions = filterOption
  const filterValue = filter

  const [search, setSearch] = useState('')

  return (
    <>
      <div className="border-b border-borders-1 px-3 pb-2.5">
        <div className="flex min-h-8 justify-between gap-x-1 rounded border border-borders-2 px-1 py-[3px] outline-none transition-colors duration-200 focus-within:border focus-within:border-borders-3">
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {!!filterValue?.length &&
              filterValue.map(value => {
                const label = filterOption?.find(opt => opt.value === value.value)?.label
                return (
                  <div className="flex h-6 items-center gap-x-1.5 rounded bg-background-8 px-2" key={value.value}>
                    <span className="text-14 text-foreground-8">{label}</span>
                    <button
                      className="text-icons-1 transition-colors duration-200 hover:text-foreground-1"
                      onClick={() => {
                        const newValues = filterValue.filter(v => v.value !== value.value)
                        onUpdateFilter(newValues)
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
              placeholder={filterValue?.length ? '' : 'Select one or more options...'}
              value={search || ''}
              onChange={e => setSearch(e.target.value)}
              onClick={e => {
                e.preventDefault()
              }}
              onKeyDown={e => e.stopPropagation()}
            />
          </div>
          {(!!filterValue?.length || search) && (
            <button
              className="flex p-1.5 text-foreground-4 transition-colors duration-200 hover:text-foreground-1"
              onClick={() => {
                onUpdateFilter([])
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
            <DropdownMenu.CheckboxItem
              className="pl-[34px]"
              checked={filterValue.map(v => v.value).includes(option.value)}
              onSelect={event => {
                event?.preventDefault()
                event?.stopPropagation()
                const newValues = filterValue.map(v => v.value).includes(option.value)
                  ? filterValue.filter(v => v.value !== option.value)
                  : [...filterValue, { label: option.label, value: option.value }]
                onUpdateFilter(newValues)
              }}
              key={option.value}
            >
              {option.label}
            </DropdownMenu.CheckboxItem>
          ))}
        </div>
      )}
    </>
  )
}

export default Checkbox
