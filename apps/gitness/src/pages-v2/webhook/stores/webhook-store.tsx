import { create } from 'zustand'

import { ListRepoWebhooksOkResponse } from '@harnessio/code-service-client'
import { WebhookType } from '@harnessio/ui/views'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../../types'

interface WebhookStore {
  webhooks: WebhookType[] | null
  totalPages: number
  setWebhooks: (data: ListRepoWebhooksOkResponse, headers: Headers | undefined) => void
  page: number
  setPage: (page: number) => void
}

export const useWebhookStore = create<WebhookStore>(set => ({
  webhooks: null,
  totalPages: 0,

  page: 1,
  setPage: page => set({ page }),

  setWebhooks: (data, headers) => {
    const transformedWebhooks = data.map(webhook => ({
      id: webhook.id || 0,
      enabled: !!webhook.enabled,
      name: webhook.display_name || '',
      description: webhook.description || '',
      createdAt: webhook.updated ? timeAgoFromEpochTime(webhook.updated) : ''
    }))

    set({
      webhooks: transformedWebhooks,
      totalPages: parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')
    })
  }
}))
