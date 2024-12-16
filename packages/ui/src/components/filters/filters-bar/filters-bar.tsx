import { Icon } from '@/components'
import { TFunction } from 'i18next'

import FilterTrigger from '../triggers/filter-trigger'
import { FilterHandlers, FilterOption, SortDirection, SortOption, ViewManagement } from '../types'
import Filters from './actions/filters'
import Sorts from './actions/sorts'
import Views from './actions/views'

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

  const hasActiveFilters = !!activeFilters.length || !!activeSorts.length

  if (!hasActiveFilters) return null

  return (
    <div className="flex items-center gap-x-2">
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

      {activeFilters.length > 0 && activeSorts.length > 0 && <div className="h-7 w-px bg-borders-1" />}

      {activeFilters.map(filter => (
        <Filters
          key={filter.type}
          filter={filter}
          filterOptions={filterOptions}
          handleUpdateFilter={handleUpdateFilter}
          handleRemoveFilter={handleRemoveFilter}
          handleUpdateCondition={handleUpdateCondition}
          handleSearchChange={handleSearchChange}
          searchQueries={searchQueries}
          filterToOpen={filterToOpen}
          onOpen={clearFilterToOpen}
        />
      ))}

      {hasActiveFilters && (
        <div className="ml-2.5 flex w-full items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-4">
            <FilterTrigger
              type="filter"
              customLabel={
                <div className="flex items-center gap-x-1.5 text-foreground-4 transition-colors duration-200 hover:text-foreground-1">
                  <Icon name="plus" size={10} />
                  <span>{t('component:filter.add-filter', 'Add filter')}</span>
                </div>
              }
              hideCount
              dropdownAlign="start"
              activeFilters={activeFilters}
              onChange={handleFilterChange}
              searchQueries={searchQueries}
              onSearchChange={handleSearchChange}
              options={filterOptions}
              t={t}
            />
            <button
              className="flex items-center gap-x-1.5 text-14 text-foreground-4 outline-none ring-offset-2 ring-offset-background transition-colors duration-200 hover:text-foreground-danger focus:ring-2"
              onClick={handleResetAll}
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
