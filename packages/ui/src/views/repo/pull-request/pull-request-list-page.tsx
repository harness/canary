import { ChangeEvent, FC, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, NoData, PaginationComponent, SearchBox, SkeletonList, Spacer } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import {
  Filters,
  FiltersBar,
  type FilterCondition,
  type FilterOption,
  type SortDirection,
  type SortOption
} from '@components/filters'
import { debounce, noop } from 'lodash-es'

import { useFilters, useViewManagement } from '../hooks'
import { filterPullRequests } from '../utils/filtering/pulls'
import { sortPullRequests } from '../utils/sorting/pulls'
import { PullRequestList as PullRequestListContent } from './components/pull-request-list'
import { PullRequestStore } from './pull-request.types'

const BASIC_CONDITIONS: FilterCondition[] = [
  { label: 'is', value: 'is' },
  { label: 'is not', value: 'is_not' },
  { label: 'is empty', value: 'is_empty' },
  { label: 'is not empty', value: 'is_not_empty' }
]

const RANGE_CONDITIONS: FilterCondition[] = [
  { label: 'is', value: 'is' },
  { label: 'is before', value: 'is_before' },
  { label: 'is after', value: 'is_after' },
  { label: 'is between', value: 'is_between' },
  { label: 'is empty', value: 'is_empty' },
  { label: 'is not empty', value: 'is_not_empty' }
]

const TEXT_CONDITIONS: FilterCondition[] = [
  { label: 'is', value: 'is' },
  { label: 'is not', value: 'is_not' },
  { label: 'contains', value: 'contains' },
  { label: 'does not contain', value: 'does_not_contain' },
  { label: 'starts with', value: 'starts_with' },
  { label: 'ends with', value: 'ends_with' },
  { label: 'is empty', value: 'is_empty' },
  { label: 'is not empty', value: 'is_not_empty' }
]

const FILTER_OPTIONS: FilterOption[] = [
  {
    label: 'Type',
    value: 'type',
    type: 'checkbox',
    conditions: BASIC_CONDITIONS,
    options: [
      { label: 'open', value: 'enabled' },
      { label: 'closed', value: 'disabled' }
    ]
  },
  {
    label: 'Created time',
    value: 'created_time',
    type: 'calendar',
    conditions: RANGE_CONDITIONS
  },
  {
    label: 'Name',
    value: 'name',
    type: 'text',
    conditions: TEXT_CONDITIONS
  }
]

const SORT_OPTIONS: SortOption[] = [
  { label: 'Last updated', value: 'updated' },
  { label: 'Title', value: 'title' }
]

const SORT_DIRECTIONS: SortDirection[] = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
]
export interface PullRequestPageProps {
  usePullRequestStore: () => PullRequestStore
  repoId?: string
  spaceId?: string
  useTranslationStore: () => TranslationStore
  isLoading?: boolean
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}

const PullRequestList: FC<PullRequestPageProps> = ({
  usePullRequestStore,
  spaceId,
  repoId,
  useTranslationStore,
  isLoading,
  searchQuery,
  setSearchQuery
}) => {
  const { pullRequests, totalPages, page, setPage, openPullReqs, closedPullReqs } = usePullRequestStore()
  const { t } = useTranslationStore()
  const [searchInput, setSearchInput] = useState(searchQuery)
  const debouncedSetSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery || null)
  }, 500)

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const filterHandlers = useFilters()
  const viewManagement = useViewManagement({
    storageKey: 'pull-req-list-filters',
    setActiveFilters: filterHandlers.setActiveFilters,
    setActiveSorts: filterHandlers.setActiveSorts
  })

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetSearchQuery(e.target.value)
  }, [])

  const handleResetQuery = useCallback(() => {
    setSearchInput('')
    setSearchQuery(null)
  }, [setSearchQuery])

  const filteredPullReqs = filterPullRequests(pullRequests, filterHandlers.activeFilters)
  const sortedPullReqs = sortPullRequests(filteredPullReqs, filterHandlers.activeSorts)

  const noData = !(sortedPullReqs && sortedPullReqs.length > 0)

  const handleCloseClick = () => {
    filterHandlers.setActiveFilters([{ type: 'type', condition: 'is', selectedValues: ['disabled'] }])
  }

  const handleOpenClick = () => {
    filterHandlers.handleResetFilters()
  }

  const renderListContent = () => {
    if (isLoading) {
      return <SkeletonList />
    }

    if (noData) {
      return filterHandlers.activeFilters.length > 0 || searchQuery ? (
        <NoData
          iconName="no-search-magnifying-glass"
          title="No search results"
          description={['Check your spelling and filter options,', 'or search for a different keyword.']}
          primaryButton={{
            label: 'Clear search',
            onClick: handleResetQuery
          }}
          secondaryButton={{
            label: 'Clear filters',
            onClick: filterHandlers.handleResetFilters
          }}
        />
      ) : (
        <NoData
          iconName="no-data-folder"
          title="No pull requests yet"
          description={['There are no pull requests in this project yet.', 'Create a new pull request.']}
          primaryButton={{
            label: 'Create pull request',
            to: `/${spaceId}/repos/${repoId}/pulls/compare/`
          }}
        />
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
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content>
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
              placeholder={t('views:repos.search')}
            />
          </ListActions.Left>
          <ListActions.Right>
            <Filters
              t={t}
              showView={false}
              filterOptions={FILTER_OPTIONS}
              sortOptions={SORT_OPTIONS}
              filterHandlers={filterHandlers}
              viewManagement={viewManagement}
            />
            <Button variant="default" asChild>
              <Link to={`/${spaceId}/repos/${repoId}/pulls/compare/`}>New pull request</Link>
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        {(filterHandlers.activeFilters.length > 0 || filterHandlers.activeSorts.length > 0) && <Spacer size={2} />}
        <FiltersBar
          t={t}
          filterOptions={FILTER_OPTIONS}
          sortOptions={SORT_OPTIONS}
          sortDirections={SORT_DIRECTIONS}
          filterHandlers={filterHandlers}
          viewManagement={viewManagement}
        />

        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={6} />
        <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
export { PullRequestList }
