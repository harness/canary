import {
  TypesCodeOwnerEvaluation,
  TypesCodeOwnerEvaluationEntry,
  TypesOwnerEvaluation,
  TypesPullReqReviewer,
  TypesUserGroupOwnerEvaluation
} from '@harnessio/code-service-client'

/**
 * Ensure this should come from @harnessio/code-service-client instead
 */
export enum SSEEvent {
  EXECUTION_UPDATED = 'execution_updated',
  EXECUTION_COMPLETED = 'execution_completed',
  EXECUTION_CANCELED = 'execution_canceled',
  EXECUTION_RUNNING = 'execution_running',
  PULLREQ_UPDATED = 'pullreq_updated',
  REPO_IMPORTED = 'repository_import_completed'
}

export interface CreateFormType {
  name: string
  branch: string
  yamlPath: string
}

export enum CodeOwnerReqDecision {
  CHANGEREQ = 'changereq',
  APPROVED = 'approved',
  WAIT_FOR_APPROVAL = ''
}

export interface PullRequestChangesSectionProps {
  changesInfo: { header: string; content: string; status: string }
  minApproval?: number
  codeOwners?: TypesCodeOwnerEvaluation | null
  minReqLatestApproval?: number
  approvedEvaluations?: TypesPullReqReviewer[]
  changeReqEvaluations?: TypesPullReqReviewer[]
  latestApprovalArr?: TypesPullReqReviewer[]
  reqNoChangeReq?: boolean
  changeReqReviewer?: string
  codeOwnerChangeReqEntries?: (
    | {
        owner_evaluations: TypesOwnerEvaluation[]
        line_number?: number
        pattern?: string
        user_group_owner_evaluations?: TypesUserGroupOwnerEvaluation[] | null
      }
    | undefined
  )[]
  reqCodeOwnerApproval?: boolean
  reqCodeOwnerLatestApproval?: boolean
  codeOwnerPendingEntries?: TypesCodeOwnerEvaluationEntry[]
  codeOwnerApprovalEntries?: (
    | {
        owner_evaluations: TypesOwnerEvaluation[]
        line_number?: number
        pattern?: string
        user_group_owner_evaluations?: TypesUserGroupOwnerEvaluation[] | null
      }
    | undefined
  )[]
  latestCodeOwnerApprovalArr?: (
    | {
        entryEvaluation: TypesOwnerEvaluation[]
      }
    | undefined
  )[]
}

export type extractInfoForCodeOwnerContentProps = Pick<
  PullRequestChangesSectionProps,
  | 'approvedEvaluations'
  | 'reqNoChangeReq'
  | 'reqCodeOwnerApproval'
  | 'minApproval'
  | 'reqCodeOwnerLatestApproval'
  | 'minReqLatestApproval'
  | 'codeOwnerChangeReqEntries'
  | 'codeOwnerPendingEntries'
  | 'latestCodeOwnerApprovalArr'
  | 'latestApprovalArr'
  | 'codeOwnerApprovalEntries'
  | 'changeReqReviewer'
  | 'changeReqEvaluations'
>

export enum orderSortDate {
  ASC = 'asc',
  DESC = 'desc'
}

export enum PageResponseHeader {
  xTotal = 'x-total',
  xTotalPages = 'x-total-pages',
  xPerPage = 'x-per-page',
  xNextPage = 'x-next-page',
  xPrevPage = 'x-prev-page'
}
