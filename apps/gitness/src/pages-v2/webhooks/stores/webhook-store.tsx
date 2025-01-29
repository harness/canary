import { create } from 'zustand'

import { CreateWebhookFormFields, WebhookStore } from '@harnessio/ui/views'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../../types'

export const useWebhookStore = create<WebhookStore>(set => ({
  webhooks: null,
  totalPages: 0,
  error: undefined,
  preSetWebhookData: null,
  setError: error => set({ error }),
  page: 1,
  setPage: page => set({ page }),
  webhookLoading: false,
  setWebhookLoading: (webhookLoading: boolean) => set({ webhookLoading }),
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
  setTotalPages: headers => set({ totalPages: parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0') }),
  setPreSetWebhookData: (data: CreateWebhookFormFields | null) => set({ preSetWebhookData: data })
}))
