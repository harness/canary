import { FC } from 'react'

import { Button, IconV2, NoData, Pagination, SecretListFilters, Spacer, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'
import FilterGroup from '@views/components/FilterGroup'

import { getSecretListFilterOptions, SECRET_SORT_OPTIONS } from './filter-options'
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
  secretManagerIdentifiers,
  isSecretManagerIdentifierLoading,
  secrets,
  onCreate,
  setSecretManagerSearchQuery,
  onDeleteSecret,
  onFilterChange,
  onSortChange,
  ...props
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()

  const secretManagerFilterOptions = secretManagerIdentifiers.map(secretManager => {
    return {
      label: secretManager.name || '',
      value: secretManager.identifier
    }
  })
  const SECRET_FILTER_OPTIONS = getSecretListFilterOptions(t, {
    options: secretManagerFilterOptions,
    allowSearch: true,
    isLoading: isSecretManagerIdentifierLoading,
    placeholder: t('views:secrets.filterOptions.secretManagerOption.placeholder', 'Select Secret Manager'),
    onSearch: (query: string) => {
      setSecretManagerSearchQuery(query)
    }
  })

  const onFilterValueChange = (filterValues: SecretListFilters) => {
    // Pass filter values to parent component if onFilterChange is provided
    onFilterChange?.(filterValues)
  }

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
        <Text variant="heading-hero">Secrets</Text>
        <Spacer size={6} />
        <FilterGroup<SecretListFilters, keyof SecretListFilters>
          simpleSortConfig={{
            sortOptions: SECRET_SORT_OPTIONS,
            onSortChange,
            defaultSort: 'lastModifiedAt,DESC'
          }}
          onFilterValueChange={onFilterValueChange}
          handleInputChange={(value: string) => setSearchQuery(value)}
          headerAction={
            <Button onClick={onCreate}>
              <IconV2 name="plus" />
              {t('views:secrets.newSecret', 'New Secret')}
            </Button>
          }
          filterOptions={SECRET_FILTER_OPTIONS}
        />
        <Spacer size={4} />
        <SecretList secrets={secrets} isLoading={isLoading} onDeleteSecret={onDeleteSecret} {...props} />
        <Spacer size={8} />
        <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SecretListPage }
