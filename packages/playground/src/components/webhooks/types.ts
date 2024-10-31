import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'
import { createWebhookFormSchema } from './create-webhooks-form-schema'

export enum BranchEvents {
  BRANCH_CREATED = 'Branch created',
  BRANCH_UPDATED = 'Branch updated',
  BRANCH_DELETED = 'Branch deleted'
}

export enum TagEvents {
  TAG_CREATED = 'Tag created',
  TAG_UPDATED = 'Tag updated',
  TAG_DELETED = 'Tag deleted'
}

export enum PREvents {
  PR_CREATED = 'PR created',
  PR_UPDATED = 'PR updated',
  PR_OPENED = 'PR opened',
  PR_BRANCH_UPDATED = 'PR branch updated',
  PR_CLOSED = 'PR closed',
  PR_COMMENT_CREATED = 'PR comment created',
  PR_MERGED = 'PR merged'
}

export type CreateWebhookFormFields = z.infer<typeof createWebhookFormSchema>

export interface FieldProps {
  register?: UseFormRegister<CreateWebhookFormFields>
  errors?: FieldErrors<CreateWebhookFormFields>
  watch?: UseFormWatch<CreateWebhookFormFields>
  setValue?: UseFormSetValue<CreateWebhookFormFields>
}

export interface WebhookEvent {
  id: number
  event: string
}

export type EventTypes = {
  branchEvents: BranchEvents
  tagEvents: TagEvents
  prEvents: PREvents
}
