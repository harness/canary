import { ReactElement } from 'react'

import { Icon } from '@/components'
import { TFunction } from 'i18next'

import FilterSelect, { FilterSelectAddIconLabel } from '../filter-select'
import FiltersField from '../filters-field'
import { FilterHandlers, FilterOption, SortDirection, SortOption, ViewManagement } from '../types'
import Sorts from './actions/sorts'
import Views from './actions/views'

interface FiltersBarProps<T extends object> {
  openedFilter: keyof T | undefined
  setOpenedFilter: (filter: keyof T) => void
  addFilter: (filter: keyof T) => void
  resetFilters: () => void
  filterOptions: FilterOption<T>[]
  sortOptions: SortOption[]
  selectedFiltersCnt: number
  renderSelectedFilters: (
    filterFieldRenderer: (filterFieldConfig: FilterFieldRendererProps<T>) => ReactElement
  ) => ReactElement
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

interface FilterFieldRendererProps<T extends object> {
  filterOption: FilterOption<T>
  removeFilter: () => void
  onChange: (value: T[keyof T]) => void
  value: T[keyof T]
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

const FiltersBar = <T extends object>({
  filterOptions,
  sortOptions,
  addFilter,
  resetFilters,
  selectedFiltersCnt,
  sortDirections,
  openedFilter,
  setOpenedFilter,
  t,
  renderSelectedFilters,
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

  const filtersFieldRenderer = ({ filterOption, removeFilter, onChange, value }: FilterFieldRendererProps<T>) => {
    return (
      <FiltersField
        shouldOpenFilter={filterOption.value === openedFilter}
        filterOption={filterOption}
        removeFilter={removeFilter}
        onChange={onChange}
        value={value}
      />
    )
  }

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
      {renderSelectedFilters(filtersFieldRenderer)}

      {selectedFiltersCnt > 0 && (
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
              displayLabel={<FilterSelectAddIconLabel displayLabel={t('component:filter.defaultLabel', 'Filter')} />}
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
      )}
    </div>
  )
}

export default FiltersBar
