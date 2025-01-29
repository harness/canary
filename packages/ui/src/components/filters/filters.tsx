import { useState } from 'react'

import { TFunction } from 'i18next'

import ManageViews from './manage-views'
import FilterTrigger from './triggers/filter-trigger'
import ViewTrigger from './triggers/view-trigger'
import { FilterHandlers, FilterOption, SortOption, ViewLayoutOption, ViewManagement } from './types'

interface FiltersProps {
  showFilter?: boolean
  showSort?: boolean
  filterOptions: FilterOption[]
  sortOptions: SortOption[]
  filterHandlers: Pick<
    FilterHandlers,
    | 'activeFilters'
    | 'activeSorts'
    | 'handleFilterChange'
    | 'handleResetFilters'
    | 'searchQueries'
    | 'handleSearchChange'
    | 'handleSortChange'
    | 'handleResetSorts'
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
    | 'validateViewName'
    | 'hasViewErrors'
    | 'hasViewListChanges'
    | 'applyView'
    | 'setCurrentView'
    | 'updateViewsOrder'
    | 'prepareViewsForSave'
    | 'getExistingNames'
    | 'validateViewNameChange'
  >
  layoutOptions?: ViewLayoutOption[]
  currentLayout?: string
  onLayoutChange?: (layout: string) => void
  t: TFunction
}

/**
 * Filters component for handling filtering, sorting, and view management
 * @example
 * ```tsx
 * <Filters
 *   filterOptions={[
 *     { id: 'status', label: 'Status', options: ['Active', 'Inactive'] },
 *     { id: 'type', label: 'Type', options: ['Public', 'Private'] }
 *   ]}
 *   sortOptions={[
 *     { id: 'name', label: 'Name' },
 *     { id: 'date', label: 'Date' }
 *   ]}
 *   filterHandlers={filterHandlers}
 *   // Optional: Enable view management
 *   viewManagement={viewManagement}
 *   t={t}
 * />
 * ```
 */
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

        {viewManagement && (!!viewManagement.savedViews.length || !!layoutOptions?.length) && (
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

      {viewManagement && (
        <ManageViews
          open={isManageDialogOpen}
          onOpenChange={setIsManageDialogOpen}
          views={viewManagement.savedViews}
          viewManagement={viewManagement}
        />
      )}
    </>
  )
}

export default Filters
