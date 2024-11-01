import React from 'react'
import { Link } from 'react-router-dom'
import {
  Spacer,
  Button,
  Text,
  ListPagination,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext
} from '@harnessio/canary'
// import { NoSearchResults } from '../components/no-search-results'
import { Filter, NoData, SandboxLayout, SkeletonList, useCommonFilter, WebhooksList } from '@harnessio/playground'
import { useListWebhooksQuery } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { usePagination } from '../../framework/hooks/usePagination'
function RepoSandboxWebhooksListPage() {
  // lack of data: total commits
  // hardcoded
  const totalPages = 10
  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>
  const repoRef = useGetRepoRef()
  const { query } = useCommonFilter()

  const { data: { body: webhooks } = {}, isFetching } = useListWebhooksQuery({
    repo_ref: repoRef,
    queryParams: { order: 'asc', limit: 20, page: 1, query }
  })
  const { currentPage, previousPage, nextPage, handleClick } = usePagination(1, totalPages)

  const renderListContent = () => {
    if (isFetching) {
      return <SkeletonList />
    }
    if (webhooks?.length) {
      return <WebhooksList webhooks={webhooks} LinkComponent={LinkComponent} />
    } else {
      return (
        <NoData
          insideTabView
          iconName="no-data-webhooks"
          title="No webhooks yet"
          description={['There are no webhooks in this repository yet.', 'Create new or import an existing webhook.']}
          primaryButton={{ label: 'Create webhook', to: 'create' }}
          secondaryButton={{ label: 'Import webhook' }}
        />
      )
    }
  }

  return (
    <>
      <SandboxLayout.Main hasHeader hasLeftPanel>
        <SandboxLayout.Content>
          <Spacer size={10} />
          <Text size={5} weight={'medium'}>
            Webhooks
          </Text>
          <Spacer size={6} />

          <div className="flex justify-between gap-5 items-center">
            <div className="flex-1">
              <Filter />
            </div>
            <Button variant="default" asChild>
              <Link to="create">Create webhook</Link>
            </Button>
          </div>

          <Spacer size={5} />
          {renderListContent()}
          <Spacer size={8} />

          {(webhooks?.length ?? 0) > 0 && (
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

export default RepoSandboxWebhooksListPage
