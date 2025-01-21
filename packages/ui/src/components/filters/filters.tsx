import { useMemo, useState } from 'react'

import { TFunction } from 'i18next'

import { createFilters } from '@harnessio/filters'

import FilterSelect, { FilterSelectLabel } from './filter-select'
import ManageViews from './manage-views'
import FilterTrigger from './triggers/filter-trigger'
import ViewTrigger from './triggers/view-trigger'
import { FilterHandlers, FilterOption, SortOption, ViewLayoutOption, ViewManagement } from './types'

interface FiltersProps<T extends object> {
  showFilter?: boolean
  showSort?: boolean
  selectedFilters?: number
  setOpenedFilter: (filter: keyof T) => void
  filterOptions: FilterOption<T>[]
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
const Filters = <T extends object>({
  showFilter = true,
  showSort = true,
  filterOptions,
  setOpenedFilter,
  sortOptions,
  filterHandlers: { activeSorts, searchQueries, handleSearchChange, handleSortChange, handleResetSorts },
  viewManagement,
  layoutOptions,
  currentLayout,
  onLayoutChange,
  t
}: FiltersProps<T>) => {
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const FilterV2 = useMemo(() => createFilters<T>(), [])

  return (
    <>
      <div className="flex items-center gap-x-5">
        {showFilter && (
          <FilterV2.Dropdown className={'flex w-full'}>
            {(addFilter, availableFilters, resetFilters) => (
              <FilterSelect<T>
                options={filterOptions}
                onChange={option => {
                  addFilter(option.value)
                  setOpenedFilter(option.value)
                }}
                onReset={resetFilters}
                inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
                buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
                displayLabel={
                  <FilterSelectLabel
                    selectedFilters={filterOptions.length - availableFilters.length}
                    displayLabel={t('component:filter.defaultLabel', 'Filter')}
                  />
                }
              />
            )}
          </FilterV2.Dropdown>
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
