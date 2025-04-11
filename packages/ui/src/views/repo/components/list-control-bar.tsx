import { ReactNode } from 'react'

import { Button, Icon } from '@/components'
import FilterSelect, { FilterSelectAddIconLabel } from '@components/filters/filter-select'
import Sorts from '@components/filters/filters-bar/actions/sorts'
import FiltersField, { FiltersFieldProps } from '@components/filters/filters-field'
import { FilterHandlers, FilterOptionConfig, SortDirection, SortOption } from '@components/filters/types'
import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

interface FiltersBarProps<T, V> {
  openedFilter: string | undefined
  setOpenedFilter: (filter: keyof T) => void
  filterOptions: FilterOptionConfig[]
  sortOptions: SortOption[]
  selectedFiltersCnt: number
  renderSelectedFilters: (
    filterFieldRenderer: (filterFieldConfig: Omit<FiltersFieldProps<V>, 'shouldOpenFilter' | 't'>) => ReactNode
  ) => ReactNode
  renderFilterOptions: (
    filterOptionsRenderer: (filterFieldConfig: FilterOptionsRendererProps<keyof T>) => ReactNode
  ) => ReactNode
  sortDirections: SortDirection[]
  t: TFunction
  filterHandlers: Pick<
    FilterHandlers,
    | 'activeSorts'
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
}

interface FilterOptionsRendererProps<T> {
  addFilter: (filter: T) => void
  availableFilters: T[]
  resetFilters: () => void
}

const ListControlBar = <T extends Record<string, any>, V = T[keyof T]>({
  filterOptions,
  sortOptions,
  selectedFiltersCnt,
  sortDirections,
  openedFilter,
  setOpenedFilter,
  t,
  renderSelectedFilters,
  renderFilterOptions,
  filterHandlers
}: FiltersBarProps<T, V>) => {
  const {
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

  const filtersFieldRenderer = (props: Omit<FiltersFieldProps<V>, 'shouldOpenFilter' | 't'>) => (
    <FiltersField {...props} shouldOpenFilter={props.filterOption.value === openedFilter} t={t} />
  )

  const filterOptionsRenderer = ({
    addFilter,
    resetFilters,
    availableFilters
  }: FilterOptionsRendererProps<keyof T>) => (
    <>
      <FilterSelect
        options={filterOptions.filter(option => availableFilters.includes(option.value))}
        dropdownAlign="start"
        onChange={(option: { value: any }) => {
          addFilter(option.value)
          setOpenedFilter(option.value)
        }}
        inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
        buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
        displayLabel={<FilterSelectAddIconLabel displayLabel={t('component:filter.defaultLabel', 'Filter')} />}
      />
      <Button
        size="xs"
        variant="ghost"
        onClick={resetFilters}
        className="gap-x-1.5 hover:bg-transparent hover:text-cn-foreground-danger"
      >
        <Icon className="rotate-45" name="plus" size={12} />
        {t('component:filter.reset', 'Reset')}
      </Button>
    </>
  )

  const isListControlVisible = selectedFiltersCnt > 0 || activeSorts.length > 0

  return (
    <div className={cn('flex items-center gap-x-2', { 'mt-4': isListControlVisible })}>
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

      {selectedFiltersCnt > 0 && activeSorts.length > 0 && <div className="bg-cn-background-2 h-7 w-px" />}
      {renderSelectedFilters(filtersFieldRenderer)}

      {selectedFiltersCnt > 0 && (
        <div className="ml-2.5 flex w-full items-center justify-between gap-x-4">
          {renderFilterOptions(filterOptionsRenderer)}
        </div>
      )}
    </div>
  )
}

export default ListControlBar
