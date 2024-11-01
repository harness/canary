import { WebhookEvent } from './types'

export const branchEvents: WebhookEvent[] = [
  { id: 'branch_created', event: 'Branch created' },
  { id: 'branch_updated', event: 'Branch updated' },
  { id: 'branch_deleted', event: 'Branch deleted' }
]

export const tagEvents: WebhookEvent[] = [
  { id: 'tag_created', event: 'Tag created' },
  { id: 'tag_updated', event: 'Tag updated' },
  { id: 'tag_deleted', event: 'Tag deleted' }
]

export const prEvents: WebhookEvent[] = [
  { id: 'pullreq_created', event: 'PR created' },
  { id: 'pullreq_updated', event: 'PR updated' },
  { id: 'pullreq_reopened', event: 'PR reopened' },
  { id: 'pullreq_branch_updated', event: 'PR branch updated' },
  { id: 'pullreq_closed', event: 'PR closed' },
  { id: 'pullreq_comment_created', event: 'PR comment created' },
  { id: 'pullreq_merged', event: 'PR merged' }
]
