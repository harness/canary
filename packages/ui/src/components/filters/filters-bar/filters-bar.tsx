import { Icon } from '@/components'
import { TFunction } from 'i18next'

import FilterTrigger from '../triggers/filter-trigger'
import { FilterHandlers, FilterOption, SortDirection, SortOption, ViewManagement } from '../types'
import Filters from './actions/filters'
import Sorts from './actions/sorts'
import Views from './actions/views'
import { createFilters, FilterRefType, stringArrayParser } from '@harnessio/filters'
import { useRef } from 'react'

interface RepoListFilters {
  name: string[]
  type: string[]
  stars: string[]
  created_time: string[]
}

interface FiltersBarProps {
  filterOptions: FilterOption[]
  sortOptions: SortOption[]
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

const FilterV2 = createFilters<RepoListFilters>()

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
const FiltersBar = ({
  filterOptions,
  sortOptions,
  sortDirections,
  t,
  filterHandlers,
  viewManagement
}: FiltersBarProps) => {
  const {
    activeFilters,
    activeSorts,
    handleUpdateFilter,
    handleRemoveFilter,
    handleFilterChange,
    handleUpdateCondition,
    handleUpdateSort,
    handleRemoveSort,
    handleSortChange,
    handleResetSorts,
    handleReorderSorts,
    handleResetAll,
    searchQueries,
    handleSearchChange,
    filterToOpen,
    clearFilterToOpen
  } = filterHandlers

  const filtersRef = useRef<FilterRefType<RepoListFilters>>(null)

  return (
    <div className="mt-2 flex items-center gap-x-2">
      <FilterV2 ref={filtersRef as any} view='dropdown'>
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
  
        {activeFilters.length > 0 && activeSorts.length > 0 && <div className="bg-borders-1 h-7 w-px" />}
        <FilterV2.Content className={"flex w-full"} >
          {filterOptions.map((filterOption) => {

            return (
              <FilterV2.Component key={filterOption.value} filterKey={filterOption.value as keyof RepoListFilters} parser={stringArrayParser}>
                {({onChange, removeFilter, value}) => {
                  const activeFilterOption = {
                    type: filterOption.value as keyof RepoListFilters,
                    selectedValues: value || [],
                  }
                  // Will be replaced by filter-box-wrapper
                  return <Filters
                    key={filterOption.type}
                    filter={activeFilterOption}
                    filterOptions={filterOptions}
                    handleUpdateFilter={(filterType, values) => {
                      handleUpdateFilter(filterType, values)
                      onChange(values)
                    }}
                    handleRemoveFilter={(type) => {
                      handleRemoveFilter(type)
                      removeFilter(type as keyof RepoListFilters)
                    }}
                    handleSearchChange={handleSearchChange}
                    searchQueries={searchQueries}
                    filterToOpen={filterToOpen}
                    onOpen={clearFilterToOpen}
                  />
                }}
              </FilterV2.Component>
              )
          })}

      <FilterV2.Dropdown className={"flex w-full"}>
        {(addFilter, _availableFilters) => {
       return <div className="ml-2.5 flex w-full items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-4">
            <FilterTrigger
              type="filter"
              customLabel={
                <div className="text-foreground-4 hover:text-foreground-1 flex items-center gap-x-1.5 transition-colors duration-200">
                  <Icon name="plus" size={10} />
                  <span>{t('component:filter.add-filter', 'Add filter')}</span>
                </div>
              }
              hideCount
              dropdownAlign="start"
              activeFilters={activeFilters}
              onChange={(value) => {
                handleFilterChange(value)
                addFilter(value.type as keyof RepoListFilters)
              }}
              searchQueries={searchQueries}
              onSearchChange={handleSearchChange}
              options={filterOptions}
              t={t}
            />
            <button
              className="text-14 text-foreground-4 ring-offset-background hover:text-foreground-danger flex items-center gap-x-1.5 outline-none ring-offset-2 transition-colors duration-200 focus:ring-2"
              onClick={() => {
                handleResetAll()
                filtersRef.current?.reset()
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
    }}
      </FilterV2.Dropdown>
        </FilterV2.Content>
      </FilterV2>
    </div>
  )
}

export default FiltersBar
