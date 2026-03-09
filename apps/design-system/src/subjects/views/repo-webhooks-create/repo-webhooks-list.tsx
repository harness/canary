import { RepoWebhooksCreatePage } from '@harnessio/views'

import { repoWebhooksListStore } from '../repo-webhooks-list/repo-webhooks-list-store'

export const RepoWebhooksCreate = () => {
  return (
    <RepoWebhooksCreatePage
      onFormSubmit={() => {}}
      onFormCancel={() => {}}
      apiError={null}
      isLoading={false}
      useWebhookStore={repoWebhooksListStore.useWebhookStore}
    />
  )
}
