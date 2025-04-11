import { ReactNode, useMemo, useRef, useState } from 'react'

import { ListActions, SearchBox } from '@/components'
import FilterSelect, { FilterSelectLabel } from '@components/filters/filter-select'
import { FilterOptionConfig } from '@components/filters/types'
import ListControlBar from '@views/repo/components/list-control-bar'
import { useFilters } from '@views/repo/hooks'
import { TFunction } from 'i18next'

import { createFilters, FilterRefType } from '@harnessio/filters'

interface FilterGroupProps<T extends Record<string, unknown>, V extends keyof T & string> {
  onFilterSelectionChange?: (selectedFilters: (keyof T)[]) => void
  onFilterValueChange?: (filterType: T) => void
  handleFilterOpen?: (filter: V, isOpen: boolean) => void
  searchInput: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  t: TFunction
  filterOptions: FilterOptionConfig<V>[]
  headerAction?: ReactNode
}

const FilterGroup = <T extends Record<string, unknown>, V extends keyof T & string>(props: FilterGroupProps<T, V>) => {
  const {
    onFilterSelectionChange,
    onFilterValueChange,
    searchInput,
    handleInputChange,
    t,
    filterOptions,
    handleFilterOpen
  } = props

  const FilterHandler = useMemo(() => createFilters<T>(), [])
  const filtersRef = useRef<FilterRefType<T> | null>(null)
  const [openedFilter, setOpenedFilter] = useState<V>()
  const [selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)
  const filterHandlers = useFilters()

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
      <ListActions.Root>
        <ListActions.Left>
          <SearchBox.Root
            width="full"
            className="max-w-96"
            value={searchInput}
            handleChange={handleInputChange}
            placeholder={t('views:search', 'Search')}
          />
        </ListActions.Left>
        <ListActions.Right>
          <FilterHandler.Dropdown>
            {(addFilter, availableFilters, resetFilters) => {
              return (
                <FilterSelect<V>
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
          {props.headerAction}
        </ListActions.Right>
      </ListActions.Root>
      <>
        <ListControlBar<T>
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
              {(addFilter, availableFilters, resetFilters) => (
                <div className="flex items-center gap-x-4">
                  {filterOptionsRenderer({ addFilter, resetFilters, availableFilters })}
                </div>
              )}
            </FilterHandler.Dropdown>
          )}
          openedFilter={openedFilter}
          setOpenedFilter={value => setOpenedFilter(value as V)}
          filterOptions={filterOptions}
          sortOptions={[]}
          selectedFiltersCnt={selectedFiltersCnt}
          sortDirections={[]}
          t={t}
          filterHandlers={filterHandlers}
        />
      </>
    </FilterHandler>
  )
}

export default FilterGroup
