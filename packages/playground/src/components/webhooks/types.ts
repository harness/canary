import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'
import { createWebhookFormSchema } from './create-webhooks-form-schema'

export enum BranchEvents {
  BRANCH_CREATED = 'branch_created',
  BRANCH_UPDATED = 'branch_updated',
  BRANCH_DELETED = 'branch_deleted'
}

export enum TagEvents {
  TAG_CREATED = 'tag_created',
  TAG_UPDATED = 'tag_updated',
  TAG_DELETED = 'tag_deleted'
}

export enum PREvents {
  PR_CREATED = 'pullreq_created',
  PR_UPDATED = 'pullreq_updated',
  PR_OPENED = 'pullreq_reopened',
  PR_BRANCH_UPDATED = 'pullreq_branch_updated',
  PR_CLOSED = 'pullreq_closed',
  PR_COMMENT_CREATED = 'pullreq_comment_created',
  PR_MERGED = 'pullreq_merged'
}

export type CreateWebhookFormFields = z.infer<typeof createWebhookFormSchema>

export interface WebhookFormFieldProps {
  register?: UseFormRegister<CreateWebhookFormFields>
  errors?: FieldErrors<CreateWebhookFormFields>
  watch?: UseFormWatch<CreateWebhookFormFields>
  setValue?: UseFormSetValue<CreateWebhookFormFields>
}

export interface WebhookEvent {
  id: string
  event: string
}

export type EventTypes = {
  branchEvents: BranchEvents
  tagEvents: TagEvents
  prEvents: PREvents
}
