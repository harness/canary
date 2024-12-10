import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { useFindRepositoryQuery, useListPullReqQuery } from '@harnessio/code-service-client'
import { PullRequestList as SandboxPullRequestListPage } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestStore } from './stores/pull-request-store'

export default function PullRequestListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setPullRequests, page, setPage, setOpenClosePullRequests } = usePullRequestStore()
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
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])

  return (
    <SandboxPullRequestListPage
      repoId={repoId}
      spaceId={spaceId}
      isLoading={fetchingPullReqData}
      usePullRequestStore={usePullRequestStore}
      useTranslationStore={useTranslationStore}
      searchQuery={query}
      setSearchQuery={setQuery}
    />
  )
}
