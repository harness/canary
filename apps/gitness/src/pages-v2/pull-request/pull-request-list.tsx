import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  ListPullReqQueryQueryParams,
  useGetPrincipalQuery,
  useListPrincipalsQuery,
  useListPullReqQuery
} from '@harnessio/code-service-client'
import { PullRequestList as SandboxPullRequestListPage, type PRListFilters } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestListStore } from './stores/pull-request-list-store'

export default function PullRequestListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setPullRequests, page, setPage, setOpenClosePullRequests } = usePullRequestListStore()
  const { spaceId, repoId } = useParams<PathParams>()

  /* Query and Pagination */
  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [filterValues, setFilterValues] = useState<ListPullReqQueryQueryParams>({})
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState<string>()
  const [searchParams] = useSearchParams()
  const defaultAuthorId = searchParams.get('created_by')
  const mfeContext = useMFEContext()

  const { data: { body: pullRequestData, headers } = {}, isFetching: fetchingPullReqData } = useListPullReqQuery(
    {
      queryParams: { page, query: query ?? '', ...filterValues },
      repo_ref: repoRef
    },
    { retry: false }
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
      setPullRequests(pullRequestData, headers)
      setOpenClosePullRequests(pullRequestData)
    }
  }, [pullRequestData, headers, setPullRequests])

  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])

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
      usePullRequestListStore={usePullRequestListStore}
      useTranslationStore={useTranslationStore}
      onFilterChange={(filterData: PRListFilters) => {
        setFilterValues(
          Object.entries(filterData).reduce(
            (acc: Record<string, ListPullReqQueryQueryParams[keyof ListPullReqQueryQueryParams]>, [key, value]) => {
              if (value instanceof Date) {
                acc[key] = value.getTime().toString()
              }
              if (value !== undefined && !(value instanceof Date)) {
                acc[key] = value.value
              }
              return acc
            },
            {}
          )
        )
      }}
      searchQuery={query}
      setSearchQuery={setQuery}
    />
  )
}
