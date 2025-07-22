import { useEffect, useState } from 'react'
import { Params, useParams, useSearchParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import {
  ListPullReqQueryQueryParams,
  TypesPullReqRepo,
  useGetPrincipalQuery,
  useListPrincipalsQuery
} from '@harnessio/code-service-client'
import { PullRequestListPage as SandboxPullRequestListPage, type PRListFilters } from '@harnessio/ui/views'

import { useMFEContext } from '../../../framework/hooks/useMFEContext'
import { parseAsInteger, useQueryState } from '../../../framework/hooks/useQueryState'
import { useAPIPath } from '../../../hooks/useAPIPath'
import { PathParams } from '../../../RouteDefinitions'
import { buildPRFilters } from '../../pull-request/pull-request-utils'
import { usePullRequestListStore } from '../../pull-request/stores/pull-request-list-store'
import { usePopulateLabelStore } from '../../repo/labels/hooks/use-populate-label-store'
import { useLabelsStore } from '../stores/labels-store'

export default function PullRequestListPage() {
  const { setPullRequests, page, setPage, setOpenClosePullRequests, labelsQuery } = usePullRequestListStore()
  const { spaceId } = useParams<PathParams>()

  /* Query and Pagination */
  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [filterValues, setFilterValues] = useState<ListPullReqQueryQueryParams>({})
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState<string>()
  const [populateLabelStore, setPopulateLabelStore] = useState(false)
  const [searchParams] = useSearchParams()
  const defaultAuthorId = searchParams.get('created_by')
  const labelBy = searchParams.get('label_by')
  const mfeContext = useMFEContext()
  usePopulateLabelStore({ queryPage, query: labelsQuery, enabled: populateLabelStore, inherited: true })
  const getApiPath = useAPIPath()

  const { accountId = '', orgIdentifier = '', projectIdentifier = '' } = mfeContext?.scope || {}

  const queryKey = ['pullRequests', accountId, orgIdentifier, projectIdentifier, page, query]

  const queryParams: Params<string> = {
    accountIdentifier: accountId,
    orgIdentifier: orgIdentifier,
    projectIdentifier: projectIdentifier,
    limit: '10',
    exclude_description: 'true',
    page: String(page),
    sort: 'merged',
    order: 'desc',
    query: query ?? '',
    include_subspaces: 'true'
  }

  /**
   *
   * Currently, this api is not present in openapi spec, so we are using fetch directly.
   * @todo replace with react query hook once present.
   */
  const fetchPullRequests = async (): Promise<{
    data: TypesPullReqRepo[]
    headers: Headers
  }> => {
    const apiPath = getApiPath('/api/v1/pullreq')
    const url = new URL(apiPath, window.location.origin)

    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()
    return { data, headers: response.headers }
  }

  const { data: pullRequestData, isFetching: fetchingPullReqData } = useQuery({
    queryKey,
    queryFn: fetchPullRequests,
    select: ({ data, headers }) => ({
      pullRequestData: data.flatMap(item =>
        item.pull_request ? [{ ...item.pull_request, repoId: item.repository?.identifier }] : []
      ),
      headers
    })
  })

  const { data: { body: defaultSelectedAuthor } = {}, error: defaultSelectedAuthorError } = useGetPrincipalQuery(
    {
      queryParams: { page, accountIdentifier: mfeContext?.scope?.accountId, ...filterValues },
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
        accountIdentifier: mfeContext?.scope?.accountId
      }
    },
    {
      enabled: principalsSearchQuery !== undefined
    }
  )

  useEffect(() => {
    if (pullRequestData) {
      setPullRequests(pullRequestData.pullRequestData, pullRequestData.headers)
      setOpenClosePullRequests(pullRequestData.pullRequestData)
    }
  }, [pullRequestData, setPullRequests, setOpenClosePullRequests])

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
      spaceId={spaceId || ''}
      isLoading={fetchingPullReqData}
      isPrincipalsLoading={fetchingPrincipalData}
      principalsSearchQuery={principalsSearchQuery}
      defaultSelectedAuthorError={defaultSelectedAuthorError}
      principalData={principalDataList}
      defaultSelectedAuthor={defaultSelectedAuthor}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      useLabelsStore={useLabelsStore}
      usePullRequestListStore={usePullRequestListStore}
      onFilterOpen={(filterValues: keyof PRListFilters) => {
        if (filterValues === 'label_by') {
          setPopulateLabelStore(true)
        }
      }}
      onFilterChange={filterData => setFilterValues(buildPRFilters(filterData))}
      searchQuery={query}
      setSearchQuery={setQuery}
      toPullRequest={({ prNumber, repoId }) => `/repos/${repoId}/pulls/${prNumber}`}
    />
  )
}
