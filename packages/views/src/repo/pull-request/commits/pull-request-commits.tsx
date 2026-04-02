import { FC } from 'react'

import { CommitsList, IPullRequestCommitsStore, TypesCommit } from '@views'

import { NoData, Pagination, Skeleton } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

const getPageLink = (pageNum: number) => `?page=${pageNum}`

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toPullRequestChange?: ({ commitSHA }: { commitSHA: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
interface RepoPullRequestCommitsViewProps extends Partial<RoutingProps> {
  usePullRequestCommitsStore: () => IPullRequestCommitsStore
  currentPage?: number
  totalCommits?: number
  pageSize?: number
  setPageSize?: (size: number) => void
}

const PullRequestCommitsView: FC<RepoPullRequestCommitsViewProps> = ({
  usePullRequestCommitsStore,
  toCommitDetails,
  toPullRequestChange,
  toCode,
  currentPage,
  totalCommits,
  pageSize,
  setPageSize
}) => {
  const { commitsList, isFetchingCommits } = usePullRequestCommitsStore()
  const { t } = useTranslation()

  if (isFetchingCommits) {
    return <Skeleton.List className="mt-cn-xl" />
  }

  return (
    <>
      {!commitsList?.length && (
        <NoData
          className="mt-cn-xl"
          imageName="no-data-folder"
          title={t('views:pullRequests.noCommitsYet')}
          description={[t('views:pullRequests.noCommitDataDescription')]}
        />
      )}

      {!!commitsList?.length && (
        <CommitsList
          toCode={toCode}
          toCommitDetails={toCommitDetails}
          toPullRequestChange={toPullRequestChange}
          onPRCommitListing
          className="mt-cn-xl"
          data={commitsList.map((item: TypesCommit) => ({
            sha: item.sha,
            parent_shas: item.parent_shas,
            title: item.title,
            message: item.message,
            author: item.author,
            committer: item.committer,
            signature: item.signature
          }))}
        />
      )}

      {totalCommits && pageSize && currentPage ? (
        <Pagination
          currentPage={currentPage}
          totalItems={totalCommits}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          getPageLink={getPageLink}
        />
      ) : null}
    </>
  )
}

PullRequestCommitsView.displayName = 'PullRequestCommitsView'

export { PullRequestCommitsView }
