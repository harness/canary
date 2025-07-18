import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import {
  ListPullReqQueryQueryParams,
  TypesPullReq,
  TypesPullReqRepo,
  useGetPrincipalQuery,
  useListPrincipalsQuery
} from '@harnessio/code-service-client'
import { PullRequestListPage as SandboxPullRequestListPage, type PRListFilters } from '@harnessio/ui/views'

import { useMFEContext } from '../../../framework/hooks/useMFEContext'
import { parseAsInteger, useQueryState } from '../../../framework/hooks/useQueryState'
import { useAPIPath } from '../../../hooks/useAPIPath'
import { PathParams } from '../../../RouteDefinitions'
import { usePullRequestListStore } from '../../pull-request/stores/pull-request-list-store'
import { usePopulateLabelStore } from '../../repo/labels/hooks/use-populate-label-store'
import { useLabelsStore } from '../stores/labels-store'

export default function PullRequestListPage() {
  const { setPullRequests, page, setPage, setOpenClosePullRequests, labelsQuery } = usePullRequestListStore()
  const { spaceId, repoId } = useParams<PathParams>()

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

  const { data: pullRequestData, isFetching: fetchingPullReqData } = useQuery<
    { data: TypesPullReqRepo[]; headers: Headers },
    unknown,
    { pullRequestData: TypesPullReq[]; headers: Headers }
  >(
    queryKey,
    async () => {
      const apiPath = getApiPath('/api/v1/pullreq') // includes routingId
      const url = new URL(apiPath, window.location.origin)

      url.searchParams.set('accountIdentifier', accountId)
      url.searchParams.set('orgIdentifier', orgIdentifier)
      url.searchParams.set('projectIdentifier', projectIdentifier)
      url.searchParams.set('limit', '10')
      url.searchParams.set('exclude_description', 'true')
      url.searchParams.set('page', String(page))
      url.searchParams.set('sort', 'merged')
      url.searchParams.set('order', 'desc')
      url.searchParams.set('query', query ?? '')
      url.searchParams.set('include_subspaces', 'true')

      const response = await fetch(url.toString())

      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      return { data, headers: response.headers }
    },
    {
      select: ({ data, headers }) => ({
        pullRequestData: data.map(item => item.pull_request).filter((pr): pr is TypesPullReq => pr !== undefined),
        headers
      })
    }
  )

  const { data: { body: defaultSelectedAuthor } = {}, error: defaultSelectedAuthorError } = useGetPrincipalQuery(
    {
      queryParams: { page, query: query ?? '', ...filterValues },
      id: Number(searchParams.get('created_by'))
    },
    // Adding staleTime to avoid refetching the data if authorId gets modified in searchParams
    { enabled: !!defaultAuthorId, staleTime: Infinity }
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
      repoId={repoId}
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
      onFilterChange={(filterData: PRListFilters) => {
        setFilterValues(
          Object.entries(filterData).reduce<
            Record<string, ListPullReqQueryQueryParams[keyof ListPullReqQueryQueryParams]>
          >((acc, [key, value]) => {
            if ((key === 'created_gt' || key === 'created_lt') && value instanceof Date) {
              acc[key] = value.getTime().toString()
            }
            if (key === 'created_by' && typeof value === 'object' && 'value' in value) {
              acc[key] = value.value
            }
            if (key === 'label_by') {
              const defaultLabel: { labelId: string[]; valueId: string[] } = { labelId: [], valueId: [] }
              const { labelId, valueId } = Object.entries(value).reduce((labelAcc, [labelKey, value]) => {
                if (value === true) {
                  labelAcc.labelId.push(labelKey)
                } else if (value) {
                  labelAcc.valueId.push(value)
                }
                return labelAcc
              }, defaultLabel)

              acc['label_id'] = labelId.map(Number)
              acc['value_id'] = valueId.map(Number)
            }
            return acc
          }, {})
        )
      }}
      searchQuery={query}
      setSearchQuery={setQuery}
    />
  )
}
