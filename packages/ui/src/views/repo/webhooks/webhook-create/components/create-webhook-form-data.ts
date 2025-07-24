import { TFunctionWithFallback } from '@/context'

import { WebhookTriggerEnum } from '../types'

export const getBranchAndTagEvents = (t: TFunctionWithFallback) => [
  { id: WebhookTriggerEnum.BRANCH_CREATED, event: t('views:webhookData.branchCreated', 'Branch created') },
  { id: WebhookTriggerEnum.BRANCH_UPDATED, event: t('views:webhookData.branchUpdated', 'Branch updated') },
  { id: WebhookTriggerEnum.BRANCH_DELETED, event: t('views:webhookData.branchDeleted', 'Branch deleted') },
  { id: WebhookTriggerEnum.TAG_CREATED, event: t('views:webhookData.tagCreated', 'Tag created') },
  { id: WebhookTriggerEnum.TAG_UPDATED, event: t('views:webhookData.tagUpdated', 'Tag updated') },
  { id: WebhookTriggerEnum.TAG_DELETED, event: t('views:webhookData.tagDeleted', 'Tag deleted') }
]

export const getPrEvents = (t: TFunctionWithFallback) => [
  { id: WebhookTriggerEnum.PR_CREATED, event: t('views:webhookData.prCreated', 'PR created') },
  { id: WebhookTriggerEnum.PR_UPDATED, event: t('views:webhookData.prUpdated', 'PR updated') },
  { id: WebhookTriggerEnum.PR_REOPENED, event: t('views:webhookData.prReopened', 'PR reopened') },
  { id: WebhookTriggerEnum.PR_CLOSED, event: t('views:webhookData.prClosed', 'PR closed') },
  { id: WebhookTriggerEnum.PR_COMMENT_CREATED, event: t('views:webhookData.prCommentCreated', 'PR comment created') },
  { id: WebhookTriggerEnum.PR_MERGED, event: t('views:webhookData.prMerged', 'PR merged') }
]

export const getPrActivityEvents = (t: TFunctionWithFallback) => [
  { id: WebhookTriggerEnum.PR_BRANCH_UPDATED, event: t('views:webhookData.prBranchUpdated', 'PR branch updated') },
  { id: WebhookTriggerEnum.PR_COMMENT_CREATED, event: t('views:webhookData.prCommentCreated', 'PR comment created') },
  {
    id: WebhookTriggerEnum.PR_COMMENT_STATUS_UPDATED,
    event: t('views:webhookData.prCommentStatusUpdated', 'PR comment status updated')
  },
  { id: WebhookTriggerEnum.PR_COMMENT_UPDATED, event: t('views:webhookData.prCommentUpdated', 'PR comment updated') },
  {
    id: WebhookTriggerEnum.PR_REVIEW_SUBMITTED,
    event: t('views:webhookData.prReviewSubmitted', 'PR review submitted')
  },
  { id: WebhookTriggerEnum.PR_LABEL_ASSIGNED, event: t('views:webhookData.prLabelAssigned', 'PR label assigned') }
]
