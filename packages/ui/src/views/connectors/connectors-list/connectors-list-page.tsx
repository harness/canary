import { FC, useState } from 'react'

import { Button, NoData, Pagination, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'
import FilterGroup from '@views/components/FilterGroup'

import { ConnectorsList } from './connectors-list'
import { getConnectorListFilterOptions } from './filter-options'
import { ConnectorListFilters, ConnectorListPageProps } from './types'

type ConnectorListFiltersKeys = keyof ConnectorListFilters

// const ConnectorListFilterHandler = createFilters<ConnectorListFilters>()

const ConnectorListPage: FC<ConnectorListPageProps> = ({
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
  // const filterHandlers = useFilters()
  const [_selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)
  // const [openedFilter, setOpenedFilter] = useState<ConnectorListFiltersKeys>()
  // const filtersRef = useRef<FilterRefType<ConnectorListFilters> | null>(null)

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

  // const handleFilterOpen = (filter: ConnectorListFiltersKeys, isOpen: boolean) => {
  //   setOpenedFilter(isOpen ? filter : undefined)
  // }

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
        <h1 className="text-24 font-medium leading-snug tracking-tight text-foreground-1">Connectors</h1>
        <Spacer size={6} />
        <FilterGroup<ConnectorListFilters, keyof ConnectorListFilters>
          onFilterSelectionChange={onFilterSelectionChange}
          onFilterValueChange={onFilterValueChange}
          searchInput={searchInput}
          handleInputChange={handleInputChange}
          headerAction={<Button variant="default">{t('views:connectors.createNew', 'Create new connector')}</Button>}
          t={t}
          filterOptions={CONNECTOR_FILTER_OPTIONS}
        />
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

export { ConnectorListPage }
