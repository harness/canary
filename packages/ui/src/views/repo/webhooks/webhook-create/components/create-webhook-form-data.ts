import { WebhookEvent, WebhookTriggerEnum } from '../types'

export const branchEvents: WebhookEvent[] = [
  { id: WebhookTriggerEnum.BRANCH_CREATED, event: 'Branch created' },
  { id: WebhookTriggerEnum.BRANCH_UPDATED, event: 'Branch updated' },
  { id: WebhookTriggerEnum.BRANCH_DELETED, event: 'Branch deleted' }
]

export const tagEvents: WebhookEvent[] = [
  { id: WebhookTriggerEnum.TAG_CREATED, event: 'Tag created' },
  { id: WebhookTriggerEnum.TAG_UPDATED, event: 'Tag updated' },
  { id: WebhookTriggerEnum.TAG_DELETED, event: 'Tag deleted' }
]

export const prEvents: WebhookEvent[] = [
  { id: WebhookTriggerEnum.PR_CREATED, event: 'PR created' },
  { id: WebhookTriggerEnum.PR_UPDATED, event: 'PR updated' },
  { id: WebhookTriggerEnum.PR_REOPENED, event: 'PR reopened' },
  { id: WebhookTriggerEnum.PR_BRANCH_UPDATED, event: 'PR branch updated' },
  { id: WebhookTriggerEnum.PR_CLOSED, event: 'PR closed' },
  { id: WebhookTriggerEnum.PR_COMMENT_CREATED, event: 'PR comment created' },
  { id: WebhookTriggerEnum.PR_MERGED, event: 'PR merged' }
]
