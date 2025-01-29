import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { useListPullReqCommitsQuery } from '@harnessio/code-service-client'
import { PullRequestCommitsView } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestCommitsStore } from './stores/pull-request-commit-store'

export function PullRequestCommitPage() {
  const routes = useRoutes()
  const { repoId, spaceId } = useParams<PathParams>()

  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { pathname } = useLocation()

  const { page, setPage, setCommitList, setIsFetchingCommits, setPaginationFromHeaders } = usePullRequestCommitsStore()

  const { isFetching, data: { body: commits, headers } = {} } = useListPullReqCommitsQuery({
    queryParams: { page: queryPage },
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
    if (isFetching) {
      setIsFetchingCommits(isFetching)
    }
  }, [isFetching, setIsFetchingCommits])

  useEffect(() => {
    setPaginationFromHeaders(headers)
  }, [headers, setPaginationFromHeaders])

  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])

  return (
    <PullRequestCommitsView
      toCode={({ sha }: { sha: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${sha}`}
      toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      usePullRequestCommitsStore={usePullRequestCommitsStore}
      useTranslationStore={useTranslationStore}
    />
  )
}
