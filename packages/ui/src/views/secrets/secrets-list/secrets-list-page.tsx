import { FC, useCallback, useRef, useState } from 'react'

import { IconV2, Layout, NoData, PermissionIdentifier, ResourceType, SecretListFilters } from '@/components'
import { useComponents, useCustomDialogTrigger, useRouterContext, useTranslation } from '@/context'
import { settingsBackLink } from '@/utils/utils'
import { Page } from '@/views'
import FilterGroup, { FilterGroupRef } from '@views/components/FilterGroup'
import { isEmpty, isUndefined } from 'lodash-es'

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
  setPageSize,
  isLoading,
  secretManagerIdentifiers,
  isSecretManagerIdentifierLoading,
  secrets,
  onCreateSecret,
  setSecretManagerSearchQuery,
  onDeleteSecret,
  onFilterChange,
  onSortChange,
  scope,
  routes,
  ...props
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()
  const filterRef = useRef<FilterGroupRef>(null)
  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  const { RbacButton } = useComponents()

  const { accountId, orgIdentifier, projectIdentifier } = scope

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()

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
    setIsFiltered(!Object.values(filterValues).every(isUndefined))
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
          icon: 'refresh',
          label: t('views:notFound.button', 'Reload Page'),
          onClick: () => {
            navigate(0) // Reload the page
          }
        }}
      />
    )
  }

  return (
    <Page.Root>
      <Page.Header
        iconName="key"
        title={t('views:secrets.secretsTitle', 'Secrets')}
        backLink={settingsBackLink(routes?.toSettings, {
          accountId,
          orgIdentifier,
          projectIdentifier
        })}
      />

      <Page.Content>
        <Layout.Vertical gap="md" className="flex-1">
          <FilterGroup<SecretListFilters, keyof SecretListFilters>
            simpleSortConfig={{
              sortOptions: SECRET_SORT_OPTIONS,
              onSortChange,
              defaultSort: 'lastModifiedAt,DESC'
            }}
            ref={filterRef}
            onFilterValueChange={onFilterValueChange}
            searchValue={searchQuery}
            handleInputChange={handleSearch}
            headerAction={
              <RbacButton
                ref={triggerRef}
                onClick={() => {
                  onCreateSecret?.()
                  registerTrigger()
                }}
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
              onCreateSecret={onCreateSecret}
              isFiltered={isFiltered || !isEmpty(searchQuery)}
              paginationProps={{
                totalItems: totalItems,
                pageSize: pageSize,
                onPageSizeChange: setPageSize,
                currentPage: currentPage,
                goToPage: goToPage
              }}
            />
          </Layout.Vertical>
        </Layout.Vertical>
      </Page.Content>
    </Page.Root>
  )
}

export { SecretListPage }
