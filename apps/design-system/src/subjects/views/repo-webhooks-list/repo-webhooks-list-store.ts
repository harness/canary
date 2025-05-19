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
        display_name: 'Test',
        description: 'test desc',
        updated: 1734697494706,
        createdAt: '32 minutes ago',
        latest_execution_result: 'success',
        triggers: ['branch_created']
      },
      {
        id: 7,
        enabled: false,
        display_name: 'Test 2',
        description: 'test desc',
        updated: 1734697494702,
        createdAt: '30 minutes ago',
        latest_execution_result: 'fatal_error',
        triggers: []
      }
    ],
    error: undefined,
    webhookExecutionPage: 1,
    setWebhookExecutionPage: (_: number) => {},
    totalWebhookExecutionPages: 1,
    executions: [],
    setExecutions: () => {},
    setTotalWebhookExecutionPages: (_: Headers) => {},
    setError: noop,
    totalPages: 20,
    webhookLoading: false,
    setWebhookLoading: (_: boolean) => {},
    page: 1,
    setPage: (_: number) => {},
    setTotalPages: (_: Headers | undefined) => {},
    setWebhooks: (_data: ListRepoWebhooksOkResponse) => {},
    preSetWebhookData: null,
    setPreSetWebhookData: (_: CreateWebhookFormFields | null) => {},
    executionId: null,
    setExecutionId: (_: number | null) => {},
    updateExecution: () => {},
    pageSize: 10,
    setPaginationFromHeaders: (_?: Headers) => {},
    totalItems: 10
  })
}
