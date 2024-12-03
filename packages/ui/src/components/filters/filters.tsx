import { TFunction } from 'i18next'

import FilterTrigger from './filter-trigger'
import { FilterOption, SortOption } from './types'
import { UseFiltersReturn } from './use-filters'

interface FiltersProps {
  showFilter?: boolean
  showSort?: boolean
  filterOptions: FilterOption[]
  sortOptions: SortOption[]
  filterHandlers: Pick<
    UseFiltersReturn,
    | 'activeFilters'
    | 'activeSorts'
    | 'handleFilterChange'
    | 'handleSortChange'
    | 'handleResetFilters'
    | 'handleResetSorts'
    | 'searchQueries'
    | 'handleSearchChange'
  >
  t: TFunction
}

const Filters = ({
  showFilter = true,
  showSort = true,
  filterOptions,
  sortOptions,
  filterHandlers: {
    activeFilters,
    activeSorts,
    handleFilterChange,
    handleResetFilters,
    searchQueries,
    handleSearchChange,
    handleSortChange,
    handleResetSorts
  },
  t
}: FiltersProps) => {
  return (
    <div className="flex items-center gap-x-5">
      {showFilter && (
        <FilterTrigger
          type="filter"
          activeFilters={activeFilters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          searchQueries={searchQueries}
          onSearchChange={handleSearchChange}
          options={filterOptions}
          t={t}
        />
      )}

      {showSort && (
        <FilterTrigger
          type="sort"
          activeFilters={activeSorts}
          onChange={handleSortChange}
          onReset={handleResetSorts}
          searchQueries={searchQueries}
          onSearchChange={handleSearchChange}
          options={sortOptions}
          t={t}
        />
      )}
    </div>
  )
}

export default Filters
