import { FC, useCallback, useMemo } from 'react'

import { IconV2, NoData, Pagination, Spacer, SplitButton, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { ComboBoxOption } from '@components/filters/filters-bar/actions/variants/combo-box'
import { FilterFieldTypes } from '@components/filters/types'
import FilterGroup from '@views/components/FilterGroup'
import { noop } from 'lodash-es'

import { booleanParser } from '@harnessio/filters'

import { RepoList } from './repo-list'
import { RepoListFilters, RepoListProps } from './types'

enum ExtendedScope {
  All = 'ALL',
  Account = 'ACCOUNT',
  OrgProg = 'ORGANIZATION_AND_PROJECT',
  Organization = 'ORGANIZATION'
}

const SandboxRepoListPage: FC<RepoListProps> = ({
  scope,
  useRepoStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  setQueryPage,
  toCreateRepo,
  toImportRepo,
  toImportMultipleRepos,
  onFavoriteToggle,
  onFilterChange,
  ...routingProps
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query.length ? query : null)
      setQueryPage(1)
    },
    [setSearchQuery, setQueryPage]
  )

  // State for storing saved filters and sorts
  // null means no saved state exists
  const { repositories, totalItems, page, setPage, pageSize } = useRepoStore()

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

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
          label: t('views:notFound.button', 'Reload page'),
          onClick: () => {
            navigate(0) // Reload the page
          }
        }}
      />
    )
  }

  const handleResetFiltersQueryAndPages = () => {
    handleSearch('')
    setPage(1)
  }

  const onFilterValueChange = (filterValues: RepoListFilters) => onFilterChange(filterValues)

  const { projectIdentifier, orgIdentifier, accountId } = scope

  const ScopeOptions: ComboBoxOption[] = useMemo(() => {
    if (accountId && orgIdentifier && projectIdentifier) return []

    if (accountId && orgIdentifier) {
      return [
        { label: t('views:scope.orgAndProject', 'Organizations and projects'), value: ExtendedScope.OrgProg },
        { label: t('views:scope.orgOnly', 'Organizations only'), value: ExtendedScope.Organization }
      ]
    }

    if (accountId) {
      return [
        { label: t('views:scope.all', 'Account, organizations and projects'), value: ExtendedScope.All },
        { label: t('views:scope.accountOnly', 'Account only'), value: ExtendedScope.Account }
      ]
    }

    return []
  }, [scope])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <>
          <Spacer size={8} />
          <div className="flex items-end">
            <Text variant="heading-section" as="h1">
              {t('views:repos.repositories', 'Repositories')}
            </Text>
          </div>
          <Spacer size={6} />
          <FilterGroup<RepoListFilters, keyof RepoListFilters>
            sortConfig={{
              sortOptions: [],
              onSortChange: noop
            }}
            onFilterValueChange={onFilterValueChange}
            searchInput={searchQuery || ''}
            handleInputChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
            headerAction={
              <SplitButton<string>
                dropdownContentClassName="mt-0 min-w-[170px]"
                handleButtonClick={() => navigate(toCreateRepo?.() || '')}
                handleOptionChange={option => {
                  if (option === 'import') {
                    navigate(toImportRepo?.() || '')
                  } else if (option === 'import-multiple') {
                    navigate(toImportMultipleRepos?.() || '')
                  }
                }}
                options={[
                  {
                    value: 'import',
                    label: t('views:repos.import-repository', 'Import Repository')
                  },
                  {
                    value: 'import-multiple',
                    label: t('views:repos.import-repositories', 'Import Repositories')
                  }
                ]}
              >
                {t('views:repos.create-repository', 'Create Repository')}
              </SplitButton>
            }
            filterOptions={[
              {
                label: t('views:connectors.filterOptions.statusOption.favorite', 'Favorites'),
                value: 'favorite',
                type: FilterFieldTypes.Checkbox,
                filterFieldConfig: {
                  label: <IconV2 name="star-solid" size="md" className="text-cn-icon-yellow" />
                },
                parser: booleanParser
              },
              {
                label: t('views:scope.label', 'Scope'),
                value: 'recursive',
                type: FilterFieldTypes.ComboBox,
                filterFieldConfig: {
                  options: ScopeOptions,
                  onSearch: noop,
                  noResultsMessage: '',
                  loadingMessage: '',
                  placeholder: 'Select scope',
                  allowSearch: false
                },
                parser: {
                  parse: (value: string): ComboBoxOption => {
                    return ScopeOptions.find(scope => scope.value === value) || { label: '', value }
                  },
                  serialize: (value: ComboBoxOption): string => {
                    const selected = value?.value

                    if (accountId && orgIdentifier && projectIdentifier) return ''
                    if (accountId && orgIdentifier) return String(selected === ExtendedScope.OrgProg)
                    if (accountId) return String(selected === ExtendedScope.All)

                    return ''
                  }
                }
              }
            ]}
          />
        </>
        <Spacer size={5} />
        <RepoList
          repos={repositories || []}
          handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
          isDirtyList={isDirtyList}
          isLoading={isLoading}
          toCreateRepo={toCreateRepo}
          toImportRepo={toImportRepo}
          onFavoriteToggle={onFavoriteToggle}
          {...routingProps}
        />
        {!!repositories?.length && (
          <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxRepoListPage, ExtendedScope }
