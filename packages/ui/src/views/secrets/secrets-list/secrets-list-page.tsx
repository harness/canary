import { FC } from 'react'

import { Button, IconV2, ListActions, NoData, Pagination, SearchBox, Spacer, Text } from '@/components'
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
        imageName="no-data-error"
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
      <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !secrets.length && !searchQuery })}>
        <Text as="h1" variant="heading-section">
          Secrets
        </Text>
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
            <Button onClick={onCreate}>
              <IconV2 name="plus" />
              {t('views:secrets.createNew', 'New Secret')}
            </Button>
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
