import { FC } from 'react'

import { useRouterContext } from '@/context'
import { ListActions, NoData, Pagination, SearchBox } from '@components/index'
import { Spacer } from '@components/spacer'
import { useDebounceSearch } from '@hooks/use-debounce-search'

import ConnectorDetailsReferenceList from './connector-details-references-list'
import { ConnectorDetailsReferenceProps } from './types'

const ConnectorDetailsReference: FC<ConnectorDetailsReferenceProps> = ({
  searchQuery,
  setSearchQuery,
  apiConnectorRefError,
  useTranslationStore,
  currentPage,
  totalItems,
  pageSize,
  goToPage,
  isLoading,
  entities,
  toEntity,
  toScope,
  ...props
}) => {
  const { t } = useTranslationStore()
  const { navigate } = useRouterContext()

  const { search: searchInput, handleSearchChange: handleInputChange } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : undefined),
    searchValue: searchQuery || ''
  })

  if (apiConnectorRefError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        iconName="no-data-error"
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
          label: t('views:notFound.button', 'Reload page'),
          onClick: () => {
            navigate(0) // Reload the page
          }
        }}
      />
    )
  }

  return (
    <div>
      <Spacer size={6} />
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
      </ListActions.Root>
      <Spacer size={4} />
      <ConnectorDetailsReferenceList
        entities={entities}
        useTranslationStore={useTranslationStore}
        isLoading={isLoading}
        toEntity={toEntity}
        toScope={toScope}
        {...props}
      />
      <Spacer size={8} />
      <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} t={t} />
    </div>
  )
}

export { ConnectorDetailsReference }
