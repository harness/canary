import { FC } from 'react'

import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { IconV2, ListActions, NoData, Pagination, SearchBox } from '@components/index'
import { useDebounceSearch } from '@hooks/use-debounce-search'

import ConnectorDetailsReferenceList from './connector-details-references-list'
import { ConnectorDetailsReferenceProps } from './types'

const ConnectorDetailsReference: FC<ConnectorDetailsReferenceProps> = ({
  searchQuery,
  setSearchQuery,
  apiConnectorRefError,
  currentPage,
  totalItems,
  pageSize,
  goToPage,
  isLoading,
  connectorReferences
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()

  const { search: searchInput, handleSearchChange: handleInputChange } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : undefined),
    searchValue: searchQuery || ''
  })

  if (apiConnectorRefError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', {
          type: 'entities'
        })}
        description={[
          apiConnectorRefError ||
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
    <SandboxLayout.Content className="h-full px-0">
      <ListActions.Root className="pb-4">
        <ListActions.Left>
          <SearchBox.Root
            width="full"
            className="max-w-96"
            value={searchInput}
            handleChange={handleInputChange}
            placeholder={t('views:search', 'Search')}
          />
        </ListActions.Left>
      </ListActions.Root>
      <ConnectorDetailsReferenceList connectorReferences={connectorReferences} isLoading={isLoading} />
      <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} />
    </SandboxLayout.Content>
  )
}

export { ConnectorDetailsReference }
