import { useCallback, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { useListPullReqCommitsQuery } from '@harnessio/code-service-client'
import { PullRequestCommitsView } from '@harnessio/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestCommitsStore } from './stores/pull-request-commit-store'
import { usePullRequestProviderStore } from './stores/pull-request-provider-store'

export function PullRequestCommitPage() {
  const routes = useRoutes()
  const { repoId, spaceId } = useParams<PathParams>()

  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [pageSize, setPageSize] = useState(25)
  const { pathname } = useLocation()

  const { pullReqMetadata } = usePullRequestProviderStore()
  const totalCommits = pullReqMetadata?.stats?.commits ?? 0

  const { setCommitList, setIsFetchingCommits } = usePullRequestCommitsStore()

  const { isFetching, data: { body: commits } = {} } = useListPullReqCommitsQuery({
    queryParams: { page: queryPage, limit: pageSize },
    repo_ref: repoRef,
    pullreq_number: prId
  })

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
      totalCommits={totalCommits}
      pageSize={pageSize}
      setPageSize={handlePageSizeChange}
    />
  )
}

PullRequestCommitPage.displayName = 'PullRequestCommitPage'
