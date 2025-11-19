import { ReactNode } from 'react'

import {
  Button,
  FilterOptionConfig,
  FiltersField,
  FiltersFieldProps,
  IconV2,
  renderFilterSelectAddIconLabel,
  SearchableDropdown
} from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

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
  }: FilterOptionsRendererProps<Extract<keyof T, string>>) => {
    const showFilterResetButton = filterOptions.some(filterOption => !filterOption.isDefaultValue)

    return (
      <>
        <SearchableDropdown
          options={filterOptions.filter(option => availableFilters.includes(option.value))}
          dropdownAlign="start"
          onChange={(option: { value: any }) => {
            addFilter(option.value)
            setOpenedFilter(option.value)
          }}
          onReset={() => resetFilters()}
          inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
          buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
          displayLabel={renderFilterSelectAddIconLabel({ displayLabel: t('component:filter.defaultLabel', 'Filter') })}
        />
        {showFilterResetButton && (
          <Button variant="transparent" onClick={() => resetFilters()} className="hover:text-cn-danger">
            <IconV2 name="xmark" />
            {t('component:filter.reset', 'Reset')}
          </Button>
        )}
      </>
    )
  }

  const isListControlVisible = selectedFiltersCnt > 0 || (sortSelectionsCnt ?? 0) > 0

  return (
    <div className={cn('flex items-center gap-x-cn-md', { 'mt-cn-sm': isListControlVisible })}>
      {renderSelectedSort?.()}
      {renderSelectedFilters(filtersFieldRenderer)}

      {selectedFiltersCnt > 0 && (
        <div className="flex items-center justify-between gap-x-cn-md">
          {renderFilterOptions(filterOptionsRenderer)}
        </div>
      )}
    </div>
  )
}

export default ListControlBar
