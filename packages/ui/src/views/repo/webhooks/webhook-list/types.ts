import { TranslationStore } from '@views/repo'
import { CreateWebhookFormFields } from '@views/repo/webhooks/webhook-create/types'

export interface WebhookType {
  id: number
  name: string
  enabled: boolean
  createdAt: string
  description: string
  updated: number
}

export interface WebhookStore {
  webhooks: WebhookType[] | null
  // onDelete: (id: number) => void
  preSetWebhookData: CreateWebhookFormFields | null
  setPreSetWebhookData: (data: CreateWebhookFormFields | null) => void
  error: string | undefined
  setError: (error?: string) => void
  totalPages: number
  webhookLoading: boolean
  setWebhookLoading: (webhookLoading: boolean) => void
  page: number
  setPage: (page: number) => void
  setWebhooks: (data: ListRepoWebhooksOkResponse, headers: Headers | undefined) => void
}
export declare type ListRepoWebhooksOkResponse = OpenapiWebhookType[]

export interface OpenapiWebhookType {
  created?: number
  created_by?: number
  description?: string
  display_name?: string
  enabled?: boolean
  has_secret?: boolean
  id?: number
  identifier?: string
  insecure?: boolean
  latest_execution_result?: EnumWebhookExecutionResult
  parent_id?: number
  parent_type?: EnumWebhookParent
  triggers?: EnumWebhookTrigger[] | null
  updated?: number
  url?: string
  version?: number
}

export declare type EnumWebhookParent = 'repo' | 'space'

export declare type EnumWebhookExecutionResult = 'fatal_error' | 'retriable_error' | 'success' | null

export declare type EnumWebhookTrigger =
  | 'branch_created'
  | 'branch_deleted'
  | 'branch_updated'
  | 'pullreq_branch_updated'
  | 'pullreq_closed'
  | 'pullreq_comment_created'
  | 'pullreq_created'
  | 'pullreq_label_assigned'
  | 'pullreq_merged'
  | 'pullreq_reopened'
  | 'pullreq_updated'
  | 'tag_created'
  | 'tag_deleted'
  | 'tag_updated'

export interface RepoWebhookListPageProps {
  useWebhookStore: () => WebhookStore
  useTranslationStore: () => TranslationStore
  openDeleteWebhookDialog: (id: number) => void
}
