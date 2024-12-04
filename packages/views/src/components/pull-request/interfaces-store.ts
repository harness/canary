import { ExecutionState } from '../execution/types'
import {
  RepoRepositoryOutput,
  TypesListCommitResponse,
  TypesPullReq,
  TypesPullReqActivity,
  TypesPullReqChecks,
  TypesPullReqStats,
  TypesRuleViolations
} from './interfaces'

export interface PullReqCount {
  error: number
  failure: number
  pending: number
  running: number
  success: number
  skipped: number
  killed: number
}

export interface CheckInfo {
  title: string
  content: string
  color: string
  status: string
}

export interface CommentsInfoData {
  header: string
  content?: string
  status: string
}

export interface RuleViolationData {
  rule_violations: TypesRuleViolations[]
}

export interface RuleViolationArr {
  data: RuleViolationData
}

export interface PullReqChecksDecisionData {
  overallStatus?: ExecutionState
  count: PullReqCount
  error: unknown
  data?: TypesPullReqChecks
  color: string
  background: string
  message: string
  summaryText: string
  checkInfo: CheckInfo
}

export interface PRPanelData {
  conflictingFiles?: string[]
  requiresCommentApproval: boolean
  atLeastOneReviewerRule: boolean
  reqCodeOwnerApproval: boolean
  minApproval: number
  reqCodeOwnerLatestApproval: boolean
  minReqLatestApproval: number
  resolvedCommentArr?: { params: number[] }
  PRStateLoading: boolean
  ruleViolation: boolean
  commentsLoading: boolean
  commentsInfoData: CommentsInfoData
  ruleViolationArr?: RuleViolationArr
}

export interface PullRequestDataState {
  repoMetadata?: RepoRepositoryOutput
  setRepoMetadata: (metadata: RepoRepositoryOutput) => void
  pullReqMetadata?: TypesPullReq
  pullReqStats?: TypesPullReqStats
  pullReqCommits?: TypesListCommitResponse
  setPullReqCommits: (commits: TypesListCommitResponse) => void
  pullReqActivities?: TypesPullReqActivity[]
  loading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  pullReqChecksDecision: PullReqChecksDecisionData
  showEditDescription: boolean
  setShowEditDescription: (show: boolean) => void
  setRuleViolationArr: (arr: RuleViolationArr | undefined) => void
  refetchActivities: () => void
  refetchCommits: () => void
  refetchPullReq: () => void
  retryOnErrorFunc: () => void
  dryMerge: () => void
  prPanelData: PRPanelData
  updateCommentStatus: (
    repoId: string,
    pullReqNumber: number,
    commentId: number,
    status: string,
    refetchActivities: () => void
  ) => Promise<TypesPullReqActivity | undefined>
  setCommentsInfoData: (info: CommentsInfoData) => void
  setCommentsLoading: (loading: boolean) => void
  setResolvedCommentArr: (resolvedCommentArr: { params: number[] } | undefined) => void
  setPullReqMetadata: (metadata: TypesPullReq | undefined) => void
  setPullReqStats: (stats: TypesPullReqStats | undefined) => void
  updateState: (newState: Partial<PullRequestDataState>) => void
}
