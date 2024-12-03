import { create } from 'zustand'

import { WebhookStore } from '@harnessio/ui/views'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../../types'

export const useWebhookStore = create<WebhookStore>(set => ({
  webhooks: null,
  totalPages: 0,
  error: undefined,
  setError: error => set({ error }),
  page: 1,
  setPage: page => set({ page }),
  webhookLoading: false,
  setWebhookLoading: (webhookLoading: boolean) => set({ webhookLoading }),
  setWebhooks: (data, headers) => {
    const transformedWebhooks = data.map(webhook => ({
      id: webhook.id || 0,
      enabled: !!webhook.enabled,
      name: webhook.display_name || '',
      description: webhook.description || '',
      updated: webhook.updated || 0,
      createdAt: webhook.updated ? timeAgoFromEpochTime(webhook.updated) : ''
    }))

    set({
      webhooks: transformedWebhooks,
      totalPages: parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')
    })
  }
}))
