import { FC } from 'react'

import { NoData } from '@components/no-data'
import { PaginationComponent } from '@components/pagination-component'
import { CommitsList, SandboxLayout, TranslationStore, TypesCommit } from '@views/index'

import { IPullRequestCommitsStore } from './pull-request-commits.types'

interface RepoPullRequestCommitsViewProps {
  useTranslationStore: () => TranslationStore
  usePullRequestCommitsStore: () => IPullRequestCommitsStore
}

const PullRequestCommitsView: FC<RepoPullRequestCommitsViewProps> = ({
  useTranslationStore,
  usePullRequestCommitsStore
}) => {
  const { commitsList, xNextPage, xPrevPage, page, setPage } = usePullRequestCommitsStore()
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Content>
      {!commitsList?.length && (
        <NoData
          iconName="no-data-folder"
          title={t('views:pullRequests.noCommitsYet')}
          description={[t('views:pullRequests.noCommitDataDescription')]}
        />
      )}

      {commitsList?.length && (
        <CommitsList
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
