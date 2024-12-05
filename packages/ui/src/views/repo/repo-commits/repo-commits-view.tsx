import { NoData } from '@components/no-data'
import { PaginationComponent } from '@components/pagination-component'
import { SkeletonList } from '@components/skeleton-list'
import { Spacer } from '@components/spacer'
import { Text } from '@components/text'
import { IBranchSelectorStore, SandboxLayout, TranslationStore } from '@views/index'

import { BranchSelector } from '../components/branch-selector/branch-selector'
import { CommitsList } from './components/commits-list'
import { TypesCommit } from './types'

interface RepoCommitsViewProps {
  isFetchingCommits: boolean
  isFetchingBranches: boolean
  commitsList: TypesCommit[] | null | undefined
  xNextPage: number
  xPrevPage: number
  page: number
  setPage: (page: number) => void
  useTranslationStore: () => TranslationStore
  useBranchSelectorStore: () => IBranchSelectorStore
}

export const RepoCommitsView = (props: RepoCommitsViewProps) => {
  const { t } = props.useTranslationStore()
  const { branchList } = props.useBranchSelectorStore()

  return (
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Commits
        </Text>
        <Spacer size={6} />
        <div className="flex justify-between gap-5">
          {!props.isFetchingBranches && branchList && (
            <BranchSelector
              useBranchSelectorStore={props.useBranchSelectorStore}
              useTranslationStore={props.useTranslationStore}
            />
          )}
        </div>
        <Spacer size={5} />

        {props.isFetchingCommits && <SkeletonList />}

        {!props.commitsList?.length && (
          <NoData iconName="no-data-folder" title="No commits yet" description={['There are no commits yet.']} />
        )}

        {!props.isFetchingCommits && props.commitsList?.length && (
          <CommitsList
            data={props.commitsList.map((item: TypesCommit) => ({
              sha: item.sha,
              parent_shas: item.parent_shas,
              title: item.title,
              message: item.message,
              author: item.author,
              committer: item.committer
            }))}
          />
        )}

        <Spacer size={8} />
        <PaginationComponent
          nextPage={props.xNextPage}
          previousPage={props.xPrevPage}
          currentPage={props.page}
          goToPage={(pageNum: number) => props.setPage(pageNum)}
          t={t}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
