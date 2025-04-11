import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import {
  DeleteRepoWebhookErrorResponse,
  ListRepoWebhooksOkResponse,
  useDeleteRepoWebhookMutation,
  useListRepoWebhooksQuery,
  useUpdateRepoWebhookMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog, DeleteAlertDialogProps } from '@harnessio/ui/components'
import { ErrorTypes, RepoWebhookListPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { getErrorMessage } from '../../utils/error-utils'
import { useWebhookStore } from './stores/webhook-store'

export default function WebhookListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { spaceId, repoId } = useParams<PathParams>()
  const { webhooks, setWebhooks, page, setPage, setError, setTotalPages } = useWebhookStore()
  const [query, setQuery] = useQueryState('query')

  const queryClient = useQueryClient()

  const [apiError, setApiError] = useState<DeleteAlertDialogProps['error']>(null)
  const [deleteWebhookId, setDeleteWebhookId] = useState<number | null>(null)

  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const routes = useRoutes()

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
      queryParams: { page: queryPage, query: query ?? '' },
      repo_ref: repoRef
    },
    { retry: false }
  )

  /**
   * Deleting webhook
   */
  const { mutate: deleteWebhook, isLoading: deleteIsLoading } = useDeleteRepoWebhookMutation(
    { repo_ref: repoRef, webhook_identifier: 0 },
    {
      onSuccess: () => {
        setApiError(null)
        queryClient.invalidateQueries({ queryKey: ['listRepoWebhooks', repoRef] })
        closeDeleteWebhookDialog()
        refetch()
      },
      onError: (error: DeleteRepoWebhookErrorResponse) => {
        const message = error.message || 'Error deleting webhook'
        setApiError({ type: ErrorTypes.DELETE_REPO, message })
      }
    }
  )

  const { mutate: updateWebHook } = useUpdateRepoWebhookMutation({ repo_ref: repoRef })

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
      setWebhooks(webhookData)
      setTotalPages(headers)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webhookData, headers, setWebhooks])

  useEffect(() => {
    if (isError && error !== undefined) {
      setError(getErrorMessage(error))
    }
  }, [isError, setError, error])

  const handleEnableWebhook = (id: number, enabled: boolean) => {
    updateWebHook({ webhook_identifier: id, body: { enabled } })

    const updatedWebhooks = webhooks?.map(webhook => (webhook.id === id ? { ...webhook, enabled } : webhook))

    setWebhooks(updatedWebhooks as ListRepoWebhooksOkResponse)
  }

  return (
    <>
      <RepoWebhookListPage
        useWebhookStore={useWebhookStore}
        useTranslationStore={useTranslationStore}
        openDeleteWebhookDialog={openDeleteWebhookDialog}
        searchQuery={query}
        setSearchQuery={setQuery}
        webhookLoading={isFetching}
        handleEnableWebhook={handleEnableWebhook}
        toRepoWebhookDetails={({ webhookId }: { webhookId: number }) =>
          routes.toRepoWebhookDetails({ spaceId, repoId, webhookId: webhookId.toString() })
        }
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
