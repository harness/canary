import { useCallback, useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils.ts'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { RepoWebhookListPage } from '@harnessio/ui/views'

import { repoWebhooksListStore } from './repo-webhooks-list-store'

export const RepoWebhooksList = () => {
  const [deleteWebhookId, setDeleteWebhookId] = useState<number | null>(null)

  /**
   * Set id of webhook to delete it
   */
  const openDeleteWebhookDialog = useCallback((id: number) => {
    setDeleteWebhookId(id)
  }, [])

  const closeDeleteWebhookDialog = () => {
    setDeleteWebhookId(null)
  }

  return (
    <>
      <RepoWebhookListPage
        useWebhookStore={repoWebhooksListStore.useWebhookStore}
        useTranslationStore={useTranslationStore}
        openDeleteWebhookDialog={openDeleteWebhookDialog}
        setSearchQuery={noop}
        searchQuery={null}
        webhookLoading={false}
        handleEnableWebhook={noop}
      />
      <DeleteAlertDialog
        open={deleteWebhookId !== null}
        onClose={closeDeleteWebhookDialog}
        deleteFn={() => closeDeleteWebhookDialog()}
        type="webhook"
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
