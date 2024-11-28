import { useEffect } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import { useListPullReqQuery } from '@harnessio/code-service-client'
import { PullRequestListPage as SandboxPullRequestListPage } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { usePullRequestStore } from './stores/pull-request-store'

export default function PullRequestListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setPullRequests, page, setPage } = usePullRequestStore()

  /* Query and Pagination */
  const [query] = useDebouncedQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: pullRequestData, headers } = {} } = useListPullReqQuery(
    {
      queryParams: { page, query },
      repo_ref: repoRef
    },
    { retry: false }
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

  return <SandboxPullRequestListPage usePullRequestStore={usePullRequestStore} />
}
