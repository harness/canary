import React from 'react'
import { Link } from 'react-router-dom'
import { parseAsInteger, useQueryState } from 'nuqs'
import { Spacer, Button, Text } from '@harnessio/canary'
// import { NoSearchResults } from '../components/no-search-results'
import {
  Filter,
  NoData,
  PaddingListLayout,
  SkeletonList,
  useCommonFilter,
  WebhooksList,
  NoSearchResults
} from '@harnessio/playground'
import { useListWebhooksQuery } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PaginationComponent } from '../../../../../packages/playground/dist'
import { PageResponseHeader } from '../../types'
function RepoWebhooksListPage() {
  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>
  const repoRef = useGetRepoRef()

  const { query: currentQuery } = useCommonFilter()
  const [query, _] = useQueryState('query', { defaultValue: currentQuery || '' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: webhooks, headers } = {}, isFetching } = useListWebhooksQuery({
    repo_ref: repoRef,
    queryParams: { order: 'asc', page, query }
  })

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const renderListContent = () => {
    if (isFetching) return <SkeletonList />

    if (!webhooks?.length) {
      if (query) {
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search' }}
            secondaryButton={{ label: 'Clear filters' }}
          />
        )
      }
      return (
        <NoData
          insideTabView
          iconName="no-data-webhooks"
          title="No webhooks yet"
          description={['There are no webhooks in this repository yet.']}
          primaryButton={{ label: 'Create webhook', to: 'create' }}
        />
      )
    }

    return <WebhooksList webhooks={webhooks} LinkComponent={LinkComponent} />
  }

  const webhooksExist = (webhooks?.length ?? 0) > 0

  return (
    <>
      <PaddingListLayout spaceTop={false}>
        <Spacer size={2} />
        {/**
         * Show if webhooks exist.
         * Additionally, show if query(search) is applied.
         */}
        {(query || webhooksExist) && (
          <>
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
          </>
        )}
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
        {totalPages > 1 && (
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            goToPage={(pageNum: number) => setPage(pageNum)}
          />
        )}
      </PaddingListLayout>
    </>
  )
}

export default RepoWebhooksListPage
