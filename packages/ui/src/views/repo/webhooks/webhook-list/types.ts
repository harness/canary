import { CreateWebhookFormFields } from '@views/repo/webhooks/webhook-create/types'

export interface WebhookType {
  id: number
  display_name: string
  enabled: boolean
  createdAt: string
  description: string
  updated: number
  latest_execution_result: EnumWebhookExecutionResult | null
  triggers: EnumWebhookTrigger[] | null
}

export interface WebhookExecutionType {
  created?: number
  duration?: number
  error?: string
  id?: number
  request?: { body: string; headers: string; url: string }
  response?: { body: string; headers: string; status: string; status_code: number }
  result?: EnumWebhookExecutionResult
  retrigger_of?: number | null
  retriggerable?: boolean
  trigger_type?: EnumWebhookTrigger
  webhook_id?: number
}

export interface WebhookStore {
  webhooks: WebhookType[] | null
  totalItems: number
  pageSize: number
  executionId: number | null
  webhookExecutionPage: number
  preSetWebhookData: CreateWebhookFormFields | null
  executions: WebhookExecutionType[] | null
  setPreSetWebhookData: (data: CreateWebhookFormFields | null) => void
  error: string | undefined
  setError: (error?: string) => void
  webhookLoading: boolean
  setWebhookLoading: (webhookLoading: boolean) => void
  setWebhookExecutionPage: (page: number) => void
  setExecutions: (data: WebhookExecutionType[]) => void
  page: number
  setPage: (page: number) => void
  setWebhooks: (data: ListRepoWebhooksOkResponse) => void
  setPaginationFromHeaders: (headers: Headers | undefined) => void
  setExecutionId: (id: number | null) => void
  updateExecution: (updatedExecution: WebhookExecutionType) => void
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

export type EnumWebhookTrigger =
  | 'branch_created'
  | 'branch_deleted'
  | 'branch_updated'
  | 'pullreq_branch_updated'
  | 'pullreq_closed'
  | 'pullreq_comment_created'
  | 'pullreq_comment_status_updated'
  | 'pullreq_comment_updated'
  | 'pullreq_created'
  | 'pullreq_label_assigned'
  | 'pullreq_merged'
  | 'pullreq_reopened'
  | 'pullreq_review_submitted'
  | 'pullreq_updated'
  | 'tag_created'
  | 'tag_deleted'
  | 'tag_updated'

export interface RepoWebhookListPageProps {
  useWebhookStore: () => WebhookStore
  openDeleteWebhookDialog: (id: number) => void
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  webhookLoading: boolean
  handleEnableWebhook: (id: number, enabled: boolean) => void
  toRepoWebhookDetails?: ({ webhookId }: { webhookId: number }) => string
  toRepoWebhookCreate?: () => string
}
