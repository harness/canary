import { cn, DropdownMenuCheckboxItem, DropdownMenuItem, Icon, Input } from '@harnessio/canary'

import { CheckboxFilterOption, FilterValue } from '../../types'
import { UseFiltersReturn } from '../../use-filters'
import { getFilteredOptions } from '../../utils'

interface CheckboxFilterProps {
  filter: FilterValue
  filterOption: CheckboxFilterOption
  onUpdateFilter: UseFiltersReturn['handleUpdateFilter']
  searchQueries: UseFiltersReturn['searchQueries']
  handleSearchChange: UseFiltersReturn['handleSearchChange']
}

const Checkbox = ({ filter, filterOption, onUpdateFilter, searchQueries, handleSearchChange }: CheckboxFilterProps) => {
  const filteredOptions = getFilteredOptions(filterOption, filter, searchQueries)

  return (
    <>
      {filter.condition !== 'is_empty' && (
        <div className="border-b border-borders-1 px-3 pb-2.5">
          <div
            className={cn(
              'border-border-2 focus-within:border-borders-3 flex min-h-8 justify-between gap-x-1 rounded border px-2.5 py-[3px] outline-none transition-colors duration-200 focus-within:border',
              {
                'px-1': !!filter.selectedValues.length
              }
            )}
          >
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {!!filter.selectedValues.length &&
                filter.selectedValues.map(value => {
                  const label = filterOption.options?.find(opt => opt.value === value)?.label
                  return (
                    <div className="flex h-6 items-center gap-x-1.5 rounded bg-background-8 px-2" key={value}>
                      <span className="text-14 text-foreground-8">{label}</span>
                      <button
                        className="text-icons-1 transition-colors duration-200 hover:text-foreground-1"
                        onClick={() => {
                          const newValues = filter.selectedValues.filter(v => v !== value)
                          onUpdateFilter(filter.type, newValues)
                        }}
                      >
                        <Icon className="rotate-45" name="plus" size={10} />
                      </button>
                    </div>
                  )
                })}

              <DropdownMenuItem className="p-0 focus:bg-transparent" asChild>
                <Input
                  className="h-6 flex-1 border-none outline-none hover:border-none focus:border-none focus-visible:ring-0"
                  type="text"
                  placeholder={filter.selectedValues.length > 0 ? '' : 'Select one or more options...'}
                  value={searchQueries.filters[filter.type] || ''}
                  onChange={e => handleSearchChange?.(filter.type, e.target.value, 'filters')}
                  onClick={e => {
                    e.preventDefault()
                  }}
                  onKeyDown={e => e.stopPropagation()}
                />
              </DropdownMenuItem>
            </div>
            {(!!filter.selectedValues.length || searchQueries.filters[filter.type]) && (
              <button
                className="flex p-1.5 text-foreground-4 transition-colors duration-200 hover:text-foreground-1"
                onClick={() => {
                  onUpdateFilter(filter.type, [])
                  handleSearchChange?.(filter.type, '', 'filters')
                }}
              >
                <Icon className="rotate-45" name="plus" size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {!!filteredOptions.length && (
        <div className="px-2 py-1">
          {filteredOptions.map(option => (
            <DropdownMenuCheckboxItem
              className="pl-[34px]"
              checked={filter.selectedValues.includes(option.value)}
              onSelect={event => {
                event?.preventDefault()
                event?.stopPropagation()
                const newValues = filter.selectedValues.includes(option.value)
                  ? filter.selectedValues.filter(v => v !== option.value)
                  : [...filter.selectedValues, option.value]
                onUpdateFilter(filter.type, newValues)
              }}
              key={option.value}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      )}
    </>
  )
}

export default Checkbox
