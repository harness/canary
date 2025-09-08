import { FC, useState } from 'react'

import { Button, IconV2, NoData, Pagination, Spacer, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'
import FilterGroup from '@views/components/FilterGroup'

import { ConnectorsList } from './connectors-list'
import { CONNECTOR_SORT_OPTIONS, getConnectorListFilterOptions } from './filter-options'
import { ConnectorListFilters, ConnectorListPageProps } from './types'

type ConnectorListFiltersKeys = keyof ConnectorListFilters

const ConnectorsListPage: FC<ConnectorListPageProps> = ({
  searchQuery,
  setSearchQuery,
  isError,
  errorMessage,
  currentPage,
  totalItems,
  pageSize,
  goToPage,
  isLoading,
  connectors,
  onSortChange,
  connectorStats,
  onFilterChange,
  onCreate,
  ...props
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()
  const [_selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)

  const connectorTypeOptions =
    connectorStats?.typeStats?.map(typeStat => ({
      label: `${typeStat.type || ''} (${typeStat.count || 0})`,
      value: typeStat.type || ''
    })) || []

  const CONNECTOR_FILTER_OPTIONS = getConnectorListFilterOptions(t, connectorTypeOptions)
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
        imageName="no-data-error"
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
          label: (
            <>
              <IconV2 name="refresh" />
              {t('views:notFound.button', 'Reload Page')}
            </>
          ),
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
        <Text as="h1" variant="heading-section">
          Connectors
        </Text>
        <Spacer size={7} />
        <FilterGroup<ConnectorListFilters, keyof ConnectorListFilters>
          simpleSortConfig={{
            sortOptions: CONNECTOR_SORT_OPTIONS,
            onSortChange,
            defaultSort: 'lastModifiedAt,DESC'
          }}
          onFilterSelectionChange={onFilterSelectionChange}
          onFilterValueChange={onFilterValueChange}
          handleInputChange={(value: string) => setSearchQuery(value)}
          headerAction={
            <Button onClick={onCreate}>
              <IconV2 name="plus" />
              {t('views:connectors.createNew', 'Create Connector')}
            </Button>
          }
          filterOptions={CONNECTOR_FILTER_OPTIONS}
        />
        <Spacer size={4.5} />
        <ConnectorsList connectors={connectors} isLoading={isLoading} {...props} />
        <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ConnectorsListPage }
