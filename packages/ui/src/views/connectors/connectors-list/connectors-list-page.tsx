import { FC } from 'react'

import { Button, ListActions, NoData, Pagination, SearchBox, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

import { ConnectorsList } from './connectors-list'
import { ConnectorListPageProps } from './types'

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
        <h1 className="text-24 text-foreground-1 font-medium leading-snug tracking-tight">Connectors</h1>
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
          <ListActions.Right>
            <Button variant="default">{t('views:connectors.createNew', 'Create new connector')}</Button>
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

export { ConnectorListPage }
