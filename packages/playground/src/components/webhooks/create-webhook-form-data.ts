import { WebhookEvent, BranchEvents, TagEvents, PREvents } from './types'

export const branchEvents: WebhookEvent[] = [
  { id: BranchEvents.BRANCH_CREATED, event: 'Branch created' },
  { id: BranchEvents.BRANCH_UPDATED, event: 'Branch updated' },
  { id: BranchEvents.BRANCH_DELETED, event: 'Branch deleted' }
]

export const tagEvents: WebhookEvent[] = [
  { id: TagEvents.TAG_CREATED, event: 'Tag created' },
  { id: TagEvents.TAG_UPDATED, event: 'Tag updated' },
  { id: TagEvents.TAG_DELETED, event: 'Tag deleted' }
]

export const prEvents: WebhookEvent[] = [
  { id: PREvents.PR_CREATED, event: 'PR created' },
  { id: PREvents.PR_UPDATED, event: 'PR updated' },
  { id: PREvents.PR_REOPENED, event: 'PR reopened' },
  { id: PREvents.PR_BRANCH_UPDATED, event: 'PR branch updated' },
  { id: PREvents.PR_CLOSED, event: 'PR closed' },
  { id: PREvents.PR_COMMENT_CREATED, event: 'PR comment created' },
  { id: PREvents.PR_MERGED, event: 'PR merged' }
]
