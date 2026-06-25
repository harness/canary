import { FC, useCallback } from 'react'

import { CommitsList, IPullRequestCommitsStore, TypesCommit } from '@views'

import { NoData, Pagination, Skeleton } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toPullRequestChange?: ({ commitSHA }: { commitSHA: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
interface RepoPullRequestCommitsViewProps extends Partial<RoutingProps> {
  usePullRequestCommitsStore: () => IPullRequestCommitsStore
  currentPage?: number
  xNextPage?: number
  xPrevPage?: number
  pageSize?: number
  setPageSize?: (size: number) => void
}

const PullRequestCommitsView: FC<RepoPullRequestCommitsViewProps> = ({
  usePullRequestCommitsStore,
  toCommitDetails,
  toPullRequestChange,
  toCode,
  currentPage,
  xNextPage = 0,
  xPrevPage = 0,
  pageSize,
  setPageSize
}) => {
  const { commitsList, isFetchingCommits } = usePullRequestCommitsStore()
  const { t } = useTranslation()

  const getPrevPageLink = useCallback(() => `?page=${xPrevPage}`, [xPrevPage])
  const getNextPageLink = useCallback(() => `?page=${xNextPage}`, [xNextPage])

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
        <>
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

          <Pagination
            indeterminate
            currentPage={currentPage}
            hasNext={xNextPage > 0}
            hasPrevious={xPrevPage > 0}
            getPrevPageLink={getPrevPageLink}
            getNextPageLink={getNextPageLink}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </>
  )
}

PullRequestCommitsView.displayName = 'PullRequestCommitsView'

export { PullRequestCommitsView }
