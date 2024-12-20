import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import { useDeleteRepoWebhookMutation, useListRepoWebhooksQuery } from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { RepoWebhookListPage } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { getErrorMessage } from '../../utils/error-utils'
import { useWebhookStore } from './stores/webhook-store'

export default function WebhookListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setWebhooks, page, setPage, setWebhookLoading, setError } = useWebhookStore()
  const queryClient = useQueryClient()

  const [query] = useDebouncedQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [deleteWebhookId, setDeleteWebhookId] = useState<string | null>(null)

  const [isDeleteWebhookDialogOpen, setIsDeleteWebhookDialogOpen] = useState(false)
  const closeDeleteWebhookDialog = () => setIsDeleteWebhookDialogOpen(false)
  const openDeleteWebhookDialog = (id: number) => {
    setIsDeleteWebhookDialogOpen(true)
    setDeleteWebhookId(id.toString())
  }

  const {
    data: { body: webhookData, headers } = {},
    isFetching,
    isError,
    error
  } = useListRepoWebhooksQuery(
    {
      queryParams: { page, query },
      repo_ref: repoRef
    },
    { retry: false }
  )

  const { mutate: deleteWebhook } = useDeleteRepoWebhookMutation(
    { repo_ref: repoRef, webhook_identifier: 0 },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listRepoWebhooks', repoRef] })
        closeDeleteWebhookDialog()
      }
    }
  )

  const handleDeleteWebhook = (id: string) => {
    const webhook_identifier = parseInt(id)

    deleteWebhook({ repo_ref: repoRef, webhook_identifier: webhook_identifier })
  }

  useEffect(() => {
    if (webhookData) {
      setWebhooks(webhookData, headers)
      setWebhookLoading(false)
    }
  }, [webhookData, headers, setWebhooks])
  useEffect(() => {
    if (isFetching) {
      setWebhookLoading(isFetching)
    }
  }, [isFetching, setWebhookLoading])

  useEffect(() => {
    if (isError && error !== undefined) {
      setError(getErrorMessage(error))
    }
  }, [isError, setError, error])

  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])
  return (
    <>
      <RepoWebhookListPage
        useWebhookStore={useWebhookStore}
        useTranslationStore={useTranslationStore}
        openDeleteWebhookDialog={openDeleteWebhookDialog}
      />
      <DeleteAlertDialog
        type="webhook"
        open={isDeleteWebhookDialogOpen}
        onClose={closeDeleteWebhookDialog}
        deleteFn={handleDeleteWebhook}
        identifier={deleteWebhookId!}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
