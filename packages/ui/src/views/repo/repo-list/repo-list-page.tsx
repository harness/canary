import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@/components'
import { Filters, FiltersBar, type FilterValue, type SortValue } from '@components/filters'
import useFilters from '@components/filters/use-filters'
import { useCommonFilter } from '@hooks/useCommonFilter'
import { formatDistanceToNow } from 'date-fns'

import { SandboxLayout } from '../../index'
import { getFilterOptions, getSortDirections, getSortOptions } from './filter-options'
import { RepoList } from './repo-list'
import { RepoListProps } from './types'

const LinkComponent = ({ to, children }: { to: string; children: ReactNode }) => <Link to={to}>{children}</Link>

const SandboxRepoListPage: FC<RepoListProps> = ({
  useRepoStore,
  useTranslationStore,
  isLoading,
  isError,
  errorMessage
}) => {
  const { t } = useTranslationStore()
  const FILTER_OPTIONS = getFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)

  // State for storing saved filters and sorts
  // null means no saved state exists
  const { repositories, totalPages, page, setPage } = useRepoStore()

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
      const savedFiltersString = localStorage.getItem('sandbox-repo-filters')
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
        localStorage.setItem('sandbox-repo-filters', JSON.stringify(stateToSave))
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
        localStorage.removeItem('sandbox-repo-filters')
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
   * Filters repositories based on active filters
   *
   * @param repo - Repository object to filter
   * @returns boolean - Whether the repository matches all active filters
   *
   * Filter logic:
   * - If no active filters, returns all repositories
   * - Applies all active filters (AND condition)
   * - For type filter:
   *   - Handles 'private', 'public', and 'fork' types
   *   - Supports 'is' and 'is not' conditions
   *   - Ignores empty filters or is_empty/is_not_empty conditions
   */
  const filteredRepos =
    repositories &&
    repositories.filter(repo => {
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

            // Determine repository types
            const isPrivate = repo.private
            const isPublic = !repo.private
            const isFork = repo.forks > 0

            // Check if repo matches any of the selected type values
            const matchesType = filter.selectedValues.some(value => {
              switch (value) {
                case 'private':
                  return isPrivate
                case 'public':
                  return isPublic
                case 'fork':
                  return isFork
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
              return !repo.createdAt
            }
            if (filter.condition === 'is_not_empty') {
              return !!repo.createdAt
            }

            const createdDate = new Date(repo.createdAt)
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
              return !repo.name
            }
            if (filter.condition === 'is_not_empty') {
              return !!repo.name
            }

            // Skip if no values selected
            if (filter.selectedValues.length === 0) {
              return true
            }

            const value = filter.selectedValues[0].toLowerCase()
            const name = repo.name.toLowerCase()

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

          case 'stars': {
            if (filter.condition === 'is_empty') {
              return !repo.stars
            }
            if (filter.condition === 'is_not_empty') {
              return !!repo.stars
            }

            if (filter.selectedValues.length === 0) {
              return true
            }

            const filterValue = Number(filter.selectedValues[0])
            const repoValue = repo.stars || 0

            switch (filter.condition) {
              case 'equals':
                return repoValue === filterValue
              case 'not_equals':
                return repoValue !== filterValue
              case 'greater':
                return repoValue > filterValue
              case 'less':
                return repoValue < filterValue
              case 'greater_equals':
                return repoValue >= filterValue
              case 'less_equals':
                return repoValue <= filterValue
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
   * Sorts filtered repositories based on active sorts
   *
   * @param a - First repository to compare
   * @param b - Second repository to compare
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
  const sortedRepos = [...(filteredRepos ?? [])].sort((a, b) => {
    // Iterate through sorts in priority order
    for (const sort of filterHandlers.activeSorts) {
      const direction = sort.direction === 'asc' ? 1 : -1
      let comparison = 0

      switch (sort.type) {
        case 'updated':
          comparison = (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * direction
          break
        case 'stars':
          comparison = (b.stars - a.stars) * direction
          break
        case 'forks':
          comparison = (b.forks - a.forks) * direction
          break
        case 'pulls':
          comparison = (b.pulls - a.pulls) * direction
          break
        case 'title':
          comparison = a.name.localeCompare(b.name) * direction
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

  const reposWithFormattedDates = sortedRepos.map(repo => ({
    ...repo,
    timestamp: formatDistanceToNow(new Date(repo.createdAt), {
      addSuffix: true,
      includeSeconds: true
    }).replace('about ', '')
  }))

  const { query, handleSearch } = useCommonFilter()
  const [value, setValue] = useState<string>()

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

  if (isLoading) return <SkeletonList />

  if (isError)
    return (
      <>
        <Spacer size={2} />
        <Text size={1} className="text-destructive">
          {errorMessage || 'Something went wrong'}
        </Text>
      </>
    )

  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={10} />
          <Text size={5} weight={'medium'}>
            {t('views:repos.repositories')}
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
                filterOptions={FILTER_OPTIONS}
                sortOptions={SORT_OPTIONS}
                filterHandlers={filterHandlers}
                t={t}
              />
              <Button variant="default" asChild>
                <Link to={`create`}>{t('views:repos.create-repository')}</Link>
              </Button>
            </ListActions.Right>
          </ListActions.Root>
          {(filterHandlers.activeFilters.length > 0 || filterHandlers.activeSorts.length > 0) && <Spacer size={2} />}
          <FiltersBar
            filterOptions={FILTER_OPTIONS}
            sortOptions={SORT_OPTIONS}
            sortDirections={SORT_DIRECTIONS}
            filterHandlers={filterHandlers}
            t={t}
          />
          <Spacer size={5} />
          <RepoList
            repos={reposWithFormattedDates}
            LinkComponent={LinkComponent}
            handleResetFilters={filterHandlers.handleResetFilters}
            hasActiveFilters={filterHandlers.activeFilters.length > 0}
            query={query ?? ''}
            handleResetQuery={handleResetQuery}
            useTranslationStore={useTranslationStore}
          />
          <Spacer size={8} />
          <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={page => setPage(page)} t={t} />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}

export { SandboxRepoListPage }
