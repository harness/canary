import {
  ComponentProps,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

import { createFilters, FilterRefType } from '@harnessio/filters'

import { FilterOptionConfig, renderFilterSelectLabel } from '../filters'
import { Layout } from '../layout'
import { SearchInput } from '../inputs'
import { SearchableDropdown } from '../searchable-dropdown'
import { SimpleSort, Sort, SortValue } from '../sorts'
import * as ListActions from '../list-actions'
import { ListControlBar } from './list-control-bar'
import { SavedFilters } from './saved-filters'
import { SaveFiltersDialog, SaveFiltersDialogProps } from './save-filters-dialog'
import { useTranslation } from '../../context/translation-context'

interface FilterGroupProps<
  T extends Record<string, unknown>,
  V extends keyof T & string,
  CustomValue = Record<string, unknown>
> {
  onFilterSelectionChange?: (selectedFilters: (keyof T)[]) => void
  onFilterValueChange?: (filterType: T) => void
  handleFilterOpen?: (filter: V, isOpen: boolean) => void
  quickFiltersSlot?: ReactNode
  multiSortConfig?: Omit<ComponentProps<typeof Sort.Root>, 'children'>
  simpleSortConfig?: ComponentProps<typeof SimpleSort>
  searchValue?: string
  handleInputChange: (value: string) => void
  filterOptions: FilterOptionConfig<V, CustomValue>[]
  headerAction?: ReactNode
  savedFiltersConfig?: {
    savedFilterKey?: string
    savedFiltersOptions: { value: string; label: string }[]
    onSaveFilters: SaveFiltersDialogProps['onSubmit']
    getSavedFiltersValues: (savedFilterId: string) => Promise<T>
  }
}

export type FilterGroupRef = {
  resetSearch?: () => void
  resetFilters?: () => void
}

const FilterGroupInner = <
  T extends Record<string, unknown>,
  V extends Extract<keyof T, string>,
  CustomValue = Record<string, unknown>
>(
  props: FilterGroupProps<T, V, CustomValue>,
  ref: Ref<FilterGroupRef>
) => {
  const {
    onFilterSelectionChange,
    onFilterValueChange,
    searchValue,
    handleInputChange,
    filterOptions,
    multiSortConfig,
    simpleSortConfig,
    savedFiltersConfig,
    handleFilterOpen
  } = props

  const { t } = useTranslation()
  const {
    savedFilterKey = 'filterIdentifier',
    savedFiltersOptions,
    onSaveFilters,
    getSavedFiltersValues
  } = savedFiltersConfig ?? {}

  const FilterHandler = useMemo(() => createFilters<T>(), [])
  const filtersRef = useRef<FilterRefType<T> | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [openedFilter, setOpenedFilter] = useState<V>()
  const [selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)
  const [sortSelectionsCnt, setSortSelectionsCnt] = useState(0)

  useImperativeHandle(ref, () => {
    return {
      resetSearch: () => {
        if (searchRef.current) {
          searchRef.current.value = ''
        }
      },
      resetFilters: () => {
        if (filtersRef.current) {
          filtersRef.current.reset()
        }
      }
    }
  })

  // Create a wrapper function that matches the expected type
  const handleSetOpenedFilter = (filter: keyof T) => {
    setOpenedFilter(filter as V)
  }

  const onSortValueChange = (sort: SortValue[]) => {
    setSortSelectionsCnt(sort.length)
    multiSortConfig?.onSortChange?.(sort)
  }

  const renderMultiSort = (contents: ReactNode) => {
    if (multiSortConfig) {
      return (
        <Sort.Root {...multiSortConfig} onSortChange={onSortValueChange}>
          {contents}
        </Sort.Root>
      )
    }
    return contents
  }

  return (
    <FilterHandler
      ref={filtersRef}
      onFilterSelectionChange={(filterValues: (keyof T)[]) => {
        setSelectedFiltersCnt(filterValues.length)
        onFilterSelectionChange?.(filterValues)
      }}
      savedFiltersConfig={{
        getSavedFilters: (savedFilterId: string) => {
          return getSavedFiltersValues?.(savedFilterId)
        },
        savedFilterKey
      }}
      onChange={onFilterValueChange}
      view="dropdown"
    >
      {renderMultiSort(
        <>
          <ListActions.Root>
            <ListActions.Left className="min-w-0">
              <Layout.Horizontal gap="xs" align={'center'} justify={'start'} className="min-w-0 flex-1">
                <SearchInput
                  inputContainerClassName="max-w-80 flex-1"
                  ref={searchRef}
                  searchValue={searchValue || ''}
                  onChange={handleInputChange}
                  placeholder={t('views:repos.search', 'Search')}
                  autoFocus
                />
                {props.quickFiltersSlot}
                {filterOptions.length > 0 && (
                  <FilterHandler.Dropdown>
                    {(addFilter, availableFilters, resetFilters) => {
                      return (
                        <SearchableDropdown<FilterOptionConfig<V, CustomValue>>
                          options={filterOptions.filter(option => availableFilters.includes(option.value))}
                          onChange={option => {
                            addFilter(option.value)
                            setOpenedFilter(option.value)
                          }}
                          onReset={() => resetFilters()}
                          inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
                          buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
                          displayLabel={renderFilterSelectLabel({
                            selectedFilters: filterOptions.length - availableFilters.length,
                            displayLabel: t('component:filter.defaultLabel', 'Add filter')
                          })}
                        />
                      )
                    }}
                  </FilterHandler.Dropdown>
                )}
                {!!savedFiltersOptions?.length && (
                  <SavedFilters savedFilterKey={savedFilterKey} options={savedFiltersOptions} />
                )}
              </Layout.Horizontal>
            </ListActions.Left>
            <ListActions.Right>
              <Layout.Horizontal gap="xs">
                {multiSortConfig && (
                  <Sort.Select
                    displayLabel={t('component:sort.defaultLabel', 'Sort')}
                    buttonLabel={t('component:sort.resetSort', 'Reset sort')}
                  />
                )}
                {simpleSortConfig && <SimpleSort {...simpleSortConfig} />}
                {props.headerAction}
              </Layout.Horizontal>
            </ListActions.Right>
          </ListActions.Root>
          <>
            <ListControlBar<T, CustomValue, T[keyof T]>
              renderSelectedFilters={filterFieldRenderer => (
                <FilterHandler.Content className={'gap-x-cn-md flex items-center'}>
                  {filterOptions.map(filterOption => {
                    return (
                      <FilterHandler.Component<keyof T>
                        parser={filterOption.parser as any}
                        filterKey={filterOption.value}
                        sticky={filterOption.sticky}
                        defaultValue={filterOption.defaultValue as T[keyof T]}
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
                    <div className="gap-x-cn-md flex items-center">
                      {filterOptionsRenderer({ addFilter, resetFilters, availableFilters })}
                      {onSaveFilters && <SaveFiltersDialog onSubmit={onSaveFilters} />}
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
            />
          </>
        </>
      )}
    </FilterHandler>
  )
}

const FilterGroup = forwardRef(FilterGroupInner) as <
  T extends Record<string, unknown>,
  V extends Extract<keyof T, string>,
  CustomValue = Record<string, unknown>
>(
  props: FilterGroupProps<T, V, CustomValue> & { ref?: Ref<FilterGroupRef> }
) => ReactElement

export { FilterGroup }
export default FilterGroup
