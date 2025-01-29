import { TFunction } from 'i18next'

import { WebhookTriggerEnum } from '../types'

export const getBranchEvents = (t: TFunction) => [
  { id: WebhookTriggerEnum.BRANCH_CREATED, event: t('views:webhookData.branchCreated', 'Branch created') },
  { id: WebhookTriggerEnum.BRANCH_UPDATED, event: t('views:webhookData.branchUpdated', 'Branch updated') },
  { id: WebhookTriggerEnum.BRANCH_DELETED, event: t('views:webhookData.branchDeleted', 'Branch deleted') }
]

export const getTagEvents = (t: TFunction) => [
  { id: WebhookTriggerEnum.TAG_CREATED, event: t('views:webhookData.tagCreated', 'Tag created') },
  { id: WebhookTriggerEnum.TAG_UPDATED, event: t('views:webhookData.tagUpdated', 'Tag updated') },
  { id: WebhookTriggerEnum.TAG_DELETED, event: t('views:webhookData.tagDeleted', 'Tag deleted') }
]

export const getPrEvents = (t: TFunction) => [
  { id: WebhookTriggerEnum.PR_CREATED, event: t('views:webhookData.prCreated', 'PR created') },
  { id: WebhookTriggerEnum.PR_UPDATED, event: t('views:webhookData.prUpdated', 'PR updated') },
  { id: WebhookTriggerEnum.PR_REOPENED, event: t('views:webhookData.prReopened', 'PR reopened') },
  { id: WebhookTriggerEnum.PR_BRANCH_UPDATED, event: t('views:webhookData.prBranchUpdated', 'PR branch updated') },
  { id: WebhookTriggerEnum.PR_CLOSED, event: t('views:webhookData.prClosed', 'PR closed') },
  { id: WebhookTriggerEnum.PR_COMMENT_CREATED, event: t('views:webhookData.prCommentCreated', 'PR comment created') },
  { id: WebhookTriggerEnum.PR_MERGED, event: t('views:webhookData.prMerged', 'PR merged') }
]
