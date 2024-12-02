import { TFunction } from 'i18next'

import { Icon } from '../../icon'
import FilterTrigger from '../filter-trigger'
import { FilterOption, SortDirection, SortOption } from '../types'
import { UseFiltersReturn } from '../use-filters'
import Filters from './filters'
import Sorts from './sorts'

interface FiltersBarProps {
  filterOptions: FilterOption[]
  sortOptions: SortOption[]
  sortDirections: SortDirection[]
  t: TFunction
  filterHandlers: Pick<
    UseFiltersReturn,
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
    | 'handleSaveFilters'
    | 'handleClearSavedFilters'
    | 'hasUnsavedChanges'
  >
}

const FiltersBar = ({
  filterOptions,
  sortOptions,
  sortDirections,
  t,
  filterHandlers: {
    activeFilters,
    activeSorts,
    handleUpdateFilter,
    handleRemoveFilter,
    handleUpdateCondition,
    handleFilterChange,
    handleUpdateSort,
    handleRemoveSort,
    handleSortChange,
    handleResetSorts,
    handleReorderSorts,
    handleResetAll,
    searchQueries,
    handleSearchChange,
    filterToOpen,
    clearFilterToOpen,
    handleSaveFilters,
    handleClearSavedFilters,
    hasUnsavedChanges
  }
}: FiltersBarProps) => {
  if (activeFilters.length === 0 && activeSorts.length === 0) return null

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

      {(!!activeFilters.length || !!activeSorts.length) && (
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
              onClick={() => {
                handleResetAll()
                handleClearSavedFilters()
              }}
            >
              <Icon className="rotate-45" name="plus" size={12} />
              {t('component:filter.reset', 'Reset')}
            </button>
          </div>

          {hasUnsavedChanges && (
            <button
              className="flex items-center gap-x-1.5 text-14 text-foreground-4 hover:text-foreground-1"
              onClick={handleSaveFilters}
            >
              {t('component:filter.save', 'Save')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FiltersBar
