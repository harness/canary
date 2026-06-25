import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { useListPullReqCommitsQuery } from '@harnessio/code-service-client'
import { PullRequestCommitsView } from '@harnessio/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { usePullRequestCommitsStore } from './stores/pull-request-commit-store'

export function PullRequestCommitPage() {
  const routes = useRoutes()
  const { repoId, spaceId } = useParams<PathParams>()

  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [pageSize, setPageSize] = useState(25)
  const { pathname } = useLocation()

  const { setCommitList, setIsFetchingCommits } = usePullRequestCommitsStore()

  const { isFetching, data: { body: commits, headers } = {} } = useListPullReqCommitsQuery({
    queryParams: { page: queryPage, limit: pageSize },
    repo_ref: repoRef,
    pullreq_number: prId
  })

  // Drive pagination from the commits query's own response headers so it works regardless of
  // whether the shared PR metadata store is hydrated (e.g. on a direct hit to this tab).
  const xNextPage = useMemo(() => parseInt(headers?.get(PageResponseHeader.xNextPage) || ''), [headers])
  const xPrevPage = useMemo(() => parseInt(headers?.get(PageResponseHeader.xPrevPage) || ''), [headers])

  useEffect(() => {
    if (commits) {
      setIsFetchingCommits(false)
      setCommitList(commits)
    }
  }, [commits, setCommitList, pathname])

  useEffect(() => {
    setIsFetchingCommits(isFetching)
  }, [isFetching])

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size)
      setQueryPage(1)
    },
    [setQueryPage]
  )

  return (
    <PullRequestCommitsView
      toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
      toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      toPullRequestChange={({ commitSHA }) =>
        routes.toPullRequestChange({ spaceId, repoId, commitSHA, pullRequestId: String(pullRequestId) })
      }
      usePullRequestCommitsStore={usePullRequestCommitsStore}
      currentPage={queryPage}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
      pageSize={pageSize}
      setPageSize={handlePageSizeChange}
    />
  )
}

PullRequestCommitPage.displayName = 'PullRequestCommitPage'
