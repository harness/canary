import { create } from 'zustand'

import { CreateWebhookFormFields, WebhookExecutionType, WebhookStore } from '@harnessio/ui/views'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../../types'

export const useWebhookStore = create<WebhookStore>(set => ({
  webhooks: null,
  totalItems: 0,
  pageSize: 10,
  error: undefined,
  preSetWebhookData: null,
  setError: error => set({ error }),
  page: 1,
  webhookExecutionPage: 1,
  setPage: page => set({ page }),
  webhookLoading: false,
  executions: null,
  executionId: null,
  setWebhookLoading: (webhookLoading: boolean) => set({ webhookLoading }),
  setWebhookExecutionPage: page => set({ webhookExecutionPage: page }),
  setWebhooks: data => {
    const transformedWebhooks = data.map(webhook => ({
      id: webhook.id || 0,
      enabled: !!webhook.enabled,
      display_name: webhook.display_name || '',
      description: webhook.description || '',
      updated: webhook.updated || 0,
      createdAt: webhook.updated ? timeAgoFromEpochTime(webhook.updated) : '',
      latest_execution_result: webhook.latest_execution_result || null,
      triggers: webhook.triggers || null
    }))

    set({
      webhooks: transformedWebhooks
    })
  },
  setExecutions: (data: WebhookExecutionType[]) => {
    set({ executions: data })
  },
  // if a webhook execution is already in the list, update it, otherwise add it
  updateExecution: (updatedExecution: WebhookExecutionType) => {
    set(state => ({
      executions: state.executions?.some(exec => exec.id === updatedExecution.id)
        ? state.executions.map(exec => (exec.id === updatedExecution.id ? updatedExecution : exec))
        : [...(state.executions ?? []), updatedExecution]
    }))
  },
  setPaginationFromHeaders: (headers: Headers | undefined) =>
    set({
      totalItems: parseInt(headers?.get(PageResponseHeader.xTotal) || '0'),
      pageSize: parseInt(headers?.get(PageResponseHeader.xPerPage) || '10')
    }),
  setPreSetWebhookData: (data: CreateWebhookFormFields | null) => set({ preSetWebhookData: data }),
  setExecutionId: (id: number | null) => set({ executionId: id })
}))
