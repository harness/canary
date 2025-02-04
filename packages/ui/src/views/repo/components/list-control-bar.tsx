import { ReactElement } from 'react'

import { Icon } from '@/components'
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
    filterFieldRenderer: (filterFieldConfig: FilterFieldRendererProps<V>) => ReactElement
  ) => ReactElement
  renderFilterOptions: (
    filterOptionsRenderer: (filterFieldConfig: FilterOptionsRendererProps<T>) => ReactElement
  ) => ReactElement
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

interface FilterFieldRendererProps<T> {
  filterOption: FilterOptionConfig
  removeFilter: () => void
  onChange: FiltersFieldProps<T>['onChange']
  value?: T
}

interface FilterOptionsRendererProps<T> {
  addFilter: (filter: keyof T) => void
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

  const filtersFieldRenderer = ({ filterOption, removeFilter, onChange, value }: FilterFieldRendererProps<V>) => {
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

  const filterOptionsRenderer = ({ addFilter, resetFilters }: FilterOptionsRendererProps<T>) => (
    <>
      <FilterSelect
        options={filterOptions}
        dropdownAlign="start"
        onChange={(option: { value: any }) => {
          addFilter(option.value)
          setOpenedFilter(option.value)
        }}
        inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
        buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
        displayLabel={<FilterSelectAddIconLabel displayLabel={t('component:filter.defaultLabel', 'Filter')} />}
      />
      <button
        className="flex items-center gap-x-1.5 text-14 text-foreground-4 outline-none ring-offset-2 ring-offset-background transition-colors duration-200 hover:text-foreground-danger focus:ring-2"
        onClick={() => {
          resetFilters()
        }}
      >
        <Icon className="rotate-45" name="plus" size={12} />
        {t('component:filter.reset', 'Reset')}
      </button>
    </>
  )

  const isListControlVisible = selectedFiltersCnt > 0 || activeSorts.length > 0

  return (
    <div className={cn('flex items-center gap-x-2', { 'mt-2': isListControlVisible })}>
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

      {selectedFiltersCnt > 0 && activeSorts.length > 0 && <div className="h-7 w-px bg-borders-1" />}
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
