import { useMemo } from 'react'

import { Icon } from '@/components'
import { TFunction } from 'i18next'

import { createFilters } from '@harnessio/filters'

import FilterBoxWrapper from '../filter-box-wrapper'
import FilterSelect, { FilterSelectAddIconLabel } from '../filter-select'
import {
  CheckboxFilterOption,
  FilterHandlers,
  FilterOption,
  FilterValue,
  SortDirection,
  SortOption,
  ViewManagement
} from '../types'
import { getFilterDisplayValue } from '../utils'
import Sorts from './actions/sorts'
import Calendar from './actions/variants/calendar'
import Checkbox from './actions/variants/checkbox'
import Number from './actions/variants/number'
import Text from './actions/variants/text'
import Views from './actions/views'

interface FiltersBarProps<T extends object> {
  openedFilter: keyof T | undefined
  setOpenedFilter: (filter: keyof T) => void
  filterOptions: FilterOption<T>[]
  sortOptions: SortOption[]
  selectedFiltersCnt: number
  sortDirections: SortDirection[]
  t: TFunction
  filterHandlers: Pick<
    FilterHandlers,
    | 'activeFilters'
    | 'activeSorts'
    | 'handleUpdateFilter'
    | 'handleRemoveFilter'
    | 'handleFilterChange'
    | 'handleUpdateCondition'
    | 'handleUpdateSort'
    | 'handleRemoveSort'
    | 'handleSortChange'
    | 'handleResetSorts'
    | 'handleReorderSorts'
    | 'handleResetAll'
    | 'searchQueries'
    | 'handleSearchChange'
    | 'filterToOpen'
    | 'clearFilterToOpen'
  >
  /**
   * Optional view management configuration.
   * If provided, enables saving and managing filter views
   */
  viewManagement?: Pick<
    ViewManagement,
    | 'savedViews'
    | 'currentView'
    | 'hasActiveViewChanges'
    | 'checkNameExists'
    | 'saveView'
    | 'updateView'
    | 'deleteView'
    | 'renameView'
  >
}

/**
 * FiltersBar component displays active filters and sorts with the ability to manage them.
 * Shows up only when there are active filters or sorts.
 *
 * @example
 * ```tsx
 * <FiltersBar
 *   filterOptions={[{ id: 'status', label: 'Status', options: ['Active', 'Inactive'] }]}
 *   sortOptions={[{ id: 'name', label: 'Name' }]}
 *   sortDirections={['asc', 'desc']}
 *   filterHandlers={filterHandlers}
 *   t={t}
 *   // Optional: Enable view management
 *   viewManagement={viewManagement}
 * />
 * ```
 */

const renderFilterValues = <T extends object>(
  filter: FilterValue,
  filterOption: FilterOption<T>,
  onUpdateFilter: (type: keyof T, selectedValues: T[keyof T]) => void,
  filteredOptions?: CheckboxFilterOption['options']
) => {
  if (!onUpdateFilter) return null

  switch (filterOption.type) {
    case 'checkbox':
      return (
        <Checkbox<T>
          filter={filter}
          filterOption={{
            ...filterOption,
            options: filteredOptions || (filterOption as CheckboxFilterOption).options
          }}
          onUpdateFilter={onUpdateFilter}
        />
      )
    case 'calendar':
      return <Calendar<T> filter={filter} onUpdateFilter={onUpdateFilter} />
    case 'text':
      return <Text<T> filter={filter} onUpdateFilter={onUpdateFilter} />
    case 'number':
      return <Number<T> filter={filter} onUpdateFilter={onUpdateFilter} />
    default:
      return null
  }
}

const FiltersBar = <T extends object>({
  filterOptions,
  sortOptions,
  sortDirections,
  selectedFiltersCnt,
  openedFilter,
  setOpenedFilter,
  t,
  filterHandlers,
  viewManagement
}: FiltersBarProps<T>) => {
  const {
    activeFilters,
    activeSorts,
    handleUpdateSort,
    handleRemoveSort,
    handleSortChange,
    handleResetSorts,
    handleReorderSorts,
    searchQueries,
    handleSearchChange,
    filterToOpen,
    clearFilterToOpen
  } = filterHandlers

  const FilterV2 = useMemo(() => createFilters<T>(), [])

  return (
    <div className="mt-2 flex items-center gap-x-2">
      {!!activeSorts.length && (
        <Sorts
          activeSorts={activeSorts}
          handleSortChange={handleSortChange}
          handleUpdateSort={handleUpdateSort}
          handleRemoveSort={handleRemoveSort}
          handleResetSorts={handleResetSorts}
          sortOptions={sortOptions}
          sortDirections={sortDirections}
          searchQueries={searchQueries}
          handleSearchChange={handleSearchChange}
          handleReorderSorts={handleReorderSorts}
          filterToOpen={filterToOpen}
          onOpen={clearFilterToOpen}
        />
      )}

      {selectedFiltersCnt > 0 && activeSorts.length > 0 && <div className="bg-borders-1 h-7 w-px" />}
      <FilterV2.Content className={'flex w-full items-center gap-x-2'}>
        {filterOptions.map(filterOption => {
          return (
            <FilterV2.Component
              key={filterOption.value as string}
              filterKey={filterOption.value}
              parser={'parser' in filterOption ? filterOption.parser : undefined}
            >
              {({ onChange, removeFilter, value }) => {
                const activeFilterOption = {
                  type: filterOption.value,
                  selectedValues: value || [],
                  condition: ''
                }

                const onFilterValueChange = (_type: keyof T, selectedValues: T[keyof T]) => {
                  onChange(selectedValues)
                }

                return (
                  <FilterBoxWrapper<T>
                    filterKey={filterOption.value}
                    handleRemoveFilter={type => removeFilter(type)}
                    shouldOpen={openedFilter === filterOption.value}
                    filterLabel={filterOption.label}
                    valueLabel={getFilterDisplayValue<T>(filterOption, activeFilterOption)}
                  >
                    {renderFilterValues(activeFilterOption, filterOption, onFilterValueChange)}
                  </FilterBoxWrapper>
                )
              }}
            </FilterV2.Component>
          )
        })}

        <FilterV2.Dropdown className={'flex w-full'}>
          {(addFilter, availableFilters, resetFilters) => {
            const selectedFiltersCnt = filterOptions.length - availableFilters.length

            if (selectedFiltersCnt === 0) {
              return
            }

            return (
              <div className="ml-2.5 flex w-full items-center justify-between gap-x-4">
                <div className="flex items-center gap-x-4">
                  <FilterSelect
                    options={filterOptions}
                    dropdownAlign="start"
                    onChange={option => {
                      addFilter(option.value)
                      setOpenedFilter(option.value)
                    }}
                    inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
                    buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
                    displayLabel={
                      <FilterSelectAddIconLabel displayLabel={t('component:filter.defaultLabel', 'Filter')} />
                    }
                  />
                  <button
                    className="text-14 text-foreground-4 ring-offset-background hover:text-foreground-danger flex items-center gap-x-1.5 outline-none ring-offset-2 transition-colors duration-200 focus:ring-2"
                    onClick={() => {
                      resetFilters()
                    }}
                  >
                    <Icon className="rotate-45" name="plus" size={12} />
                    {t('component:filter.reset', 'Reset')}
                  </button>
                </div>

                {viewManagement && (
                  <Views
                    currentView={viewManagement.currentView}
                    savedViews={viewManagement.savedViews}
                    viewManagement={{
                      ...viewManagement,
                      activeFilters,
                      activeSorts,
                      saveView: (name: string) => viewManagement.saveView(name, activeFilters, activeSorts)
                    }}
                    hasChanges={!!viewManagement.hasActiveViewChanges(activeFilters, activeSorts)}
                  />
                )}
              </div>
            )
          }}
        </FilterV2.Dropdown>
      </FilterV2.Content>
    </div>
  )
}

export default FiltersBar
