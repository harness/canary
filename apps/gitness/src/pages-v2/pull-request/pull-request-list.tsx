import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  ListPullReqQueryQueryParams,
  useGetPrincipalQuery,
  useGetUserQuery,
  useListPrincipalsQuery,
  useListPullReqQuery,
  usePrCandidatesQuery
} from '@harnessio/code-service-client'
import { PullRequestListPage as SandboxPullRequestListPage, type PRListFilters } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { useGitRef } from '../../hooks/useGitRef'
import { PathParams } from '../../RouteDefinitions'
import { useLabelsStore } from '../project/stores/labels-store'
import { usePopulateLabelStore } from '../repo/labels/hooks/use-populate-label-store'
import { buildPRFilters } from './pull-request-utils'
import { usePullRequestListStore } from './stores/pull-request-list-store'

export default function PullRequestListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setPullRequests, page, setPage, setOpenClosePullRequests, labelsQuery, prState, setPrState } =
    usePullRequestListStore()
  const { spaceId, repoId } = useParams<PathParams>()
  const { repoData } = useGitRef()

  /* Query and Pagination */
  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [filterValues, setFilterValues] = useState<ListPullReqQueryQueryParams>({})
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState<string>()
  const [populateLabelStore, setPopulateLabelStore] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultAuthorId = searchParams.get('created_by')
  const labelBy = searchParams.get('label_by')
  const { scope } = useMFEContext()
  const { accountId = '', orgIdentifier, projectIdentifier } = scope || {}
  usePopulateLabelStore({ queryPage, query: labelsQuery, enabled: populateLabelStore, inherited: true })

  const [shouldSwitchToClosed, setShouldSwitchToClosed] = useState(false)

  const shouldSwitchToClosedTab = useCallback(
    (hasAuthorFilter: boolean, openCount: number, closedCount: number): boolean => {
      return hasAuthorFilter && openCount === 0 && closedCount > 0
    },
    []
  )

  const { data: { body: pullRequestData, headers } = {}, isFetching: fetchingPullReqData } = useListPullReqQuery(
    {
      queryParams: {
        page,
        state: prState,
        query: query ?? '',
        exclude_description: true,
        sort: 'updated',
        order: 'desc',
        ...filterValues
      },
      repo_ref: repoRef,
      stringifyQueryParamsOptions: {
        arrayFormat: 'repeat'
      }
    },
    { retry: false }
  )

  // Dynamic counter queries that respect filters
  const { data: { body: openPRData, headers: openHeaders } = {} } = useListPullReqQuery(
    {
      queryParams: {
        page: 1,
        state: ['open'],
        query: query ?? '',
        exclude_description: true,
        sort: 'updated',
        order: 'desc',
        ...filterValues
      },
      repo_ref: repoRef,
      stringifyQueryParamsOptions: {
        arrayFormat: 'repeat'
      }
    },
    {
      retry: false
    }
  )

  const { data: { body: closedPRData, headers: closedHeaders } = {} } = useListPullReqQuery(
    {
      queryParams: {
        page: 1,
        state: ['closed', 'merged'],
        query: query ?? '',
        exclude_description: true,
        sort: 'updated',
        order: 'desc',
        ...filterValues
      },
      repo_ref: repoRef,
      stringifyQueryParamsOptions: {
        arrayFormat: 'repeat'
      }
    },
    {
      retry: false
    }
  )

  const { data: { body: defaultSelectedAuthor } = {}, error: defaultSelectedAuthorError } = useGetPrincipalQuery(
    {
      queryParams: { page, accountIdentifier: accountId, ...filterValues },
      id: Number(searchParams.get('created_by'))
    },
    // Adding staleTime to avoid refetching the data if authorId gets modified in searchParams
    { enabled: !!defaultAuthorId, staleTime: Infinity, keepPreviousData: true }
  )

  const { data: { body: principalDataList } = {}, isFetching: fetchingPrincipalData } = useListPrincipalsQuery(
    {
      queryParams: {
        page: 1,
        limit: 100,
        // @ts-expect-error : BE issue - not implemnted
        type: 'user',
        query: principalsSearchQuery,
        accountIdentifier: accountId
      }
    },
    {
      enabled: principalsSearchQuery !== undefined
    }
  )

  const { data: { body: prCandidateBranches } = {} } = usePrCandidatesQuery({ repo_ref: repoRef, queryParams: {} })

  // TODO: can we move this to some hook which is accessible globally ?
  const { data: { body: currentUser } = {} } = useGetUserQuery({
    queryParams: {
      routingId: accountId
    }
  })

  const onLabelClick = (labelId: number) => {
    // Update filter values with the label ID for API call
    setFilterValues(prevFilters => {
      // Get current label IDs or empty array
      const currentLabelIds = prevFilters.label_id || []

      // Toggle the label: remove if exists, add if doesn't exist
      let newLabelIds: number[]
      if (currentLabelIds.includes(labelId)) {
        newLabelIds = currentLabelIds.filter(id => id !== labelId)
      } else {
        newLabelIds = [...currentLabelIds, labelId]
      }

      const newParams = new URLSearchParams(searchParams)

      if (newLabelIds.length > 0) {
        const labelByValue = newLabelIds.map(id => `${id}:true`).join(';')
        newParams.set('label_by', labelByValue)
      } else {
        newParams.delete('label_by')
      }

      setSearchParams(newParams)

      return {
        ...prevFilters,
        label_id: newLabelIds
      }
    })
  }

  const HEADER_TOTAL_KEY = 'x-total'
  const DATE_FILTER_KEYS = ['created_gt', 'created_lt', 'updated_gt', 'updated_lt'] as const
  const DEFAULT_COUNT = 0

  /**
   * Extracts the count from API response, prioritizing x-total header over array length
   * @param data - The API response data
   * @param headers - Response headers containing x-total count
   * @returns The count as a number
   */
  const extractCountFromResponse = (data: unknown, headers: Headers | undefined): number => {
    const headerCount = headers?.get(HEADER_TOTAL_KEY)
    if (headerCount) {
      const parsed = parseInt(headerCount, 10)
      return isNaN(parsed) ? DEFAULT_COUNT : parsed
    }
    return Array.isArray(data) ? data.length : DEFAULT_COUNT
  }

  /**
   * Checks if a value is considered "empty" for filter purposes
   * Simplified logic for better performance and readability
   * @param value - The value to check
   * @returns True if the value is empty
   */
  const isEmptyValue = (value: unknown): boolean => {
    if (!value) return true
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object' && !(value instanceof Date)) {
      return Object.keys(value as Record<string, unknown>).length === 0
    }
    if (typeof value === 'string') return value.trim() === ''
    if (typeof value === 'number') return value === 0
    return false
  }

  /**
   * Determines if any filters are currently active
   * Optimized for performance with early returns and simplified logic
   * @returns True if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    if (query?.trim() || defaultAuthorId || labelBy) return true
    if (filterValues && Object.keys(filterValues).length > 0) {
      return Object.values(filterValues).some(value => !isEmptyValue(value))
    }
    const urlParams = new URLSearchParams(searchParams)
    return DATE_FILTER_KEYS.some(key => urlParams.get(key))
  }, [query, filterValues, defaultAuthorId, labelBy, searchParams, isEmptyValue])

  /**
   * Updates pull request data in the store
   */
  useEffect(() => {
    if (!pullRequestData) return

    const validPullRequests = Array.isArray(pullRequestData) ? pullRequestData.filter(pr => pr !== null) : []
    setPullRequests(validPullRequests, headers)
  }, [pullRequestData, headers, setPullRequests])

  /**
   * Updates counters based on filtered data and handles auto-switching logic
   */
  useEffect(() => {
    if (!openPRData || !closedPRData) return

    const openCount = extractCountFromResponse(openPRData, openHeaders)
    const closedCount = extractCountFromResponse(closedPRData, closedHeaders)

    // Handle auto-switching to closed tab when author filter is applied and no open PRs
    if (defaultAuthorId) {
      const shouldSwitch = shouldSwitchToClosedTab(!!defaultAuthorId, openCount, closedCount)
      if (shouldSwitch && !shouldSwitchToClosed) {
        setShouldSwitchToClosed(true)
        setPrState(['closed', 'merged'])
      }
    }

    setOpenClosePullRequests(openCount, closedCount)
  }, [
    openPRData,
    closedPRData,
    openHeaders,
    closedHeaders,
    defaultAuthorId,
    shouldSwitchToClosed,
    shouldSwitchToClosedTab,
    setOpenClosePullRequests,
    setPrState
  ])

  /**
   * Uses static counters when no filters are applied
   */
  useEffect(() => {
    if (!hasActiveFilters && repoData) {
      const {
        num_open_pulls = DEFAULT_COUNT,
        num_closed_pulls = DEFAULT_COUNT,
        num_merged_pulls = DEFAULT_COUNT
      } = repoData
      setOpenClosePullRequests(num_open_pulls, num_closed_pulls + num_merged_pulls)
    }
  }, [hasActiveFilters, repoData, setOpenClosePullRequests])

  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])

  useEffect(() => {
    if (labelBy) {
      setPopulateLabelStore(true)
    }
  }, [labelBy])

  return (
    <SandboxPullRequestListPage
      repoId={repoId}
      spaceId={spaceId || ''}
      isLoading={fetchingPullReqData}
      isPrincipalsLoading={fetchingPrincipalData}
      prCandidateBranches={prCandidateBranches}
      principalsSearchQuery={principalsSearchQuery}
      defaultSelectedAuthorError={defaultSelectedAuthorError}
      principalData={principalDataList}
      currentUser={currentUser}
      defaultSelectedAuthor={defaultSelectedAuthor}
      repository={repoData}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      useLabelsStore={useLabelsStore}
      usePullRequestListStore={usePullRequestListStore}
      onFilterOpen={(filterValues: keyof PRListFilters) => {
        if (filterValues === 'label_by') {
          setPopulateLabelStore(true)
        }
      }}
      onFilterChange={filterData =>
        setFilterValues(
          buildPRFilters({
            filterData,
            scope: { accountId, orgIdentifier, projectIdentifier },
            reviewerId: currentUser?.id
          })
        )
      }
      searchQuery={query}
      setSearchQuery={setQuery}
      onLabelClick={onLabelClick}
      toPullRequest={({ prNumber }) => prNumber.toString()}
      scope={{ accountId, orgIdentifier, projectIdentifier }}
    />
  )
}
