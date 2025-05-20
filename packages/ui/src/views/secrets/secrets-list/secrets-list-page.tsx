import { FC } from 'react'

import { Button, ListActions, NoData, Pagination, SearchBox, Spacer } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

import { SecretList } from './secrets-list'
import { SecretListPageProps } from './types'

const SecretListPage: FC<SecretListPageProps> = ({
  searchQuery,
  setSearchQuery,
  isError,
  errorMessage,
  currentPage,
  totalItems,
  pageSize,
  goToPage,
  isLoading,
  secrets,
  onCreate,
  onDeleteSecret,
  ...props
}) => {
  const { t } = useTranslation()
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
          type: 'secrets'
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
      <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !secrets.length && !searchQuery })}>
        <h1 className="text-6 font-medium leading-snug tracking-tight text-cn-foreground-1">Secrets</h1>
        <Spacer size={6} />
        <ListActions.Root className="mb-1">
          <ListActions.Left>
            <SearchBox.Root
              width="full"
              className="max-w-80"
              value={searchInput}
              handleChange={handleInputChange}
              placeholder={t('views:search', 'Search')}
            />
          </ListActions.Left>
          <ListActions.Right>
            <Button onClick={onCreate}>{t('views:secrets.createNew', 'New secret')}</Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={4} />
        <SecretList secrets={secrets} isLoading={isLoading} onDeleteSecret={onDeleteSecret} {...props} />
        <Spacer size={8} />
        <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SecretListPage }
