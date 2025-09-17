import { FC, useCallback, useMemo, useRef } from 'react'

import { Button, IconV2, Layout, NoData, Pagination, SecretListFilters, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'
import FilterGroup, { FilterGroupRef } from '@views/components/FilterGroup'

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
  const filterRef = useRef<FilterGroupRef>(null)

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
    goToPage(1)
  }

  const handleResetFiltersQueryAndPages = () => {
    filterRef.current?.resetSearch?.()
    filterRef.current?.resetFilters?.()
    setSearchQuery('')
    goToPage(1)
  }

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query.length ? query : '')
      goToPage(1)
    },
    [setSearchQuery, goToPage]
  )

  const isDirtyList = useMemo(() => {
    return currentPage !== 1 || !!searchQuery || secretManagerFilterOptions.length === 0
  }, [currentPage, searchQuery])

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
        <Layout.Vertical gap="xl" className="flex-1">
          <Text as="h1" variant="heading-hero">
            {t('views:secrets.secretsTitle', 'Secrets')}
          </Text>

          <Layout.Vertical gap="md" className="flex-1">
            <FilterGroup<SecretListFilters, keyof SecretListFilters>
              simpleSortConfig={{
                sortOptions: SECRET_SORT_OPTIONS,
                onSortChange,
                defaultSort: 'lastModifiedAt,DESC'
              }}
              ref={filterRef}
              onFilterValueChange={onFilterValueChange}
              handleInputChange={handleSearch}
              headerAction={
                <Button onClick={onCreate}>
                  <IconV2 name="plus" />
                  {t('views:secrets.createNew', 'Create Secret')}
                </Button>
              }
              filterOptions={SECRET_FILTER_OPTIONS}
            />

            <Layout.Vertical gap="none" className="flex-1">
              <SecretList
                secrets={secrets}
                isLoading={isLoading}
                onDeleteSecret={onDeleteSecret}
                {...props}
                handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
                isDirtyList={isDirtyList}
                onCreateSecret={onCreate}
              />

              <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} />
            </Layout.Vertical>
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SecretListPage }
