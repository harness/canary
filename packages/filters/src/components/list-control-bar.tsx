import { ReactNode } from 'react'

import { Button, FilterField, FilterOptionConfig, IconV2, type FiltersFieldProps } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

interface FiltersBarProps<T, V = T[keyof T], CustomValue = Record<string, unknown>> {
  openedFilter: string | undefined
  filterOptions: FilterOptionConfig<Extract<keyof T, string>, CustomValue>[]
  selectedFiltersCnt: number
  /** Hides the "Reset" control. */
  hideAddFilter?: boolean
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
  renderSelectedFilters,
  renderFilterOptions,
  hideAddFilter
}: FiltersBarProps<T, V, CustomValue>) => {
  const { t } = useTranslation()

  const filtersFieldRenderer = (
    props: Omit<FiltersFieldProps<Extract<keyof T, string>, V, CustomValue>, 'shouldOpenFilter' | 't'>
  ) => (
    <FilterField<Extract<keyof T, string>, V, CustomValue>
      {...props}
      shouldOpenFilter={props.filterOption.value === openedFilter}
    />
  )

  const filterOptionsRenderer = ({ resetFilters }: FilterOptionsRendererProps<Extract<keyof T, string>>) => {
    const showFilterResetButton = filterOptions.some(filterOption => !filterOption.isDefaultValue)

    return (
      <>
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

      {selectedFiltersCnt > 0 && !hideAddFilter && (
        <div className="flex items-center justify-between gap-x-cn-md">
          {renderFilterOptions(filterOptionsRenderer)}
        </div>
      )}
    </div>
  )
}

export default ListControlBar
