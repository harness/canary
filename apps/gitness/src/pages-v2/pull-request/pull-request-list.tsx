import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useFindRepositoryQuery, useListPullReqQuery } from '@harnessio/code-service-client'
import { PullRequestList as SandboxPullRequestListPage } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestListStore } from './stores/pull-request-list-store'

export default function PullRequestListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setPullRequests, page, setPage, setOpenClosePullRequests } = usePullRequestListStore()
  const { spaceId, repoId } = useParams<PathParams>()

  /* Query and Pagination */
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query') || ''
  const queryPage = parseInt(searchParams.get('page') || '1', 10)

  const setQuery = (newQuery: string | null) => {
    setSearchParams({ query: newQuery ?? '', page: String(queryPage) })
  }

  const { data: { body: pullRequestData, headers } = {}, isFetching: fetchingPullReqData } = useListPullReqQuery(
    {
      queryParams: { page, query: query ?? '' },
      repo_ref: repoRef
    },
    { retry: false }
  )

  useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onSuccess: data => {
        setOpenClosePullRequests(data.body)
      }
    }
  )

  useEffect(() => {
    if (pullRequestData) {
      setPullRequests(pullRequestData, headers)
    }
  }, [pullRequestData, headers, setPullRequests])

  useEffect(() => {
    setSearchParams({ page: String(queryPage), query })
  }, [queryPage, query, setSearchParams])

  return (
    <SandboxPullRequestListPage
      repoId={repoId}
      spaceId={spaceId || ''}
      isLoading={fetchingPullReqData}
      usePullRequestListStore={usePullRequestListStore}
      useTranslationStore={useTranslationStore}
      searchQuery={query}
      setSearchQuery={setQuery}
    />
  )
}
