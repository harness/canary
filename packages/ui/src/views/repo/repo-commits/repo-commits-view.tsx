import { NoData } from '@components/no-data'
import { PaginationComponent } from '@components/pagination-component'
import { SkeletonList } from '@components/skeleton-list'
import { Spacer } from '@components/spacer'
import { Text } from '@components/text'
import { RepoCommitsBranchSelector, SandboxLayout } from '@views/index'
import { Options } from 'nuqs'

import { ListBranchesOkResponse } from '@harnessio/code-service-client'

import { Filter } from './components/filter'
import { PullRequestCommits } from './components/pull-request-commits'
import { TypesCommit } from './types'

const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

interface RepoCommitsViewType {
  isFetchingCommits: boolean
  commitsList: TypesCommit[] | null | undefined
  isFetchingBranches: boolean
  branches: ListBranchesOkResponse | undefined
  selectedBranch: string
  selectBranch: (branch: string) => void
  xNextPage: number
  xPrevPage: number
  page: number
  setPage: (value: number | ((old: number) => number | null) | null, options?: Options) => Promise<URLSearchParams>
}

export const RepoCommitsView = ({
  isFetchingCommits,
  commitsList,
  isFetchingBranches,
  branches,
  selectedBranch,
  selectBranch,
  xNextPage,
  xPrevPage,
  page,
  setPage
}: RepoCommitsViewType) => {
  const renderListContent = () => {
    if (isFetchingCommits) return <SkeletonList />
    // const commitsLists = commitData?.commits
    if (!commitsList?.length) {
      return <NoData iconName="no-data-folder" title="No commits yet" description={['There are no commits yet.']} />
    }

    return (
      <PullRequestCommits
        data={commitsList.map((item: TypesCommit) => ({
          sha: item.sha,
          parent_shas: item.parent_shas,
          title: item.title,
          message: item.message,
          author: item.author,
          committer: item.committer
        }))}
      />
    )
  }

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
              // @ts-ignore
              branchList={branches.map(item => ({
                name: item.name || ''
              }))}
              selectBranch={(branch: string) => selectBranch(branch)}
            />
          )}

          <Filter showSearch={false} sortOptions={sortOptions} />
        </div>
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
        <PaginationComponent
          nextPage={xNextPage}
          previousPage={xPrevPage}
          currentPage={page}
          goToPage={(pageNum: number) => setPage(pageNum)}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

// export default function RepoCommitsView() {
//   return <></>
// }
