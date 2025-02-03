import { FC } from 'react'

import { NoData } from '@components/no-data'
import { PaginationComponent } from '@components/pagination-component'
import { SkeletonList } from '@components/skeletons'
import { CommitsList, SandboxLayout, TranslationStore, TypesCommit } from '@views/index'

import { IPullRequestCommitsStore } from './pull-request-commits.types'

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
  const { commitsList, xNextPage, xPrevPage, page, setPage, isFetchingCommits } = usePullRequestCommitsStore()
  const { t } = useTranslationStore()

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

      {commitsList?.length && (
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

      <PaginationComponent
        nextPage={xNextPage}
        previousPage={xPrevPage}
        currentPage={page}
        goToPage={(pageNum: number) => setPage(pageNum)}
        t={t}
      />
    </SandboxLayout.Content>
  )
}

export { PullRequestCommitsView }
