import { useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { Spacer } from '@harnessio/canary'
import { TypesCommit, useListPullReqCommitsQuery } from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import { NoData, PaginationComponent, PullRequestCommits } from '@harnessio/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { PathParams } from '../RouteDefinitions'
import { PageResponseHeader } from '../types'

export default function PullRequestCommitsPage() {
  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: commitData, headers } = {}, isFetching } = useListPullReqCommitsQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: { page }
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  const renderContent = () => {
    if (isFetching) {
      return <SkeletonList />
    }
    if (commitData?.length) {
      return (
        <PullRequestCommits
          data={commitData?.map((item: TypesCommit) => ({
            sha: item.sha,
            parent_shas: item.parent_shas,
            title: item.title,
            message: item.message,
            author: item.author,
            committer: item.committer
          }))}
        />
      )
    } else {
      return (
        <NoData
          iconName="no-data-folder"
          title="No commits yet"
          description={['There are no commits for this pull request yet.']}
        />
      )
    }
  }

  return (
    <>
      {renderContent()}
      <Spacer size={8} />
      <PaginationComponent
        nextPage={xNextPage}
        previousPage={xPrevPage}
        currentPage={page}
        goToPage={(pageNum: number) => setPage(pageNum)}
      />
    </>
  )
}
