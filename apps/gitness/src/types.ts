import {
  TypesCodeOwnerEvaluation,
  TypesCodeOwnerEvaluationEntry,
  TypesOwnerEvaluation,
  TypesPullReqReviewer,
  TypesUserGroupOwnerEvaluation
} from '@harnessio/code-service-client'

export enum ExecutionState {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
  ERROR = 'error',
  SKIPPED = 'skipped',
  KILLED = 'killed'
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
