import { WebhookTriggerEnum } from './webhook-create/types'

/**
 * Formats webhook trigger strings for display
 * @param triggers Array of webhook trigger strings or enum values
 * @returns Formatted trigger string or 'All Events' if no triggers
 */
export const formatWebhookTriggers = (triggers?: WebhookTriggerEnum[] | string[] | null): string => {
  return triggers?.length
    ? triggers
        .map(trigger => String(trigger).replace(/_/g, ' ').replace(/\b\w/g, match => match.toUpperCase()))
        .join(', ')
    : 'All Events'
}
