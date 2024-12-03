import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, NoData, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@/components'
import {
  Filters,
  FiltersBar,
  type FilterCondition,
  type FilterOption,
  type FilterValue,
  type SortDirection,
  type SortOption,
  type SortValue
} from '@components/filters'
import useFilters from '@components/filters/use-filters'
import { useCommonFilter } from '@hooks/use-common-filter'
import { noop } from 'lodash-es'

import { SandboxLayout, TranslationStore } from '../..'
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

  const [savedState, setSavedState] = useState<{
    filters: FilterValue[]
    sorts: SortValue[]
  } | null>(null)
  // Controls visibility of the Save button
  // true when current filters/sorts differ from saved state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  /**
   * Load previously saved filters from localStorage when component mounts
   * This restores the last saved filter configuration for this page
   */
  useEffect(() => {
    try {
      const savedFiltersString = localStorage.getItem('pull-req-list-filters')
      if (savedFiltersString) {
        const savedFilters = JSON.parse(savedFiltersString)
        setSavedState(savedFilters)
      }
    } catch (error) {
      console.error('Error loading saved filters:', error)
    }
  }, [])

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const filterHandlers = useFilters({
    // Pass saved state to initialize filters
    initialState: savedState ?? undefined,
    /**
     * Called whenever filters or sorts change
     * Determines if current state differs from saved state to show/hide Save button
     */
    onStateChange: state => {
      // If no saved state exists, show Save button if any filters/sorts are active
      if (!savedState) {
        setHasUnsavedChanges(state.filters.length > 0 || state.sorts.length > 0)
        return
      }

      // Compare current state with saved state
      // Show Save button only if:
      // 1. States are different AND
      // 2. There are actually some filters/sorts active
      const isChanged =
        JSON.stringify(state) !== JSON.stringify(savedState) && (state.filters.length > 0 || state.sorts.length > 0)

      setHasUnsavedChanges(isChanged)
    },
    // Controls Save button visibility
    hasUnsavedChanges,
    /**
     * Called when Save button is clicked
     * Saves current filters and sorts to localStorage
     */
    onSave: () => {
      try {
        // Create state object to save
        const stateToSave = {
          filters: filterHandlers.activeFilters,
          sorts: filterHandlers.activeSorts
        }
        // Save to localStorage
        localStorage.setItem('pull-req-list-filters', JSON.stringify(stateToSave))
        // Update saved state
        setSavedState(stateToSave)
        // Hide Save button
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Error saving filters:', error)
      }
    },
    /**
     * Called when Clear button is clicked
     * Removes saved filters from localStorage and resets all filters
     */
    onClear: () => {
      try {
        // Remove saved filters from localStorage
        localStorage.removeItem('pull-req-list-filters')
        // Reset saved state
        setSavedState(null)
        // Hide Save button
        setHasUnsavedChanges(false)
        // Reset all filters
        filterHandlers.handleResetAll()
      } catch (error) {
        console.error('Error clearing saved filters:', error)
      }
    }
  })

  /**
   * Filters pull requests based on active filters
   *
   * @param pullrequest - Pullrequest object to filter
   * @returns boolean - Whether the pullrequests matches all active filters
   *
   * Filter logic:
   * - If no active filters, returns all pullrequests
   * - Applies all active filters (AND condition)
   * - For type filter:
   *   - Handles 'private', 'public', and 'fork' types
   *   - Supports 'is' and 'is not' conditions
   *   - Ignores empty filters or is_empty/is_not_empty conditions
   */
  const filteredPullReqs =
    pullRequests &&
    pullRequests.filter(pullRequest => {
      if (filterHandlers.activeFilters.length === 0) return true

      return filterHandlers.activeFilters.every(filter => {
        switch (filter.type) {
          case 'type': {
            // Skip empty/not empty conditions for type filter
            if (filter.condition === 'is_empty' || filter.condition === 'is_not_empty') {
              return true
            }

            // Skip if no values selected
            if (filter.selectedValues.length === 0) {
              return true
            }

            // Determine pullReq types
            const isOpen = pullRequest.state === 'open'
            const isClosed = pullRequest.state === 'closed'

            // Check if pullrquest matches any of the selected type values
            const matchesType = filter.selectedValues.some(value => {
              switch (value) {
                case 'enabled':
                  return isOpen
                case 'disabled':
                  return isClosed

                default:
                  return false
              }
            })

            // Apply condition (is/is not)
            return filter.condition === 'is' ? matchesType : !matchesType
          }

          case 'created_time': {
            // Skip if no values selected
            if (filter.selectedValues.length === 0) {
              return true
            }

            // Handle empty conditions
            if (filter.condition === 'is_empty') {
              return !pullRequest.updated
            }
            if (filter.condition === 'is_not_empty') {
              return !!pullRequest.updated
            }

            const createdDate = new Date(pullRequest.updated)
            const selectedDate = new Date(filter.selectedValues[0])

            // Reset time parts for date-only comparison
            createdDate.setHours(0, 0, 0, 0)
            selectedDate.setHours(0, 0, 0, 0)

            switch (filter.condition) {
              case 'is':
                return createdDate.getTime() === selectedDate.getTime()

              case 'is_before':
                return createdDate.getTime() < selectedDate.getTime()

              case 'is_after':
                return createdDate.getTime() > selectedDate.getTime()

              case 'is_between': {
                if (filter.selectedValues.length !== 2) return true
                const endDate = new Date(filter.selectedValues[1])
                endDate.setHours(0, 0, 0, 0)
                return createdDate.getTime() >= selectedDate.getTime() && createdDate.getTime() <= endDate.getTime()
              }

              default:
                return true
            }
          }

          case 'name': {
            if (filter.condition === 'is_empty') {
              return !pullRequest.name
            }
            if (filter.condition === 'is_not_empty') {
              return !!pullRequest.name
            }

            // Skip if no values selected
            if (filter.selectedValues.length === 0) {
              return true
            }

            const value = filter.selectedValues[0].toLowerCase()
            const name = pullRequest?.name?.toLowerCase() ?? ''

            switch (filter.condition) {
              case 'is':
                return name === value
              case 'is_not':
                return name !== value
              case 'contains':
                return name.includes(value)
              case 'does_not_contain':
                return !name.includes(value)
              case 'starts_with':
                return name.startsWith(value)
              case 'ends_with':
                return name.endsWith(value)
              default:
                return true
            }
          }

          default:
            return true
        }
      })
    })

  /**
   * Sorts filtered pullrequest based on active sorts
   *
   * @param a - First pullrequest to compare
   * @param b - Second pullrequest to compare
   * @returns number - Comparison result (-1, 0, 1)
   *
   * Sort logic:
   * - Applies multiple sorts in priority order (first sort has highest priority)
   * - For equal values, moves to next sort criteria
   * - Supports following sort types:
   *   - updated: by timestamp
   *   - stars: by number of stars
   *   - forks: by number of forks
   *   - pulls: by number of pull requests
   *   - title: alphabetically by name
   * - Each sort supports ascending/descending direction
   */
  const sortedPullReqs = [...(filteredPullReqs ?? [])].sort((a, b) => {
    // Iterate through sorts in priority order
    for (const sort of filterHandlers.activeSorts) {
      const direction = sort.direction === 'asc' ? 1 : -1
      let comparison = 0

      switch (sort.type) {
        case 'updated':
          comparison = (new Date(b.updated).getTime() - new Date(a.updated).getTime()) * direction
          break
        case 'title':
          comparison = a.name!.localeCompare(b.name!) * direction
          break
        default:
          comparison = 0
      }

      // If items are different by current sort criteria, return result
      if (comparison !== 0) {
        return comparison
      }
    }

    return 0
  })

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
            <Filters t={t} filterOptions={FILTER_OPTIONS} sortOptions={SORT_OPTIONS} filterHandlers={filterHandlers} />
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
