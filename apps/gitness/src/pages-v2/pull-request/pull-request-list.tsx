import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useListPullReqQuery } from '@harnessio/code-service-client'
import { PullRequestList as SandboxPullRequestListPage } from '@harnessio/ui/views'

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

  const { data: { body: pullRequestData, headers } = {}, isFetching: fetchingPullReqData } = useListPullReqQuery(
    {
      queryParams: { page, query: query ?? '' },
      repo_ref: repoRef
    },
    { retry: false }
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
      usePullRequestListStore={usePullRequestListStore}
      useTranslationStore={useTranslationStore}
      searchQuery={query}
      setSearchQuery={setQuery}
    />
  )
}
