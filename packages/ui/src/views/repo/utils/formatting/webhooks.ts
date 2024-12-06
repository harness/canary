import { formatDistanceToNow } from 'date-fns'

import { WebhookType } from '../../webhooks/webhook-list/types'

/**
 * Formats webhook data for display
 */
export const formatWebhooks = (webhooks: WebhookType[]): WebhookType[] => {
  return webhooks.map(webhook => ({
    ...webhook,
    timestamp: formatDistanceToNow(new Date(webhook.updated), {
      addSuffix: true,
      includeSeconds: true
    }).replace('about ', '')
  }))
}
