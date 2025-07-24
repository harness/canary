import { FC, useCallback, useMemo } from 'react'

import { IconV2, NoData, Pagination, Spacer, SplitButton, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { FilterFieldTypes } from '@components/filters/types'
import FilterGroup from '@views/components/FilterGroup'
import { noop } from 'lodash-es'

import { booleanParser } from '@harnessio/filters'

import { RepoList } from './repo-list'
import { RepoListFilters, RepoListProps } from './types'

const SandboxRepoListPage: FC<RepoListProps> = ({
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

  const noData = !(repositories && !!repositories.length)
  const showTopBar = !noData || !!searchQuery?.length || page !== 1

  const handleResetFiltersQueryAndPages = () => {
    handleSearch('')
    setPage(1)
  }

  const onFilterValueChange = (filterValues: RepoListFilters) => onFilterChange(filterValues)

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        {showTopBar && (
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
                }
              ]}
            />
          </>
        )}
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

export { SandboxRepoListPage }
