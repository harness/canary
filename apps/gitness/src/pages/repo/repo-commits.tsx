import {
  Spacer,
  Text,
  ListPagination,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext
} from '@harnessio/canary'
import {
  BranchSelector,
  Filter,
  NoData,
  PaddingListLayout,
  PullRequestCommits,
  SkeletonList
} from '@harnessio/playground'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { usePagination } from '../../framework/hooks/usePagination'

import {
  TypesCommit,
  useFindRepositoryQuery,
  useListBranchesQuery,
  useListCommitsQuery
} from '@harnessio/code-service-client'
import { useEffect, useState } from 'react'
import { normalizeGitRef } from '../../utils/git-utils'

const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

export default function RepoCommitsPage() {
  // lack of data: total commits
  // hardcoded
  const totalPages = 10
  const repoRef = useGetRepoRef()

  const { data: repository } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: branches, isFetching: isFetchingBranches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { page: 0, limit: 10 }
  })
  const { currentPage, previousPage, nextPage, handleClick } = usePagination(1, totalPages)

  const [selectedBranch, setSelectedBranch] = useState<string>('')

  const { data: commitData, isFetching: isFetchingCommits } = useListCommitsQuery({
    repo_ref: repoRef,

    queryParams: { page: currentPage, limit: 10, git_ref: normalizeGitRef(selectedBranch), include_stats: true }
  })

  // 🚨 API not supporting sort, so waiting for API changes
  // const { sort } = useCommonFilter()

  // logic once we have dynamic pagination set up

  // const totalPages = useMemo(() => {
  //   if (!commitData || !commitData.total_commits) return 0
  //   return Math.ceil(commitData.total_commits / 10)
  // }, [commitData])

  useEffect(() => {
    if (repository) {
      setSelectedBranch(repository?.default_branch || '')
    }
  }, [repository])

  const selectBranch = (branch: string) => {
    setSelectedBranch(branch)
  }
  const renderListContent = () => {
    if (isFetchingCommits) return <SkeletonList />

    // @ts-expect-error remove "@ts-expect-error" once CodeServiceClient Response for useListCommitsQuery is fixed
    const commitsLists = commitData?.commits
    if (!commitsLists?.length) {
      return <NoData iconName="no-data-folder" title="No commits yet" description={['There are no commits yet.']} />
    }

    return (
      <PullRequestCommits
        data={commitsLists.map((item: TypesCommit) => ({
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
    <PaddingListLayout spaceTop={false}>
      <Spacer size={2} />
      <Text size={5} weight={'medium'}>
        Commits
      </Text>
      <Spacer size={6} />
      <div className="flex justify-between gap-5">
        {!isFetchingBranches && branches && (
          <BranchSelector
            name={selectedBranch}
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

      <ListPagination.Root>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size="sm"
                href="#"
                onClick={() => currentPage > 1 && previousPage()}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  size="sm_icon"
                  href="#"
                  onClick={() => handleClick(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                size="sm"
                href="#"
                onClick={() => currentPage < totalPages && nextPage()}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ListPagination.Root>
    </PaddingListLayout>
  )
}
