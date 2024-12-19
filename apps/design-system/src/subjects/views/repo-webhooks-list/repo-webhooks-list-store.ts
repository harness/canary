import { noop } from '@utils/viewUtils'

import { CreateWebhookFormFields, ListRepoWebhooksOkResponse, WebhookStore } from '@harnessio/ui/views'

interface RepoWebhooksListStore {
  useWebhookStore: () => WebhookStore
}

export const repoWebhooksListStore: RepoWebhooksListStore = {
  useWebhookStore: () => ({
    webhooks: [
      {
        id: 6,
        enabled: true,
        name: 'Test',
        description: 'test desc',
        updated: 1734697494706,
        createdAt: '32 minutes ago'
      },
      {
        id: 7,
        enabled: false,
        name: 'Test 2',
        description: 'test desc',
        updated: 1734697494702,
        createdAt: '30 minutes ago'
      }
    ],
    error: undefined,
    setError: noop,
    totalPages: 20,
    webhookLoading: false,
    setWebhookLoading: (_: boolean) => {},
    page: 1,
    setPage: (_: number) => {},
    setWebhooks: (_data: ListRepoWebhooksOkResponse, _headers: Headers | undefined) => {},
    preSetWebhookData: null,
    setPreSetWebhookData: (_: CreateWebhookFormFields | null) => {}
  })
}
