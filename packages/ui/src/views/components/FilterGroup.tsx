import { ComponentProps, ReactNode, useMemo, useRef, useState } from 'react'

import { ListActions, SearchBox } from '@/components'
import FilterSelect, { FilterSelectLabel } from '@components/filters/filter-select'
import { FilterOptionConfig } from '@components/filters/types'
import { Sort, SortValue } from '@components/sorts'
import ListControlBar from '@views/repo/components/list-control-bar'
import { TFunction } from 'i18next'

import { createFilters, FilterRefType } from '@harnessio/filters'

interface FilterGroupProps<
  T extends Record<string, unknown>,
  V extends keyof T & string,
  CustomValue = Record<string, unknown>
> {
  onFilterSelectionChange?: (selectedFilters: (keyof T)[]) => void
  onFilterValueChange?: (filterType: T) => void
  handleFilterOpen?: (filter: V, isOpen: boolean) => void
  searchInput: string
  sortConfig: Omit<ComponentProps<typeof Sort.Root>, 'children'>
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  t: TFunction
  filterOptions: FilterOptionConfig<V, CustomValue>[]
  headerAction?: ReactNode
}

const FilterGroup = <
  T extends Record<string, unknown>,
  V extends Extract<keyof T, string>,
  CustomValue = Record<string, unknown>
>(
  props: FilterGroupProps<T, V, CustomValue>
) => {
  const {
    onFilterSelectionChange,
    onFilterValueChange,
    searchInput,
    handleInputChange,
    t,
    filterOptions,
    sortConfig,
    handleFilterOpen
  } = props

  const FilterHandler = useMemo(() => createFilters<T>(), [])
  const filtersRef = useRef<FilterRefType<T> | null>(null)
  const [openedFilter, setOpenedFilter] = useState<V>()
  const [selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)
  const [sortSelectionsCnt, setSortSelectionsCnt] = useState(0)

  // Create a wrapper function that matches the expected type
  const handleSetOpenedFilter = (filter: keyof T) => {
    setOpenedFilter(filter as V)
  }

  const onSortValueChange = (sort: SortValue[]) => {
    setSortSelectionsCnt(sort.length)
    sortConfig.onSortChange?.(sort)
  }

  return (
    <FilterHandler
      ref={filtersRef}
      onFilterSelectionChange={(filterValues: (keyof T)[]) => {
        setSelectedFiltersCnt(filterValues.length)
        onFilterSelectionChange?.(filterValues)
      }}
      onChange={onFilterValueChange}
      view="dropdown"
    >
      <Sort.Root {...sortConfig} onSortChange={onSortValueChange}>
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root
              width="full"
              className="max-w-80"
              value={searchInput}
              handleChange={handleInputChange}
              placeholder={t('views:search', 'Search')}
              // inputClassName="bg-cn-background-1"
            />
          </ListActions.Left>
          <ListActions.Right>
            <FilterHandler.Dropdown>
              {(addFilter, availableFilters, resetFilters) => {
                return (
                  <FilterSelect<V, CustomValue>
                    options={filterOptions.filter(option => availableFilters.includes(option.value))}
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
                )
              }}
            </FilterHandler.Dropdown>
            <Sort.Select
              displayLabel={t('component:sort.defaultLabel', 'Sort')}
              buttonLabel={t('component:sort.resetSort', 'Reset sort')}
            />
            {props.headerAction}
          </ListActions.Right>
        </ListActions.Root>
        <>
          <ListControlBar<T, CustomValue, T[keyof T]>
            renderSelectedFilters={filterFieldRenderer => (
              <FilterHandler.Content className={'flex items-center gap-x-2'}>
                {filterOptions.map(filterOption => {
                  return (
                    <FilterHandler.Component<keyof T>
                      parser={filterOption.parser as any}
                      filterKey={filterOption.value}
                      key={filterOption.value}
                    >
                      {({ onChange, removeFilter, value }) =>
                        filterFieldRenderer({
                          filterOption,
                          onChange,
                          removeFilter,
                          value: value,
                          onOpenChange: isOpen => {
                            handleFilterOpen?.(filterOption.value, isOpen)
                          }
                        })
                      }
                    </FilterHandler.Component>
                  )
                })}
              </FilterHandler.Content>
            )}
            renderFilterOptions={filterOptionsRenderer => (
              <FilterHandler.Dropdown>
                {(addFilter, availableFilters: Extract<keyof T, string>[], resetFilters) => (
                  <div className="flex items-center gap-x-4">
                    {filterOptionsRenderer({ addFilter, resetFilters, availableFilters })}
                  </div>
                )}
              </FilterHandler.Dropdown>
            )}
            sortSelectionsCnt={sortSelectionsCnt}
            renderSelectedSort={() => <Sort.MultiSort />}
            openedFilter={openedFilter}
            setOpenedFilter={handleSetOpenedFilter}
            filterOptions={filterOptions}
            selectedFiltersCnt={selectedFiltersCnt}
            t={t}
          />
        </>
      </Sort.Root>
    </FilterHandler>
  )
}

export default FilterGroup
