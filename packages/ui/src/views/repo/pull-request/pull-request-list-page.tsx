import { FC } from 'react'
import { Link } from 'react-router-dom'

import {
  Button,
  ListActions,
  NoData,
  PaginationComponent,
  SearchBox,
  SkeletonList,
  Spacer,
  StackedList
} from '@/components'
import { useDebounceSearch } from '@/hooks'
import { PullRequestListStore, SandboxLayout, TranslationStore } from '@/views'
import { Filters, FiltersBar } from '@components/filters'
import { noop } from 'lodash-es'

import { getFilterOptions, getSortDirections, getSortOptions } from '../constants/filter-options'
import { useFilters } from '../hooks'
import { filterPullRequests } from '../utils/filtering/pulls'
import { sortPullRequests } from '../utils/sorting/pulls'
import { PullRequestList as PullRequestListContent } from './components/pull-request-list'

export interface PullRequestPageProps {
  usePullRequestListStore: () => PullRequestListStore
  repoId?: string
  spaceId?: string
  useTranslationStore: () => TranslationStore
  isLoading?: boolean
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}

const PullRequestList: FC<PullRequestPageProps> = ({
  usePullRequestListStore,
  spaceId,
  repoId,
  useTranslationStore,
  isLoading,
  searchQuery,
  setSearchQuery
}) => {
  const { pullRequests, totalPages, page, setPage, openPullReqs, closedPullReqs } = usePullRequestListStore()
  const { t } = useTranslationStore()

  const FILTER_OPTIONS = getFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)

  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch: handleResetQuery
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const filterHandlers = useFilters()

  const filteredPullReqs = filterPullRequests(pullRequests, filterHandlers.activeFilters)
  const sortedPullReqs = sortPullRequests(filteredPullReqs, filterHandlers.activeSorts)

  const noData = !(sortedPullReqs && sortedPullReqs.length > 0)

  const handleCloseClick = () => {
    filterHandlers.handleResetFilters()
  }

  const handleOpenClick = () => {
    filterHandlers.handleResetFilters()
  }

  const showTopBar =
    !noData || filterHandlers.activeFilters.length > 0 || filterHandlers.activeSorts.length > 0 || searchQuery?.length

  const renderListContent = () => {
    if (isLoading) {
      return <SkeletonList />
    }

    if (noData) {
      return filterHandlers.activeFilters.length > 0 || searchQuery ? (
        <StackedList.Root>
          <div className="flex min-h-[50vh] items-center justify-center py-20">
            <NoData
              iconName="no-search-magnifying-glass"
              title={t('views:noData.noResults', 'No search results')}
              description={[
                t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
                t('views:noData.changeSearch', 'or search for a different keyword.')
              ]}
              primaryButton={{
                label: t('views:noData.clearSearch', 'Clear search'),
                onClick: handleResetQuery
              }}
              secondaryButton={{
                label: t('views:noData.clearFilters', 'Clear filters'),
                onClick: filterHandlers.handleResetFilters
              }}
            />
          </div>
        </StackedList.Root>
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center py-20">
          <NoData
            iconName="no-data-folder"
            title="No pull requests yet"
            description={[
              t('views:noData.noPullRequests', 'There are no pull requests in this project yet.'),
              t('views:noData.createNewPullRequest', 'Create a new pull request.')
            ]}
            primaryButton={{
              label: 'Create pull request',
              to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
            }}
          />
        </div>
      )
    }
    return (
      <PullRequestListContent
        handleResetQuery={noop}
        pullRequests={sortedPullReqs}
        closedPRs={closedPullReqs}
        handleOpenClick={handleOpenClick}
        openPRs={openPullReqs}
        handleCloseClick={handleCloseClick}
      />
    )
  }

  return (
    <SandboxLayout.Main className="max-w-[1040px]">
      <SandboxLayout.Content>
        {showTopBar ? (
          <>
            <Spacer size={2} />
            <p className="text-24 font-medium leading-snug tracking-tight text-foreground-1">Pull Requests</p>
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
                <Filters
                  filterOptions={FILTER_OPTIONS}
                  sortOptions={SORT_OPTIONS}
                  filterHandlers={filterHandlers}
                  t={t}
                />
                <Button variant="default" asChild>
                  <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>New pull request</Link>
                </Button>
              </ListActions.Right>
            </ListActions.Root>
            <FiltersBar
              filterOptions={FILTER_OPTIONS}
              sortOptions={SORT_OPTIONS}
              sortDirections={SORT_DIRECTIONS}
              filterHandlers={filterHandlers}
              t={t}
            />
            <Spacer size={5} />
          </>
        ) : null}
        {renderListContent()}
        <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
export { PullRequestList }
