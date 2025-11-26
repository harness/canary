import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  ListPullReqQueryQueryParams,
  useGetPrincipalQuery,
  useGetUserQuery,
  useListPrincipalsQuery,
  useListPullReqQuery,
  usePrCandidatesQuery
} from '@harnessio/code-service-client'
import {
  EnumPullReqState,
  PullRequestListPage as SandboxPullRequestListPage,
  type PRListFilters
} from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useGitRef } from '../../hooks/useGitRef'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { useLabelsStore } from '../project/stores/labels-store'
import { usePopulateLabelStore } from '../repo/labels/hooks/use-populate-label-store'
import { buildPRFilters } from './pull-request-utils'
import { usePullRequestListStore } from './stores/pull-request-list-store'

export default function PullRequestListPage() {
  const routes = useRoutes()
  const repoRef = useGetRepoRef() ?? ''
  const { setPullRequests, page, setPage, pageSize, setOpenClosePullRequests, labelsQuery, prState, setPrState } =
    usePullRequestListStore()
  const { spaceId, repoId } = useParams<PathParams>()
  const { repoData } = useGitRef()

  /* Query and Pagination */
  const [query, setQuery] = useQueryState('query')
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })
  const [filterValues, setFilterValues] = useState<ListPullReqQueryQueryParams>({})
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState<string>()
  const [populateLabelStore, setPopulateLabelStore] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultAuthorId = searchParams.get('created_by')
  const labelBy = searchParams.get('label_by')
  const { scope } = useMFEContext()
  const { accountId = '', orgIdentifier, projectIdentifier } = scope || {}
  const filtersCnt = Object.keys(filterValues).length + (query?.length ? 1 : 0)

  usePopulateLabelStore({ queryPage, query: labelsQuery, enabled: populateLabelStore, inherited: true })

  const { data: { body: pullRequestData, headers } = {}, isFetching: fetchingPullReqData } = useListPullReqQuery(
    {
      queryParams: {
        page,
        state: prState,
        query: query ?? '',
        exclude_description: true,
        sort: prState.includes('merged') ? 'merged' : 'number',
        order: 'desc',
        limit: pageSize,
        ...filterValues
      },
      repo_ref: repoRef,
      stringifyQueryParamsOptions: {
        arrayFormat: 'repeat'
      }
    },
    { retry: false }
  )

  // Make separate API calls to get open and closed PR counts for the filtered author
  const { data: { headers: openHeaders } = {} } = useListPullReqQuery(
    {
      queryParams: {
        page: 1,
        state: ['open'],
        query: query ?? '',
        limit: 0,
        exclude_description: true,
        ...filterValues
      },
      repo_ref: repoRef,
      stringifyQueryParamsOptions: {
        arrayFormat: 'repeat'
      }
    },
    {
      enabled: filtersCnt > 0
    }
  )

  const { data: { headers: closedHeaders } = {} } = useListPullReqQuery(
    {
      queryParams: {
        page: 1,
        state: ['closed'],
        query: query ?? '',
        limit: 0,
        exclude_description: true,
        ...filterValues
      },
      repo_ref: repoRef,
      stringifyQueryParamsOptions: {
        arrayFormat: 'repeat'
      }
    },
    {
      enabled: filtersCnt > 0
    }
  )

  const { data: { headers: mergedHeaders } = {} } = useListPullReqQuery(
    {
      queryParams: {
        page: 1,
        state: ['merged'],
        query: query ?? '',
        limit: 0,
        exclude_description: true,
        ...filterValues
      },
      repo_ref: repoRef,
      stringifyQueryParamsOptions: {
        arrayFormat: 'repeat'
      }
    },
    {
      enabled: filtersCnt > 0
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
        const labelByValue = newLabelIds.map(id => `${id}`).join(';')
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

  useEffect(() => {
    if (pullRequestData) {
      const validPullRequests = Array.isArray(pullRequestData) ? pullRequestData.filter(pr => pr !== null) : []
      setPullRequests(validPullRequests, headers)
    }
  }, [pullRequestData, headers, setPullRequests])

  useEffect(() => {
    if (openHeaders && closedHeaders && mergedHeaders) {
      const openCount = parseInt(openHeaders?.get(PageResponseHeader.xTotal) || '0')
      const closedCount = parseInt(closedHeaders?.get(PageResponseHeader.xTotal) || '0')
      const mergedCount = parseInt(mergedHeaders?.get(PageResponseHeader.xTotal) || '0')

      const [currState] = prState

      const determineState = (): EnumPullReqState[] => {
        // If current state has PRs, maintain it
        if (currState === 'open' && openCount > 0) return ['open']
        if (currState === 'merged' && mergedCount > 0) return ['merged']
        if (currState === 'closed' && closedCount > 0) return ['closed']

        // Otherwise follow priority: open > merged > closed
        if (openCount > 0) return ['open']
        if (mergedCount > 0) return ['merged']
        if (closedCount > 0) return ['closed']

        return ['open']
      }

      const [newState] = determineState()
      if (newState !== currState) {
        setPrState([newState])
      }

      setOpenClosePullRequests(openCount, closedCount, mergedCount)
    }
  }, [openHeaders, closedHeaders, mergedHeaders, setOpenClosePullRequests, setPrState])

  useEffect(() => {
    if (filtersCnt !== 0) return
    const { num_open_pulls = 0, num_closed_pulls = 0, num_merged_pulls = 0 } = repoData || {}
    setOpenClosePullRequests(num_open_pulls, num_closed_pulls, num_merged_pulls)
  }, [repoData, setOpenClosePullRequests, filtersCnt])

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
      toBranch={({ branch }) => `${routes.toRepoFiles({ spaceId, repoId })}/${branch}`}
    />
  )
}
