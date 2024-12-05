import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
import { Button, ListActions, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@components/index'
import { useCommonFilter } from '@hooks/useCommonFilter'
import { formatDistanceToNow } from 'date-fns'

import { SandboxLayout } from '../../../index'
import { RepoWebhookList } from './repo-webhook-list'
import { WebhookListProps } from './types'

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
      { label: 'Enabled', value: 'enabled' },
      { label: 'Disabled', value: 'disabled' }
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

const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

const RepoWebhookListPage: React.FC<WebhookListProps> = ({ useWebhookStore, useTranslationStore }) => {
  const { t } = useTranslationStore()

  // State for storing saved filters and sorts
  // null means no saved state exists
  const navigate = useNavigate()
  const { webhooks, totalPages, page, setPage, webhookLoading, error } = useWebhookStore()

  const [savedState, setSavedState] = useState<{
    filters: FilterValue[]
    sorts: SortValue[]
  } | null>(null)
  // Controls visibility of the Save button
  // true when current filters/sorts differ from saved state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleNavigate = () => {
    navigate('create')
  }
  /**
   * Load previously saved filters from localStorage when component mounts
   * This restores the last saved filter configuration for this page
   */
  useEffect(() => {
    try {
      const savedFiltersString = localStorage.getItem('sandbox-webhook-filters')
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
        localStorage.setItem('sandbox-webhook-filters', JSON.stringify(stateToSave))
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
        localStorage.removeItem('sandbox-webhook-filters')
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
   * Filters webhooks based on active filters
   *
   * @param webhook - Webhook object to filter
   * @returns boolean - Whether the webhooks matches all active filters
   *
   * Filter logic:
   * - If no active filters, returns all webhooks
   * - Applies all active filters (AND condition)
   * - For type filter:
   *   - Handles 'private', 'public', and 'fork' types
   *   - Supports 'is' and 'is not' conditions
   *   - Ignores empty filters or is_empty/is_not_empty conditions
   */
  const filteredWebhooks =
    webhooks &&
    webhooks.filter(webhook => {
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

            // Determine webhook types
            const isEnabled = webhook.enabled
            const isDisabled = !webhook.enabled

            // Check if webhook matches any of the selected type values
            const matchesType = filter.selectedValues.some(value => {
              switch (value) {
                case 'enabled':
                  return isEnabled
                case 'disabled':
                  return isDisabled

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
              return !webhook.updated
            }
            if (filter.condition === 'is_not_empty') {
              return !!webhook.updated
            }

            const createdDate = new Date(webhook.updated)
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
              return !webhook.name
            }
            if (filter.condition === 'is_not_empty') {
              return !!webhook.name
            }

            // Skip if no values selected
            if (filter.selectedValues.length === 0) {
              return true
            }

            const value = filter.selectedValues[0].toLowerCase()
            const name = webhook.name.toLowerCase()

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
   * Sorts filtered webhooks based on active sorts
   *
   * @param a - First webhook to compare
   * @param b - Second webhook to compare
   * @returns number - Comparison result (-1, 0, 1)
   *
   * Sort logic:
   * - Applies multiple sorts in priority order (first sort has highest priority)
   * - For equal values, moves to next sort criteria
   * - Supports following sort types:
   *   - updated: by timestamp
   *   - forks: by number of forks
   *   - pulls: by number of pull requests
   *   - title: alphabetically by name
   * - Each sort supports ascending/descending direction
   */
  const sortedWebhooks = [...(filteredWebhooks ?? [])].sort((a, b) => {
    // Iterate through sorts in priority order
    for (const sort of filterHandlers.activeSorts) {
      const direction = sort.direction === 'asc' ? 1 : -1
      let comparison = 0

      switch (sort.type) {
        case 'updated':
          comparison = (new Date(b.updated).getTime() - new Date(a.updated).getTime()) * direction
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

  const webhooksWithFormattedDates = sortedWebhooks.map(webhook => ({
    ...webhook,
    timestamp: formatDistanceToNow(new Date(webhook.updated), {
      addSuffix: true,
      includeSeconds: true
    }).replace('about ', '')
  }))

  const { query, handleSearch } = useCommonFilter()
  const [value, setValue] = useState<string>()

  useEffect(() => {
    setValue(query || '')
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value)
    handleSearch(e)
  }

  const handleResetQuery = () => {
    setValue('')
    handleSearch({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
  }
  if (webhookLoading)
    return (
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <SkeletonList />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )

  if (error)
    return (
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={2} />
          <Text size={1} className="text-destructive">
            {error || 'Something went wrong'}
          </Text>
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={10} />
          <Text size={5} weight={'medium'}>
            Webhook
          </Text>
          <Spacer size={6} />
          <ListActions.Root>
            <ListActions.Left>
              <SearchBox.Root
                width="full"
                className="max-w-96"
                value={value}
                handleChange={handleInputChange}
                placeholder="Search"
              />
            </ListActions.Left>
            <ListActions.Right>
              <Filters
                t={t}
                filterOptions={FILTER_OPTIONS}
                sortOptions={SORT_OPTIONS}
                filterHandlers={filterHandlers}
              />
              <Button variant="default" asChild>
                <Link to="create">New webhook</Link>
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
          <RepoWebhookList
            error={error}
            loading={webhookLoading}
            webhooks={webhooksWithFormattedDates}
            LinkComponent={LinkComponent}
            handleResetFilters={filterHandlers.handleResetFilters}
            hasActiveFilters={filterHandlers.activeFilters.length > 0}
            query={query ?? ''}
            handleResetQuery={handleResetQuery}
            handleNavigate={handleNavigate}
          />
          <Spacer size={8} />
          <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={page => setPage(page)} t={t} />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}

export { RepoWebhookListPage }
