import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import { Button, Spacer, Text } from '@harnessio/canary'
import { useDeleteRepoWebhookMutation, useListRepoWebhooksQuery } from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import {
  DeleteTokenAlertDialog,
  Filter,
  NoData,
  NoSearchResults,
  PaginationComponent,
  SandboxLayout,
  WebhooksList
} from '@harnessio/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { PageResponseHeader } from '../../types'

export default function RepoWebhooksListPage() {
  const queryClient = useQueryClient()
  const repoRef = useGetRepoRef()
  const [query, setQuery] = useDebouncedQueryState('query')
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const [isDeleteWebhookDialogOpen, setIsDeleteWebhookDialogOpen] = useState(false)
  const [deleteWebhookId, setDeleteWebhookId] = useState<string | null>(null)
  const closeDeleteWebhookDialog = () => setIsDeleteWebhookDialogOpen(false)
  const openDeleteWebhookDialog = (id: number) => {
    setIsDeleteWebhookDialogOpen(true)
    setDeleteWebhookId(id.toString())
  }

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const { data: { body: webhooks, headers } = {}, isFetching } = useListRepoWebhooksQuery({
    repo_ref: repoRef,
    queryParams: { order: 'asc', page, query }
  })

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const { mutate: deleteWebhook } = useDeleteRepoWebhookMutation(
    { repo_ref: repoRef, webhook_identifier: 0 },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listWebhooks', repoRef] })
        closeDeleteWebhookDialog()
      }
    }
  )

  const handleDeleteWebhook = (id: string) => {
    const webhook_identifier = parseInt(id)

    deleteWebhook({ repo_ref: repoRef, webhook_identifier: webhook_identifier })
  }

  const renderListContent = () => {
    if (isFetching) return <SkeletonList />

    if (!webhooks?.length) {
      if (query) {
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search', onClick: () => setQuery('') }}
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
    return (
      <WebhooksList
        webhooks={webhooks}
        LinkComponent={LinkComponent}
        openDeleteWebhookDialog={openDeleteWebhookDialog}
      />
    )
  }

  return (
    <>
      <SandboxLayout.Main>
        <SandboxLayout.Content>
          <Spacer size={10} />
          <Text size={5} weight={'medium'}>
            Webhooks
          </Text>
          <Spacer size={6} />
          <div className="flex items-center justify-between gap-5">
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
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            goToPage={(pageNum: number) => setPage(pageNum)}
          />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
      <DeleteTokenAlertDialog
        type="webhook"
        open={isDeleteWebhookDialogOpen}
        onClose={closeDeleteWebhookDialog}
        deleteFn={handleDeleteWebhook}
        identifier={deleteWebhookId!}
      />
    </>
  )
}
