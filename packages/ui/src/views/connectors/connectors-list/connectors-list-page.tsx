import { FC, ReactNode, useRef, useState } from 'react'

import { Button, ListActions, NoData, Pagination, SearchBox, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'
import FilterSelect, { FilterSelectLabel } from '@components/filters/filter-select'
import FilterTrigger from '@components/filters/triggers/filter-trigger'
import { cn } from '@utils/cn'
import ListControlBar from '@views/repo/components/list-control-bar'
import { useFilters } from '@views/repo/hooks'

import { createFilters, FilterRefType } from '@harnessio/filters'

import { ConnectorsList } from './connectors-list'
import { getConnectorListFilterOptions } from './filter-options'
import { ConnectorListFilters, ConnectorListPageProps } from './types'

type ConnectorListFiltersKeys = keyof ConnectorListFilters

const ConnectorListFilterHandler = createFilters<ConnectorListFilters>()

const ConnectorsListPage: FC<ConnectorListPageProps> = ({
  searchQuery,
  setSearchQuery,
  isError,
  errorMessage,
  useTranslationStore,
  currentPage,
  totalPages,
  goToPage,
  isLoading,
  connectors,
  onFilterChange,
  ...props
}) => {
  const { t } = useTranslationStore()
  const { navigate } = useRouterContext()
  const filterHandlers = useFilters()
  const [selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)
  const [openedFilter, setOpenedFilter] = useState<ConnectorListFiltersKeys>()
  const filtersRef = useRef<FilterRefType<ConnectorListFilters> | null>(null)

  const CONNECTOR_FILTER_OPTIONS = getConnectorListFilterOptions(t)

  const { search: searchInput, handleSearchChange: handleInputChange } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : undefined),
    searchValue: searchQuery || ''
  })

  const onFilterSelectionChange = (filterValues: ConnectorListFiltersKeys[]) => {
    setSelectedFiltersCnt(filterValues.length)
  }

  const onFilterValueChange = (filterValues: ConnectorListFilters) => {
    // Pass filter values to parent component if onFilterChange is provided
    onFilterChange?.(filterValues)
  }

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        iconName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', {
          type: 'connectors'
        })}
        description={[
          errorMessage ||
            t(
              'views:noData.errorApiDescription',
              'An error occurred while loading the data. Please try again and reload the page.'
            )
        ]}
        primaryButton={{
          label: t('views:notFound.button', 'Reload page'),
          onClick: () => {
            navigate(0) // Reload the page
          }
        }}
      />
    )
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !connectors.length && !searchQuery })}>
        <h1 className="text-24 font-medium leading-snug tracking-tight text-cn-foreground-1">Connectors</h1>
        <Spacer size={6} />
        <ConnectorListFilterHandler
          ref={filtersRef}
          onFilterSelectionChange={onFilterSelectionChange}
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
              <ConnectorListFilterHandler.Dropdown>
                {(addFilter, availableFilters, resetFilters) => (
                  <FilterSelect<ConnectorListFiltersKeys>
                    options={CONNECTOR_FILTER_OPTIONS.filter(option => availableFilters.includes(option.value))}
                    onChange={option => {
                      addFilter(option.value)
                      setOpenedFilter(option.value)
                    }}
                    onReset={resetFilters}
                    inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
                    buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
                    displayLabel={
                      <FilterSelectLabel
                        selectedFilters={CONNECTOR_FILTER_OPTIONS.length - availableFilters.length}
                        displayLabel={t('component:filter.defaultLabel', 'Filter')}
                      />
                    }
                  />
                )}
              </ConnectorListFilterHandler.Dropdown>
              <Button variant="default">{t('views:connectors.createNew', 'Create new connector')}</Button>
            </ListActions.Right>
          </ListActions.Root>
          <>
            <Spacer size={4} />
            <ListControlBar<ConnectorListFilters>
              renderSelectedFilters={filterFieldRenderer => (
                <ConnectorListFilterHandler.Content className={'flex items-center gap-x-2'}>
                  {CONNECTOR_FILTER_OPTIONS.map(filterOption => {
                    return (
                      <ConnectorListFilterHandler.Component
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
                              // handleFilterOpen?.(filterOption.value, isOpen)
                            }
                          })
                        }
                      </ConnectorListFilterHandler.Component>
                    )
                  })}
                </ConnectorListFilterHandler.Content>
              )}
              openedFilter={openedFilter}
              setOpenedFilter={setOpenedFilter}
              filterOptions={CONNECTOR_FILTER_OPTIONS}
              sortOptions={[]}
              selectedFiltersCnt={0}
              renderFilterOptions={filterOptionsRenderer => (
                <ConnectorListFilterHandler.Dropdown>
                  {(addFilter, availableFilters, resetFilters) => (
                    <div className="flex items-center gap-x-4">
                      {filterOptionsRenderer({ addFilter, resetFilters, availableFilters })}
                    </div>
                  )}
                </ConnectorListFilterHandler.Dropdown>
              )}
              sortDirections={[]}
              t={t}
              filterHandlers={filterHandlers}
            />
          </>
        </ConnectorListFilterHandler>
        <Spacer size={4} />
        <ConnectorsList
          connectors={connectors}
          useTranslationStore={useTranslationStore}
          isLoading={isLoading}
          {...props}
        />
        <Spacer size={8} />
        <Pagination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ConnectorsListPage }
