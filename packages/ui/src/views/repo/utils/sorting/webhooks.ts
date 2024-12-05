import { SortValue } from '@components/filters/types'

import { WebhookType } from '../../webhooks/webhook-list/types'

/**
 * Sorts webhooks based on active sorts
 */
export const sortWebhooks = (webhooks: WebhookType[] | null, activeSorts: SortValue[]): WebhookType[] => {
  if (!webhooks) return []

  return [...webhooks].sort((a, b) => {
    for (const sort of activeSorts) {
      const direction = sort.direction === 'asc' ? 1 : -1
      const comparison = compareWebhooks(a, b, sort.type) * direction

      if (comparison !== 0) {
        return comparison
      }
    }
    return 0
  })
}

const compareWebhooks = (a: WebhookType, b: WebhookType, sortType: string): number => {
  switch (sortType) {
    case 'updated':
      return new Date(b.updated).getTime() - new Date(a.updated).getTime()
    case 'title':
      return a.name.localeCompare(b.name)
    default:
      return 0
  }
}
