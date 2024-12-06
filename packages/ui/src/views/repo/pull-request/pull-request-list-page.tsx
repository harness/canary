import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, NoData, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@/components'
import {
  Filters,
  FiltersBar,
  type FilterCondition,
  type FilterOption,
  type SortDirection,
  type SortOption
} from '@components/filters'
import { useCommonFilter } from '@hooks/use-common-filter'
import { noop } from 'lodash-es'

import { SandboxLayout, TranslationStore } from '../..'
import { useFilters, useViewManagement } from '../hooks'
import { filterPullRequests } from '../utils/filtering/pulls'
import { sortPullRequests } from '../utils/sorting/pulls'
import { PullRequestList as PullRequestListContent } from './pull-request-list'
import { PullRequestStore } from './types'

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
export interface PullRequestListProps {
  usePullRequestStore: () => PullRequestStore
  repoId?: string
  spaceId?: string
  useTranslationStore: () => TranslationStore
  isLoading?: boolean
}

const PullRequestList: FC<PullRequestListProps> = ({
  usePullRequestStore,
  spaceId,
  repoId,
  useTranslationStore,
  isLoading
}) => {
  const { pullRequests, totalPages, page, setPage, openPullReqs, closedPullReqs } = usePullRequestStore()
  const { t } = useTranslationStore()
  const { query, handleSearch } = useCommonFilter()
  const [value, setValue] = useState<string>()

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const filterHandlers = useFilters()
  const viewManagement = useViewManagement({
    storageKey: 'pull-req-list-filters',
    setActiveFilters: filterHandlers.setActiveFilters,
    setActiveSorts: filterHandlers.setActiveSorts
  })

  const filteredPullReqs = filterPullRequests(pullRequests, filterHandlers.activeFilters)
  const sortedPullReqs = sortPullRequests(filteredPullReqs, filterHandlers.activeSorts)

  useEffect(() => {
    setValue(query || '')
  }, [query])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value)
    handleSearch(e)
  }

  const handleResetQuery = () => {
    setValue('')
    handleSearch({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
  }

  // const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>
  const renderListContent = () => {
    if (isLoading) {
      return <SkeletonList />
    }

    if (!sortedPullReqs?.length) {
      if (query || filterHandlers.activeFilters.length > 0) {
        return (
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
        )
      }

      return (
        // TODO add: no data state
        <NoData
          iconName="no-data-folder"
          title="No pull requests yet"
          description={['There are no pull requests in this project yet.', 'Create a new pull request.']}
          primaryButton={{
            label: 'Create pull request',
            onClick: noop
          }}
        />
      )
    }
    return (
      <PullRequestListContent
        handleResetQuery={noop}
        // LinkComponent={LinkComponent}
        pullRequests={sortedPullReqs}
        closedPRs={closedPullReqs}
        openPRs={openPullReqs}
      />
    )
  }
  return (
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Pull Requests
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root
              width="full"
              className="max-w-96"
              value={value}
              handleChange={handleInputChange}
              placeholder={t('views:repos.search')}
            />
          </ListActions.Left>
          <ListActions.Right>
            <Filters
              t={t}
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
        <Spacer size={8} />
        <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
export { PullRequestList }
