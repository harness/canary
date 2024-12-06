import { useState } from 'react'

import { TFunction } from 'i18next'

import ManageViews from './manage-views'
import FilterTrigger from './triggers/filter-trigger'
import ViewTrigger from './triggers/view-trigger'
import { FilterHandlers, FilterOption, SortOption, ViewLayoutOption, ViewManagement } from './types'

interface FiltersProps {
  showFilter?: boolean
  showSort?: boolean
  showView?: boolean
  filterOptions: FilterOption[]
  sortOptions: SortOption[]
  filterHandlers: FilterHandlers
  viewManagement: ViewManagement
  layoutOptions?: ViewLayoutOption[]
  currentLayout?: string
  onLayoutChange?: (layout: string) => void
  t: TFunction
}

const Filters = ({
  showFilter = true,
  showSort = true,
  showView = true,
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
  viewManagement,
  layoutOptions,
  currentLayout,
  onLayoutChange,
  t
}: FiltersProps) => {
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)

  return (
    <>
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

        {showView && (
          <ViewTrigger
            savedViews={viewManagement.savedViews}
            currentView={viewManagement.currentView}
            layoutOptions={layoutOptions}
            currentLayout={currentLayout}
            onLayoutChange={onLayoutChange ?? (() => {})}
            onManageClick={() => setIsManageDialogOpen(true)}
            onViewSelect={viewManagement.applyView}
          />
        )}
      </div>

      <ManageViews
        open={isManageDialogOpen}
        onOpenChange={setIsManageDialogOpen}
        views={viewManagement.savedViews}
        viewManagement={viewManagement}
      />
    </>
  )
}

export default Filters
