import { NoData } from '@components/no-data'
import { PaginationComponent } from '@components/pagination-component'
import { SkeletonList } from '@components/skeleton-list'
import { Spacer } from '@components/spacer'
import { Text } from '@components/text'
import { SandboxLayout } from '@views/index'

import { Filter } from './components/filter'
import { PullRequestCommits } from './components/pull-request-commits'
import { RepoCommitsBranchSelector } from './components/repo-commits-branch-selector'
import { TypesCommit } from './types'

interface RepoCommitsViewProps {
  isFetchingCommits: boolean
  commitsList: TypesCommit[] | null | undefined
  isFetchingBranches: boolean
  branches?: {
    name?: string
  }[]
  selectedBranch: string
  selectBranch: (branch: string) => void
  xNextPage: number
  xPrevPage: number
  page: number
  setPage: (page: number) => void
  sortOptions: {
    name: string
  }[]
  sort: string | null
  setSort: (sort: string) => void
  query: string | null
  setQuery: (query: string) => void
}

export const RepoCommitsView = (props: RepoCommitsViewProps) => {
  const { isFetchingCommits, isFetchingBranches, branches, selectedBranch, selectBranch } = props

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
            <RepoCommitsBranchSelector
              name={selectedBranch}
              branchList={branches.map(item => ({
                name: item.name || ''
              }))}
              selectBranch={(branch: string) => selectBranch(branch)}
            />
          )}

          <Filter
            showSearch={false}
            sortOptions={props.sortOptions}
            sort={props.sort}
            setSort={props.setSort}
            query={props.query}
            setQuery={props.setQuery}
          />
        </div>
        <Spacer size={5} />

        {isFetchingCommits ? (
          <SkeletonList />
        ) : !props.commitsList?.length ? (
          <NoData iconName="no-data-folder" title="No commits yet" description={['There are no commits yet.']} />
        ) : (
          <PullRequestCommits
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
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
