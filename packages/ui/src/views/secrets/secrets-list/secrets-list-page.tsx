import { FC, useCallback, useMemo, useRef } from 'react'

import {
  IconV2,
  Layout,
  NoData,
  Pagination,
  PermissionIdentifier,
  ResourceType,
  SecretListFilters,
  Text
} from '@/components'
import { useComponents, useRouterContext, useTranslation } from '@/context'
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
  const { RbacButton } = useComponents()

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

  const isEmpty = !isLoading && !secrets.length && !isDirtyList

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

          {isEmpty && (
            <NoData
              imageName="no-data-cog"
              title={t('views:noData.noSecrets', 'No secrets yet')}
              description={[t('views:noData.noSecrets', 'There are no secrets in this project yet.')]}
              primaryButton={{
                label: (
                  <>
                    <IconV2 name="plus" />
                    {t('views:secrets.createNew', 'Create Secret')}
                  </>
                ),
                onClick: onCreate
              }}
            />
          )}

          {!isEmpty && (
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
                  <RbacButton
                    onClick={onCreate}
                    rbac={{
                      resource: { resourceType: ResourceType.SECRET },
                      permissions: [PermissionIdentifier.UPDATE_SECRET]
                    }}
                  >
                    <IconV2 name="plus" />
                    {t('views:secrets.createNew', 'Create Secret')}
                  </RbacButton>
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
                />

                <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} goToPage={goToPage} />
              </Layout.Vertical>
            </Layout.Vertical>
          )}
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SecretListPage }
