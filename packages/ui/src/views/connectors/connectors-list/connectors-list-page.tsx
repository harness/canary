import { FC } from 'react'

import { Button, ListActions, NoData, Pagination, SearchBox, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

import { ConnectorsList } from './connectors-list'
import { ConnectorListPageProps } from './types'

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
  onCreate,
  ...props
}) => {
  const { t } = useTranslationStore()
  const { navigate } = useRouterContext()

  const { search: searchInput, handleSearchChange: handleInputChange } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : undefined),
    searchValue: searchQuery || ''
  })

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
            <Button variant="default">{t('views:connectors.new', 'New connector')}</Button>
          </ListActions.Right>
        </ListActions.Root>
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
