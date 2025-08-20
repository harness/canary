import { FC, useCallback } from 'react'

import { NoData, Pagination, Skeleton } from '@/components'
import { useTranslation } from '@/context'
import { CommitsList, IPullRequestCommitsStore, TypesCommit } from '@/views'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
interface RepoPullRequestCommitsViewProps extends Partial<RoutingProps> {
  usePullRequestCommitsStore: () => IPullRequestCommitsStore
}

const PullRequestCommitsView: FC<RepoPullRequestCommitsViewProps> = ({
  usePullRequestCommitsStore,
  toCommitDetails,
  toCode
}) => {
  const { commitsList, xNextPage, xPrevPage, isFetchingCommits } = usePullRequestCommitsStore()
  const { t } = useTranslation()

  const getPrevPageLink = useCallback(() => {
    return `?page=${xPrevPage}`
  }, [xPrevPage])

  const getNextPageLink = useCallback(() => {
    return `?page=${xNextPage}`
  }, [xNextPage])

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
          className="mt-cn-xl"
          data={commitsList.map((item: TypesCommit) => ({
            sha: item.sha,
            parent_shas: item.parent_shas,
            title: item.title,
            message: item.message,
            author: item.author,
            committer: item.committer
          }))}
        />
      )}

      <Pagination
        indeterminate
        hasNext={xNextPage > 0}
        hasPrevious={xPrevPage > 0}
        getPrevPageLink={getPrevPageLink}
        getNextPageLink={getNextPageLink}
      />
    </>
  )
}

PullRequestCommitsView.displayName = 'PullRequestCommitsView'

export { PullRequestCommitsView }
