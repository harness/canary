import { FC, useMemo } from 'react'

import { ButtonWithOptions, ListActions, NoData, Pagination, SearchBox, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'

import { useFilters, useViewManagement } from '../hooks'
import { filterRepositories } from '../utils/filtering/repos'
import { formatRepositories } from '../utils/formatting/repos'
import { sortRepositories } from '../utils/sorting/repos'
import { RepoList } from './repo-list'
import { RepoListProps } from './types'

const SandboxRepoListPage: FC<RepoListProps> = ({
  useRepoStore,
  useTranslationStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  toCreateRepo,
  toImportRepo,
  ...routingProps
}) => {
  const { t } = useTranslationStore()
  const { navigate } = useRouterContext()

  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  // State for storing saved filters and sorts
  // null means no saved state exists
  const { repositories, totalPages, page, setPage } = useRepoStore()

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const filterHandlers = useFilters()
  const viewManagement = useViewManagement({
    storageKey: 'sandbox-repo-filters',
    setActiveFilters: filterHandlers.setActiveFilters,
    setActiveSorts: filterHandlers.setActiveSorts
  })

  const filteredRepos = filterRepositories(repositories, filterHandlers.activeFilters)
  const sortedRepos = sortRepositories(filteredRepos, filterHandlers.activeSorts)
  const reposWithFormattedDates = formatRepositories(sortedRepos)

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!filterHandlers.activeFilters.length || !!searchQuery
  }, [page, filterHandlers.activeFilters, searchQuery])

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        iconName="no-data-error"
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

  const noData = !(reposWithFormattedDates && !!reposWithFormattedDates.length)
  const showTopBar = !noData || !!filterHandlers.activeFilters.length || !!searchQuery?.length || page !== 1

  const handleResetFiltersQueryAndPages = () => {
    filterHandlers.handleResetFilters()
    handleResetSearch()
    setPage(1)
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        {showTopBar && (
          <>
            <Spacer size={8} />
            <div className="flex items-end">
              <h1 className="text-2xl font-medium text-cn-foreground-1">
                {t('views:repos.repositories', 'Repositories')}
              </h1>
              {viewManagement.currentView && (
                <>
                  <span className="mx-2.5 inline-flex h-[18px] w-px bg-borders-1" />
                  <span className="text-14 text-cn-foreground-3">{viewManagement.currentView.name}</span>
                </>
              )}
            </div>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <SearchBox.Root
                  width="full"
                  className="max-w-96"
                  value={searchInput || ''}
                  handleChange={handleInputChange}
                  placeholder={t('views:repos.search', 'Search')}
                />
              </ListActions.Left>
              <ListActions.Right>
                <ButtonWithOptions<string>
                  id="repository"
                  dropdownContentClassName="mt-0 min-w-[170px]"
                  handleButtonClick={() => navigate(toCreateRepo?.() || '')}
                  handleOptionChange={option => {
                    if (option === 'import') {
                      navigate(toImportRepo?.() || '')
                    } else if (option === 'import-multiple') {
                      navigate('import-multiple')
                    }
                  }}
                  options={[
                    {
                      value: 'import',
                      label: t('views:repos.import-repository', 'Import repository')
                    },
                    {
                      value: 'import-multiple',
                      label: t('views:repos.import-repositories', 'Import repositories')
                    }
                  ]}
                >
                  {t('views:repos.create-repository', 'Create repository')}
                </ButtonWithOptions>
              </ListActions.Right>
            </ListActions.Root>
          </>
        )}
        <Spacer size={5} />
        <RepoList
          repos={reposWithFormattedDates}
          handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
          isDirtyList={isDirtyList}
          useTranslationStore={useTranslationStore}
          isLoading={isLoading}
          toCreateRepo={toCreateRepo}
          toImportRepo={toImportRepo}
          {...routingProps}
        />
        {!!reposWithFormattedDates.length && (
          <Pagination totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxRepoListPage }
