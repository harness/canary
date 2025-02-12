import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  ListPullReqQueryQueryParams,
  TypesPrincipalInfo,
  useListPrincipalsQuery,
  useListPullReqQuery
} from '@harnessio/code-service-client'
import { PullRequestList as SandboxPullRequestListPage, type PRListFilters } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
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
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState('')
  const [principalData, setPrincipalData] = useState<TypesPrincipalInfo[]>()

  const { data: { body: pullRequestData, headers } = {}, isFetching: fetchingPullReqData } = useListPullReqQuery(
    {
      queryParams: { page, query: query ?? '', ...filterValues },
      repo_ref: repoRef
    },
    { retry: false }
  )

  const { data: { body: principalDataList } = {} } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user', query: principalsSearchQuery }
  })

  useEffect(() => {
    if (pullRequestData) {
      setPullRequests(pullRequestData, headers)
      setOpenClosePullRequests(pullRequestData)
    }
  }, [pullRequestData, headers, setPullRequests])

  useEffect(() => {
    if (principalDataList) {
      setPrincipalData(principalDataList)
    }
  }, [principalDataList])

  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])

  return (
    <SandboxPullRequestListPage
      repoId={repoId}
      spaceId={spaceId || ''}
      isLoading={fetchingPullReqData}
      principalData={principalData}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      usePullRequestListStore={usePullRequestListStore}
      useTranslationStore={useTranslationStore}
      onFilterChange={(filterData: PRListFilters) => {
        setFilterValues(
          // TODO Need to address the type issue here
          Object.entries(filterData).reduce((acc: any, [key, value]) => {
            if (value !== '' && value !== undefined) {
              acc[key] = value
            }
            if (value instanceof Date) {
              acc[key] = value.getTime()
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
