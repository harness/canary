import { SkeletonList, NoData, PaddingListLayout, BranchesList } from '@harnessio/playground'
import {
  Button,
  ListActions,
  ListPagination,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  SearchBox,
  Spacer,
  Text
} from '@harnessio/canary'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { usePagination } from '../../framework/hooks/usePagination'

import { useListBranchesQuery, TypesBranch } from '@harnessio/code-service-client'
import { timeAgo } from '../pipeline-edit/utils/time-utils'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

export function ReposBranchesListPage() {
  // lack of data: total branches
  // hardcoded
  const totalPages = 10

  const repoRef = useGetRepoRef()

  const { currentPage, previousPage, nextPage, handleClick } = usePagination(1, totalPages)

  const { isLoading, data: brancheslistData } = useListBranchesQuery({
    queryParams: { page: currentPage, limit: 20, sort: 'date', order: 'desc', include_commit: true },
    repo_ref: repoRef
  })

  //lack of data : avatarUrl: string, checking status , behindAhead{behind: num, ahead:num}, pullRequest{sha: string, branch number : 145}
  //TODO: fetching behindAhead data
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonList />
    }

    if (brancheslistData?.length === 0 || brancheslistData === undefined) {
      return (
        <div className="mt-40">
          <NoData
            iconName="no-data-branches"
            title="No branches yet"
            description={[
              "Your branches will appear here once they're created.",
              'Start branching to see your work organized.'
            ]}
            primaryButton={{ label: 'Create new branch' }}
          />
        </div>
      )
    }

    return (
      <BranchesList
        branches={brancheslistData?.map((branch: TypesBranch) => {
          return {
            name: branch.name,
            sha: branch.commit?.sha,
            timestamp: timeAgo(branch.commit?.committer?.when || ''),
            user: {
              name: branch.commit?.committer?.identity?.name,
              avatarUrl: ''
            },
            //hardcoded
            checks: {
              done: 1,
              total: 1,
              status: 1
            },
            //hardcoded
            behindAhead: {
              behind: 1,
              ahead: 1
            }
            //temporary hide this column
            // pullRequest: {
            //   sha: '123' //hardcoded
            // }
          }
        })}
      />
    )
  }
  return (
    <PaddingListLayout spaceTop={false}>
      <Spacer size={2} />
      {(brancheslistData?.length ?? 0) > 0 && (
        <>
          <Text size={5} weight={'medium'}>
            Branches
          </Text>
          <Spacer size={6} />
          <ListActions.Root>
            <ListActions.Left>
              <SearchBox.Root placeholder="Search branches" />
            </ListActions.Left>
            <ListActions.Right>
              <ListActions.Dropdown title="Filter" items={filterOptions} />
              <ListActions.Dropdown title="Sort" items={sortOptions} />
              <Button variant="default">Create Branch</Button>
            </ListActions.Right>
          </ListActions.Root>
        </>
      )}
      <Spacer size={5} />
      {renderContent()}
      <Spacer size={8} />
      {(brancheslistData?.length ?? 0) > 0 && (
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
              {/* <PaginationItem>
              <PaginationLink size="sm_icon" href="#">
                <PaginationEllipsis />
              </PaginationLink>
            </PaginationItem> */}
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
      )}
    </PaddingListLayout>
  )
}
