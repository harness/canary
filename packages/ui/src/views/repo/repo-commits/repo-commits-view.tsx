import { NoData } from '@components/no-data'
import { PaginationComponent } from '@components/pagination-component'
import { SkeletonList } from '@components/skeleton-list'
import { Spacer } from '@components/spacer'
import { Text } from '@components/text'
import { BranchSelectorListItem, SandboxLayout, TranslationStore } from '@views/index'

import { BranchSelector } from '../components/branch-selector/branch-selector'
import { CommitsList } from './components/commits-list'
import { TypesCommit } from './types'

interface RepoCommitsViewProps {
  isFetchingCommits: boolean
  commitsList: TypesCommit[] | null | undefined
  isFetchingBranches: boolean
  branches?: {
    name?: string
    sha?: string
  }[]
  selectedBranch: BranchSelectorListItem
  selectBranch: (branch: BranchSelectorListItem) => void
  xNextPage: number
  xPrevPage: number
  page: number
  setPage: (page: number) => void
  repoId: string
  tagList: BranchSelectorListItem[]
  spaceId: string
  useTranslationStore: () => TranslationStore
}

export const RepoCommitsView = (props: RepoCommitsViewProps) => {
  const { isFetchingCommits, isFetchingBranches, branches, selectedBranch, selectBranch } = props
  const { t } = props.useTranslationStore()

  return (
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Commits
        </Text>
        <Spacer size={6} />
        <div className="flex justify-between gap-5">
          {!isFetchingBranches && branches && (
            <BranchSelector
              branchList={branches.map(item => ({
                name: item.name || '',
                sha: item.sha || ''
              }))}
              selectedBranch={selectedBranch}
              tagList={props.tagList}
              onSelectBranch={selectBranch}
              repoId={props.repoId}
              spaceId={props.spaceId}
              useTranslationStore={props.useTranslationStore}
            />
          )}
        </div>
        <Spacer size={5} />

        {isFetchingCommits && <SkeletonList />}

        {!props.commitsList?.length && (
          <NoData iconName="no-data-folder" title="No commits yet" description={['There are no commits yet.']} />
        )}

        {!isFetchingCommits && props.commitsList?.length && (
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
