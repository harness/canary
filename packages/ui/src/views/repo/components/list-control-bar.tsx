import { ReactNode } from 'react'

import { Button, Icon } from '@/components'
import { useTranslation } from '@/context'
import FilterSelect, { FilterSelectAddIconLabel } from '@components/filters/filter-select'
import FiltersField, { FiltersFieldProps } from '@components/filters/filters-field'
import { FilterOptionConfig } from '@components/filters/types'
import { cn } from '@utils/cn'

interface FiltersBarProps<T, V = T[keyof T], CustomValue = Record<string, unknown>> {
  openedFilter: string | undefined
  setOpenedFilter: (filter: keyof T) => void
  filterOptions: FilterOptionConfig<Extract<keyof T, string>, CustomValue>[]
  selectedFiltersCnt: number
  renderSelectedFilters: (
    filterFieldRenderer: (
      filterFieldConfig: Omit<FiltersFieldProps<Extract<keyof T, string>, V, CustomValue>, 'shouldOpenFilter' | 't'>
    ) => ReactNode
  ) => ReactNode
  sortSelectionsCnt?: number
  renderSelectedSort?: () => ReactNode
  renderFilterOptions: (
    filterOptionsRenderer: (filterFieldConfig: FilterOptionsRendererProps<Extract<keyof T, string>>) => ReactNode
  ) => ReactNode
}

interface FilterOptionsRendererProps<T> {
  addFilter: (filter: T) => void
  availableFilters: T[]
  resetFilters: () => void
}

const ListControlBar = <T extends Record<string, any>, CustomValue = Record<string, unknown>, V = T[keyof T]>({
  filterOptions,
  selectedFiltersCnt,
  openedFilter,
  sortSelectionsCnt,
  renderSelectedSort,
  setOpenedFilter,
  renderSelectedFilters,
  renderFilterOptions
}: FiltersBarProps<T, V, CustomValue>) => {
  const { t } = useTranslation()

  const filtersFieldRenderer = (
    props: Omit<FiltersFieldProps<Extract<keyof T, string>, V, CustomValue>, 'shouldOpenFilter' | 't'>
  ) => (
    <FiltersField<Extract<keyof T, string>, V, CustomValue>
      {...props}
      shouldOpenFilter={props.filterOption.value === openedFilter}
    />
  )

  const filterOptionsRenderer = ({
    addFilter,
    resetFilters,
    availableFilters
  }: FilterOptionsRendererProps<Extract<keyof T, string>>) => (
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
      <Button size="sm" variant="ghost" onClick={resetFilters} className="gap-x-1.5 hover:text-cn-foreground-danger">
        <Icon className="rotate-45" name="plus" size={12} />
        {t('component:filter.reset', 'Reset')}
      </Button>
    </>
  )

  const isListControlVisible = selectedFiltersCnt > 0 || (sortSelectionsCnt ?? 0) > 0

  return (
    <div className={cn('flex items-center gap-x-2', { 'mt-4': isListControlVisible })}>
      {renderSelectedSort?.()}
      {renderSelectedFilters(filtersFieldRenderer)}

      {selectedFiltersCnt > 0 && (
        <div className="ml-2.5 flex items-center justify-between gap-x-4">
          {renderFilterOptions(filterOptionsRenderer)}
        </div>
      )}
    </div>
  )
}

export default ListControlBar
