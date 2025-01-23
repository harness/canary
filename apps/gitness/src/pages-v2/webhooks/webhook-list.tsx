import { useCallback, useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'

import {
  DeleteRepoWebhookErrorResponse,
  useDeleteRepoWebhookMutation,
  useListRepoWebhooksQuery
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { RepoWebhookListPage } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { getErrorMessage } from '../../utils/error-utils'
import { useWebhookStore } from './stores/webhook-store'

export default function WebhookListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setWebhooks, page, setPage, setError } = useWebhookStore()
  const [query, setQuery] = useQueryState('query')

  const queryClient = useQueryClient()

  const [apiError, setApiError] = useState<{ type: string; message: string } | null>(null)
  const [deleteWebhookId, setDeleteWebhookId] = useState<number | null>(null)

  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  /**
   * Fetching webhooks
   */
  const {
    data: { body: webhookData, headers } = {},
    isFetching,
    isError,
    error,
    refetch
  } = useListRepoWebhooksQuery(
    {
      queryParams: {
        page: queryPage,
        query: query ?? ''
      },
      repo_ref: repoRef
    },
    { retry: false }
  )

  /**
   * Deleting webhook
   */
  const { mutate: deleteWebhook, isLoading: deleteIsLoading } = useDeleteRepoWebhookMutation(
    {
      repo_ref: repoRef,
      webhook_identifier: 0
    },
    {
      onSuccess: () => {
        setApiError(null)
        queryClient.invalidateQueries({ queryKey: ['listRepoWebhooks', repoRef] })
        closeDeleteWebhookDialog()
        refetch()
      },
      onError: (error: DeleteRepoWebhookErrorResponse) => {
        const message = error.message || 'Error deleting webhook'
        setApiError({ type: '', message })
      }
    }
  )

  /**
   * Set id of webhook to delete it
   */
  const openDeleteWebhookDialog = useCallback((id: number) => {
    setDeleteWebhookId(id)
  }, [])

  const closeDeleteWebhookDialog = () => {
    setDeleteWebhookId(null)
  }

  const handleDeleteWebhook = () => {
    if (deleteWebhookId === null) return

    deleteWebhook({ repo_ref: repoRef, webhook_identifier: deleteWebhookId })
  }

  useEffect(() => {
    if (webhookData) {
      setWebhooks(webhookData, headers)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webhookData, headers, setWebhooks])

  useEffect(() => {
    if (isError && error !== undefined) {
      setError(getErrorMessage(error))
    }
  }, [isError, setError, error])

  return (
    <>
      <RepoWebhookListPage
        useWebhookStore={useWebhookStore}
        useTranslationStore={useTranslationStore}
        openDeleteWebhookDialog={openDeleteWebhookDialog}
        searchQuery={query}
        setSearchQuery={setQuery}
        webhookLoading={isFetching}
      />
      <DeleteAlertDialog
        open={deleteWebhookId !== null}
        onClose={closeDeleteWebhookDialog}
        deleteFn={handleDeleteWebhook}
        type="webhook"
        isLoading={deleteIsLoading}
        error={apiError}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
