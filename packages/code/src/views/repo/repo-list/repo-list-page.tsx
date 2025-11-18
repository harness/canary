import { FC, useCallback, useMemo, useRef, useState } from 'react'

import { IconV2, NoData, PermissionIdentifier, ResourceType, Spacer, Text } from '@/components'
import { useComponents, useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'
import { FilterFieldTypes, FilterOptionConfig } from '@components/filters/types'
import FilterGroup, { FilterGroupRef } from '@views/components/FilterGroup'

import { booleanParser } from '@harnessio/filters'

import { ExtendedScope } from '../common'
import { getFilterScopeOptions } from '../common/util'
import { RepoList } from './repo-list'
import { RepoListFilters, RepoListPageProps, RepoSortMethod } from './types'

const SandboxRepoListPage: FC<RepoListPageProps> = ({
  useRepoStore,
  isLoading,
  isError,
  errorMessage,
  queryFilterValues,
  searchQuery,
  setSearchQuery,
  setQueryPage,
  toCreateRepo,
  toImportRepo,
  toImportMultipleRepos,
  onFavoriteToggle,
  onFilterChange,
  onSortChange,
  scope,
  ...routingProps
}) => {
  const { t } = useTranslation()
  const { RbacSplitButton } = useComponents()
  const { navigate } = useRouterContext()
  const [showScope, setShowScope] = useState(false)
  const filterRef = useRef<FilterGroupRef>(null)

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query.length ? query : null)
      setQueryPage(1)
    },
    [setSearchQuery, setQueryPage]
  )

  // State for storing saved filters and sorts
  // null means no saved state exists
  const { repositories, page, setPage } = useRepoStore()

  const FilterSortOptions = [
    { label: 'Name (A->Z, 0->9)', value: RepoSortMethod.Identifier_Asc },
    { label: 'Name (Z->A, 9->0)', value: RepoSortMethod.Identifier_Desc },
    { label: 'Newest', value: RepoSortMethod.Newest },
    { label: 'Oldest', value: RepoSortMethod.Oldest },
    { label: 'Last push', value: RepoSortMethod.LastPush }
  ]

  const filterOptions = useMemo(() => {
    const { options: scopeFilterOptions, defaultValue: scopeFilterDefaultValue } = getFilterScopeOptions({ t, scope })
    const { projectIdentifier, orgIdentifier, accountId } = scope

    const buildFilterOptions = (): FilterOptionConfig<keyof RepoListFilters>[] => {
      const favoriteFilterDefaultValue = false

      const favoriteFilterOption: FilterOptionConfig<keyof RepoListFilters> = {
        defaultValue: favoriteFilterDefaultValue,
        isDefaultValue: queryFilterValues?.favorite === String(favoriteFilterDefaultValue),
        label: t('views:connectors.filterOptions.statusOption.pinned', 'Pinned'),
        value: 'favorite',
        type: FilterFieldTypes.Checkbox,
        sticky: true,
        filterFieldConfig: {
          label: <IconV2 name="pin-solid" size="md" className="cursor-pointer" />
        },
        parser: booleanParser
      }

      if (!projectIdentifier) {
        const parse = (value: string): ComboBoxOptions => {
          let selectedValue: string
          if (accountId && orgIdentifier) {
            selectedValue = value === 'true' ? ExtendedScope.OrgProg : ExtendedScope.Organization
          } else if (accountId) {
            selectedValue = value === 'true' ? ExtendedScope.All : ExtendedScope.Account
          }

          return scopeFilterOptions.find(scope => scope.value === selectedValue) || { label: '', value }
        }

        const recursiveFilterOption: FilterOptionConfig<keyof RepoListFilters> = {
          defaultValue: scopeFilterDefaultValue,
          isDefaultValue: parse(String(queryFilterValues?.recursive)).value === String(scopeFilterDefaultValue.value),
          label: t('views:scope.label', 'Scope'),
          value: 'recursive',
          type: FilterFieldTypes.ComboBox,
          filterFieldConfig: {
            options: scopeFilterOptions,
            placeholder: 'Select scope',
            allowSearch: false
          },
          parser: {
            parse: parse,
            serialize: (value: ComboBoxOptions): string => {
              const selected = value?.value

              if (accountId && orgIdentifier && projectIdentifier) return ''
              if (accountId && orgIdentifier) return String(selected === ExtendedScope.OrgProg)
              if (accountId) return String(selected === ExtendedScope.All)

              return ''
            }
          }
        }

        return [favoriteFilterOption, recursiveFilterOption]
      }
      return [favoriteFilterOption]
    }

    return buildFilterOptions()
  }, [queryFilterValues, t, scope])

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery || filterOptions.some(filter => !filter.isDefaultValue)
  }, [page, searchQuery, filterOptions])

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', {
          type: 'repositories'
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

  const handleResetFiltersQueryAndPages = () => {
    filterRef.current?.resetSearch?.()
    filterRef.current?.resetFilters?.()
    setSearchQuery(null)
    setPage(1)
  }

  const onFilterValueChange = (filterValues: RepoListFilters) => {
    onFilterChange(filterValues)

    /**
     * Only show scope if the Scope filter is set to "All" or "Organizations and projects" only.
     */
    setShowScope([ExtendedScope.All, ExtendedScope.OrgProg].includes(filterValues.recursive?.value as ExtendedScope))
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Text variant="heading-section" as="h1">
          {t('views:repos.repositories', 'Repositories')}
        </Text>
        {(!!repositories?.length || isDirtyList) && (
          <>
            <Spacer size={6} />
            <FilterGroup<RepoListFilters, keyof RepoListFilters>
              simpleSortConfig={{
                sortOptions: FilterSortOptions,
                defaultSort: RepoSortMethod.LastPush,
                onSortChange
              }}
              onFilterValueChange={onFilterValueChange}
              searchValue={searchQuery || ''}
              ref={filterRef}
              handleInputChange={handleSearch}
              headerAction={
                <RbacSplitButton<string>
                  dropdownContentClassName="mt-0 min-w-[208px]"
                  handleButtonClick={() => navigate(toCreateRepo?.() || '')}
                  handleOptionChange={option => {
                    if (option === 'new') {
                      navigate(toCreateRepo?.() || '')
                    }
                    if (option === 'import') {
                      navigate(toImportRepo?.() || '')
                    }
                    if (option === 'import-multiple') {
                      navigate(toImportMultipleRepos?.() || '')
                    }
                  }}
                  options={[
                    {
                      value: 'new',
                      label: t('views:repos.createRepository', 'Create Repository')
                    },
                    {
                      value: 'import',
                      label: t('views:repos.importRepository', 'Import Repository')
                    },
                    {
                      value: 'import-multiple',
                      label: t('views:repos.importRepositories', 'Import Repositories')
                    }
                  ]}
                  rbac={{
                    resource: {
                      resourceType: ResourceType.CODE_REPOSITORY
                    },
                    permissions: [PermissionIdentifier.CODE_REPO_CREATE]
                  }}
                >
                  <IconV2 name="plus" />
                  {t('views:repos.createRepository', 'Create Repository')}
                </RbacSplitButton>
              }
              filterOptions={filterOptions}
            />
          </>
        )}
        <Spacer size={4.5} />
        <RepoList
          useRepoStore={useRepoStore}
          handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
          isDirtyList={isDirtyList}
          isLoading={isLoading}
          toCreateRepo={toCreateRepo}
          toImportRepo={toImportRepo}
          onFavoriteToggle={onFavoriteToggle}
          scope={scope}
          showScope={showScope}
          {...routingProps}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ExtendedScope, SandboxRepoListPage }
