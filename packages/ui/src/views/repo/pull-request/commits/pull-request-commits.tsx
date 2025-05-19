import { FC, useCallback } from 'react'

import { NoData, Pagination, SkeletonList } from '@/components'
import { CommitsList, IPullRequestCommitsStore, SandboxLayout, TranslationStore, TypesCommit } from '@/views'

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
interface RepoPullRequestCommitsViewProps extends Partial<RoutingProps> {
  useTranslationStore: () => TranslationStore
  usePullRequestCommitsStore: () => IPullRequestCommitsStore
}

const PullRequestCommitsView: FC<RepoPullRequestCommitsViewProps> = ({
  useTranslationStore,
  usePullRequestCommitsStore,
  toCommitDetails,
  toCode
}) => {
  const { commitsList, xNextPage, xPrevPage, isFetchingCommits } = usePullRequestCommitsStore()
  const { t } = useTranslationStore()

  const getPrevPageLink = useCallback(() => {
    return `?page=${xPrevPage}`
  }, [xPrevPage])

  const getNextPageLink = useCallback(() => {
    return `?page=${xNextPage}`
  }, [xNextPage])

  if (isFetchingCommits) {
    return <SkeletonList />
  }

  return (
    <SandboxLayout.Content className="pt-0">
      {!commitsList?.length && (
        <NoData
          iconName="no-data-folder"
          title={t('views:pullRequests.noCommitsYet')}
          description={[t('views:pullRequests.noCommitDataDescription')]}
        />
      )}

      {!!commitsList?.length && (
        <CommitsList
          toCode={toCode}
          toCommitDetails={toCommitDetails}
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
        t={t}
      />
    </SandboxLayout.Content>
  )
}

PullRequestCommitsView.displayName = 'PullRequestCommitsView'

export { PullRequestCommitsView }
