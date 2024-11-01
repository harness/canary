import React from 'react'
import {
  Spacer,
  ListPagination,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  Text,
  Button
} from '@harnessio/canary'
import { Link, useParams } from 'react-router-dom'
import { SkeletonList, PullRequestList, NoData, useCommonFilter, Filter, SandboxLayout } from '@harnessio/playground'
import { ListPullReqQueryQueryParams, TypesPullReq, useListPullReqQuery } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { usePagination } from '../framework/hooks/usePagination'
import { timeAgoFromEpochTime } from './pipeline-edit/utils/time-utils'
import { DropdownItemProps } from '../../../../packages/canary/dist/components/list-actions'
import { PathParams } from '../RouteDefinitions'

const SortOptions = [
  { name: 'Created', value: 'created' },
  { name: 'Edited', value: 'edited' },
  { name: 'Merged', value: 'merged' },
  { name: 'Number', value: 'number' },
  { name: 'Updated', value: 'updated' }
] as const satisfies DropdownItemProps[]

function PullRequestSandboxListPage() {
  const { repoId, spaceId } = useParams<PathParams>()
  // hardcoded
  const totalPages = 10
  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>
  const repoRef = useGetRepoRef()
  const { currentPage, previousPage, nextPage, handleClick } = usePagination(1, totalPages)

  const { sort, query } = useCommonFilter<ListPullReqQueryQueryParams['sort']>()

  const { data: { body: pullrequests } = {}, isFetching } = useListPullReqQuery({
    repo_ref: repoRef,
    queryParams: { page: 0, limit: 20, query: query?.trim(), sort }
  })

  const renderListContent = () => {
    if (isFetching) {
      return <SkeletonList />
    }
    if (pullrequests?.length === 0) {
      return (
        <NoData
          insideTabView
          iconName="no-data-merge"
          title="No Pull Requests yet"
          description={['There are no pull requests in this repository yet.']}
          primaryButton={{
            label: 'Create pull requests',
            to: `/spaces/${spaceId}/repos/${repoId}/pull-requests/compare`
          }}
          secondaryButton={{
            label: 'Import pull requests'
          }}
        />
      )
    }
    return (
      <PullRequestList
        LinkComponent={LinkComponent}
        pullRequests={pullrequests?.map((item: TypesPullReq) => ({
          author: item?.author?.display_name,
          name: item?.title,
          // TODO: fix review required when its actually there
          reviewRequired: true,
          merged: item.merged,
          comments: item.stats?.conversations,
          number: item?.number,
          // TODO: add label information to display associated labels for each pull request
          // labels: item?.labels?.map((key: string, color: string) => ({ text: key, color: color })),
          // TODO: fix 2 hours ago in timestamp
          timestamp: item?.created ? timeAgoFromEpochTime(item?.created) : '',
          source_branch: item?.source_branch,
          state: item?.state
        }))}
      />
    )
  }

  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={10} />
          <Text size={5} weight={'medium'}>
            Pull Requests
          </Text>
          <Spacer size={6} />

          <div className="flex justify-between gap-5 items-center">
            <div className="flex-1">
              <Filter sortOptions={SortOptions} />
            </div>
            <Button variant="default" asChild>
              <Link to={`/spaces/${spaceId}/repos/${repoId}/pull-requests/compare`}>New pull request</Link>
            </Button>
          </div>

          <Spacer size={5} />
          {renderListContent()}
          <Spacer size={8} />
          {(pullrequests?.length ?? 0) > 0 && (
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
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}

export default PullRequestSandboxListPage
