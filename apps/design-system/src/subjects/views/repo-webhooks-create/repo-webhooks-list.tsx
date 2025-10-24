import { useTranslationStore } from '@utils/viewUtils.ts'

import { RepoWebhooksCreatePage } from '@harnessio/ui/views'

import { repoWebhooksListStore } from '../repo-webhooks-list/repo-webhooks-list-store'

export const RepoWebhooksCreate = () => {
  return (
    <RepoWebhooksCreatePage
      onFormSubmit={() => {}}
      onFormCancel={() => {}}
      apiError={null}
      isLoading={false}
      useWebhookStore={repoWebhooksListStore.useWebhookStore}
      useTranslationStore={useTranslationStore}
    />
  )
}
