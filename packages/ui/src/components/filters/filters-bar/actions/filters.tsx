import { useEffect, useState } from 'react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@/components'
import { cn } from '@utils/cn'

import type {
  CheckboxFilterOption,
  FilterAction,
  FilterHandlers,
  FilterOption,
  FilterSearchQueries,
  FilterValue
} from '../../types'
import { getFilterDisplayValue, getFilteredOptions } from '../../utils'
import Calendar from './variants/calendar'
import Checkbox from './variants/checkbox'
import Number from './variants/number'
import Text from './variants/text'

const renderFilterValues = (
  filter: FilterValue,
  filterOption: FilterOption,
  onUpdateFilter: FilterHandlers['handleUpdateFilter'],
  searchQueries: FilterSearchQueries,
  handleSearchChange: FilterHandlers['handleSearchChange'],
  filteredOptions?: CheckboxFilterOption['options']
) => {
  if (!onUpdateFilter) return null

  switch (filterOption.type) {
    case 'checkbox':
      return (
        <Checkbox
          filter={filter}
          filterOption={{
            ...filterOption,
            options: filteredOptions || (filterOption as CheckboxFilterOption).options
          }}
          onUpdateFilter={onUpdateFilter}
          searchQueries={searchQueries}
          handleSearchChange={handleSearchChange}
        />
      )
    case 'calendar':
      return <Calendar filter={filter} onUpdateFilter={onUpdateFilter} />
    case 'text':
      return <Text filter={filter} onUpdateFilter={onUpdateFilter} />
    case 'number':
      return <Number filter={filter} onUpdateFilter={onUpdateFilter} />
    default:
      return null
  }
}

interface FiltersProps {
  filter: FilterValue
  filterOptions: FilterOption[]
  handleUpdateFilter: FilterHandlers['handleUpdateFilter']
  handleRemoveFilter: FilterHandlers['handleRemoveFilter']
  handleUpdateCondition: FilterHandlers['handleUpdateCondition']
  handleSearchChange: FilterHandlers['handleSearchChange']
  searchQueries: FilterSearchQueries
  filterToOpen: FilterAction | null
  onOpen?: () => void
}

const Filters = ({
  filter,
  filterOptions,
  handleUpdateFilter,
  handleUpdateCondition,
  handleRemoveFilter,
  handleSearchChange,
  searchQueries,
  filterToOpen,
  onOpen
}: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (filterToOpen?.type === filter.type && filterToOpen?.kind === 'filter' && !isOpen) {
      setIsOpen(true)
      onOpen?.()
    }
  }, [filterToOpen, filter.type, isOpen, onOpen])

  const filterOption = filterOptions.find(opt => opt.value === filter.type)
  if (!filterOption) return null

  return (
    <DropdownMenu key={filter.type} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex h-8 items-center gap-x-3 whitespace-nowrap rounded bg-background-3 pl-2.5 pr-2 transition-colors duration-200 hover:bg-background-8">
        <div className="flex items-center gap-x-1.5 text-13">
          <span className="text-foreground-1">
            {filterOption.label}
            {!!filter.selectedValues.length && ': '}
          </span>
          <span className="text-foreground-4">{getFilterDisplayValue(filterOption, filter)}</span>
        </div>
        <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn('w-[276px] p-0', {
          'w-max': filterOption.type === 'calendar'
        })}
        align="start"
      >
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex w-full items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2">
              <span className="text-14 text-foreground-4">{filterOption.label}</span>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-[18px] items-center gap-x-1 rounded bg-background-3 pl-1.5 pr-1 text-14 text-foreground-2">
                  {filterOption.conditions?.find(c => c.value === filter.condition)?.label}
                  <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {filterOption.conditions?.map(condition => (
                    <DropdownMenuItem
                      onSelect={() => handleUpdateCondition?.(filter.type, condition.value)}
                      key={condition.value}
                    >
                      {condition.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="group flex h-[18px] items-center px-1">
                <Icon
                  className="text-icons-1 transition-colors duration-200 group-hover:text-foreground-1"
                  name="more-dots-fill"
                  size={12}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  className="text-foreground-4 duration-200 hover:text-foreground-danger data-[highlighted]:bg-transparent data-[highlighted]:text-foreground-danger data-[highlighted]:outline-none"
                  onSelect={() => handleRemoveFilter?.(filter.type)}
                >
                  <button className="flex items-center gap-x-1.5 text-14">
                    <Icon name="trash" size={12} />
                    Delete filter
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          {filter.condition !== 'is_empty' &&
            renderFilterValues(filter, filterOption, handleUpdateFilter, searchQueries, handleSearchChange)}

          {filterOption.type === 'checkbox' && getFilteredOptions(filterOption, filter, searchQueries).length === 0 && (
            <div className="flex items-center justify-center p-4">
              <span className="text-1 leading-none text-foreground-2">No results</span>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Filters
