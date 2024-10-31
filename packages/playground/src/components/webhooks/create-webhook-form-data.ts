import { WebhookEvent } from './types'

export const branchEvents: WebhookEvent[] = [
  { id: 1, event: 'Branch created' },
  { id: 2, event: 'Branch updated' },
  { id: 3, event: 'Branch deleted' }
]

export const tagEvents: WebhookEvent[] = [
  { id: 4, event: 'Tag created' },
  { id: 5, event: 'Tag updated' },
  { id: 6, event: 'Tag deleted' }
]

export const prEvents: WebhookEvent[] = [
  { id: 7, event: 'PR created' },
  { id: 8, event: 'PR updated' },
  { id: 9, event: 'PR opened' },
  { id: 10, event: 'PR branch updated' },
  { id: 11, event: 'PR closed' },
  { id: 12, event: 'PR comment created' },
  { id: 13, event: 'PR merged' }
]
