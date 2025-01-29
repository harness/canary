import { Icon, Input } from '@/components'
import { DropdownMenu } from '@components/dropdown-menu'
import { TFunction } from 'i18next'

import { FilterHandlers, FilterOption, SortOption } from '../types'

interface BaseFilterTriggerProps {
  type: 'filter' | 'sort'
  options: FilterOption[] | SortOption[]
  customLabel?: React.ReactNode | string
  hideCount?: boolean
  dropdownAlign?: 'start' | 'end'
}

interface FilterTriggerFilterProps extends BaseFilterTriggerProps {
  type: 'filter'
  options: FilterOption[]
  activeFilters: FilterHandlers['activeFilters']
  onChange: FilterHandlers['handleFilterChange']
  onReset?: FilterHandlers['handleResetFilters']
  searchQueries: FilterHandlers['searchQueries']
  onSearchChange: FilterHandlers['handleSearchChange']
  t: TFunction
}

interface FilterTriggerSortProps extends BaseFilterTriggerProps {
  type: 'sort'
  options: SortOption[]
  activeFilters: FilterHandlers['activeSorts']
  onChange: FilterHandlers['handleSortChange']
  onReset: FilterHandlers['handleResetSorts']
  searchQueries: FilterHandlers['searchQueries']
  onSearchChange: FilterHandlers['handleSearchChange']
  t: TFunction
}

type FilterTriggerProps = FilterTriggerFilterProps | FilterTriggerSortProps

const getLabels = (t: TFunction) => ({
  filter: {
    defaultLabel: t('component:filter.defaultLabel', 'Filter'),
    inputPlaceholder: t('component:filter.inputPlaceholder', 'Filter by...'),
    buttonLabel: t('component:filter.buttonLabel', 'Reset filters')
  },
  sort: {
    defaultLabel: t('component:sort.defaultLabel', 'Sort'),
    inputPlaceholder: t('component:sort.inputPlaceholder', 'Sort by...'),
    buttonLabel: t('component:sort.buttonLabel', 'Reset sort')
  }
})

const FilterTrigger = ({
  type,
  activeFilters,
  customLabel,
  hideCount,
  dropdownAlign = 'end',
  onChange,
  onReset,
  searchQueries,
  onSearchChange,
  options,
  t
}: FilterTriggerProps) => {
  const labels = getLabels(t)
  const { defaultLabel, inputPlaceholder, buttonLabel } = labels[type]
  const displayLabel = customLabel || defaultLabel

  const isFilterOption = (option: FilterOption | SortOption): option is FilterOption => {
    return 'type' in option && (option as FilterOption).type !== undefined
  }

  const isSortOption = (option: FilterOption | SortOption): option is SortOption => {
    return !('type' in option)
  }

  const onChangeOption = (option: FilterOption | SortOption) => {
    if (type === 'filter') {
      if (isFilterOption(option)) {
        onChange(
          {
            type: option.value
          },
          option.conditions?.[0].value
        )
      }
    } else {
      if (isSortOption(option)) {
        onChange({
          type: option.value,
          direction: 'desc'
        })
      }
    }
  }

  const filteredBySearchOptions = options.filter(
    option => !searchQueries.menu[type] || option.label.toLowerCase().includes(searchQueries.menu[type].toLowerCase())
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-x-1.5">
        <span className="flex items-center gap-x-1 text-14 text-foreground-2 hover:text-foreground-1">
          {displayLabel}
          {!hideCount && activeFilters.length > 0 && (
            <span className="flex h-[18px] min-w-[17px] items-center justify-center rounded border border-tag-border-blue-1 bg-tag-background-blue-1 px-1 text-11 text-tag-foreground-blue-1">
              {activeFilters.length}
            </span>
          )}
        </span>
        {!customLabel && <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[224px] p-0" align={dropdownAlign}>
        <div className="relative flex items-center justify-between border-b border-borders-4 px-3 py-2.5">
          <Input
            type="text"
            placeholder={inputPlaceholder}
            value={searchQueries.menu[type] || ''}
            onChange={e => onSearchChange(type, e.target.value, 'menu')}
            onKeyDown={e => e.stopPropagation()}
            onClick={e => e.preventDefault()}
          />

          {searchQueries.menu[type] && (
            <div className="absolute right-3">
              <button
                className="flex p-1.5 text-foreground-4 transition-colors duration-200 hover:text-foreground-1"
                onClick={e => {
                  e.preventDefault()
                  onSearchChange(type, '', 'menu')
                }}
              >
                <Icon className="rotate-45" name="plus" size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="p-1">
          {filteredBySearchOptions.map(option => (
            <DropdownMenu.Item key={option.value} onSelect={() => onChangeOption(option)}>
              {option.label}
            </DropdownMenu.Item>
          ))}

          {filteredBySearchOptions.length === 0 && (
            <div className="flex items-center justify-center p-4">
              <span className="text-14 leading-none text-foreground-2">No results</span>
            </div>
          )}
        </div>

        {onReset && (
          <div className="border-t border-borders-4 p-1">
            <DropdownMenu.Item asChild>
              <button className="w-full font-medium" onClick={onReset}>
                {buttonLabel}
              </button>
            </DropdownMenu.Item>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default FilterTrigger
