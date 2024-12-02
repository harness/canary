import { useEffect, useState } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import { Spacer, Text } from '@harnessio/canary'
import {
  TypesCommit,
  useFindRepositoryQuery,
  useListBranchesQuery,
  useListCommitsQuery
} from '@harnessio/code-service-client'
import { NoData, PaginationComponent, SkeletonList } from '@harnessio/ui/components'
import {
  Filter,
  PullRequestCommits,
  RepoCommitsBranchSelector,
  RepoCommitsView,
  SandboxLayout
} from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PageResponseHeader } from '../../types'
import { normalizeGitRef } from '../../utils/git-utils'

const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

export default function RepoCommitsPage() {
  const repoRef = useGetRepoRef()
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  const { data: { body: branches } = {}, isFetching: isFetchingBranches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { page }
  })

  const [selectedBranch, setSelectedBranch] = useState<string>('')

  const { data: { body: commitData, headers } = {}, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: { page, git_ref: normalizeGitRef(selectedBranch), include_stats: true }
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  // 🚨 API not supporting sort, so waiting for API changes
  // const { sort } = useCommonFilter()

  useEffect(() => {
    if (repository) {
      setSelectedBranch(repository?.default_branch || '')
    }
  }, [repository])

  const selectBranch = (branch: string) => {
    setSelectedBranch(branch)
  }

  //   const renderListContent = () => {
  //     if (isFetchingCommits) return <SkeletonList />
  //     const commitsList = commitData?.commits
  //     if (!commitsList?.length) {
  //       return <NoData iconName="no-data-folder" title="No commits yet" description={['There are no commits yet.']} />
  //     }

  //     return (
  //       <PullRequestCommits
  //         data={commitsList.map((item: TypesCommit) => ({
  //           sha: item.sha,
  //           parent_shas: item.parent_shas,
  //           title: item.title,
  //           message: item.message,
  //           author: item.author,
  //           committer: item.committer
  //         }))}
  //       />
  //     )
  //   }

  //   return (
  //     <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
  //       <SandboxLayout.Content>
  //         <Spacer size={10} />
  //         <Text size={5} weight={'medium'}>
  //           Commits
  //         </Text>
  //         <Spacer size={6} />
  //         <div className="flex justify-between gap-5">
  //           {!isFetchingBranches && branches && (
  //             <RepoCommitsBranchSelector
  //               name={selectedBranch}
  //               branchList={branches.map(item => ({
  //                 name: item.name || ''
  //               }))}
  //               selectBranch={(branch: string) => selectBranch(branch)}
  //             />
  //           )}

  //           <Filter showSearch={false} sortOptions={sortOptions} />
  //         </div>
  //         <Spacer size={5} />
  //         {renderListContent()}
  //         <Spacer size={8} />
  //         <PaginationComponent
  //           nextPage={xNextPage}
  //           previousPage={xPrevPage}
  //           currentPage={page}
  //           goToPage={(pageNum: number) => setPage(pageNum)}
  //         />
  //       </SandboxLayout.Content>
  //     </SandboxLayout.Main>
  //   )

  return (
    <RepoCommitsView
      branches={branches}
      commitsList={commitData?.commits}
      isFetchingBranches={isFetchingBranches}
      isFetchingCommits={isFetchingCommits}
      page={page}
      selectBranch={selectBranch}
      selectedBranch={selectedBranch}
      setPage={setPage}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
    />
  )
}
