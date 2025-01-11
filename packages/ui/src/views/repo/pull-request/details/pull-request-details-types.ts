import { TypesListCommitResponse } from '@views/index'

import {
  EnumPullReqReviewDecision,
  PullReqReviewDecision,
  RepoRepositoryOutput,
  TypesPrincipalInfo,
  TypesPullReq,
  TypesPullReqStats
} from '../pull-request.types'

export interface PullReqCount {
  error: number
  failure: number
  pending: number
  running: number
  success: number
  skipped: number
  killed: number
}

export enum PullRequestState {
  OPEN = 'open',
  MERGED = 'merged',
  CLOSED = 'closed'
}

export interface PullRequestAction {
  id: string
  title: string
  description?: string
  action?: () => void
}

export enum CodeCommentState {
  ACTIVE = 'active',
  RESOLVED = 'resolved'
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
  diffs?: DiffFileEntry[]
  setDiffs: (info: DiffFileEntry[] | []) => void
}

export interface TypesPullReqActivity {
  author?: TypesPrincipalInfo
  code_comment?: TypesCodeCommentFields
  created?: number
  deleted?: number | null
  edited?: number
  id?: number
  kind?: EnumPullReqActivityKind
  mentions?: {
    [key: string]: TypesPrincipalInfo
  }
  metadata?: TypesPullReqActivityMetadata
  order?: number
  parent_id?: number | null
  payload?: GeneralPayload | TypesPullReqActivity
  pullreq_id?: number
  repo_id?: number
  resolved?: number | null
  resolver?: TypesPrincipalInfo
  sub_order?: number
  text?: string
  type?: EnumPullReqActivityType
  updated?: number
  forced?: boolean
}
export declare type EnumPullReqReviewerType = 'assigned' | 'requested' | 'self_assigned'

export declare type ReviewerListPullReqOkResponse = TypesPullReqReviewer[]
export interface TypesPullReqReviewer {
  added_by?: TypesPrincipalInfo
  created?: number
  latest_review_id?: number | null
  review_decision?: EnumPullReqReviewDecision
  reviewer?: TypesPrincipalInfo
  sha?: string
  type?: EnumPullReqReviewerType
  updated?: number
}

export interface TypesCodeCommentFields {
  line_new?: number
  line_old?: number
  merge_base_sha?: string
  outdated?: boolean
  path?: string
  source_sha?: string
  span_new?: number
  span_old?: number
}

export type EnumPullReqActivityKind = 'change-comment' | 'comment' | 'system'

export interface TypesPullReqActivityMetadata {
  mentions?: TypesPullReqActivityMentionsMetadata
  suggestions?: TypesPullReqActivitySuggestionsMetadata
}

export interface TypesPullReqActivityMentionsMetadata {
  ids?: number[]
}
export interface TypesPullReqActivitySuggestionsMetadata {
  applied_check_sum?: string
  applied_commit_sha?: string
  check_sums?: string[]
}

export interface GeneralPayload extends TypesPullReqActivity {
  text?: string
  [key: string]: unknown
  payload?: GeneralPayload
  type?: EnumPullReqActivityType
  kind?: EnumPullReqActivityKind
  message?: string
  reviewer_type?: ReviewerAddActivity
}

export type EnumPullReqActivityType =
  | 'branch-delete'
  | 'branch-update'
  | 'code-comment'
  | 'comment'
  | 'label-modify'
  | 'merge'
  | 'review-submit'
  | 'reviewer-delete'
  | 'state-change'
  | 'title-change'
  | 'reviewer-add'
  | 'label-modify'
  | 'branch-restore'

export enum ReviewerAddActivity {
  REQUESTED = 'requested',
  ASSIGNED = 'assigned',
  SELF_ASSIGNED = 'self_assigned'
}

export interface TypesPullReqChecks {
  checks?: TypesPullReqCheck[] | null
  commit_sha?: string
}

export interface TypesPullReqCheck {
  bypassable?: boolean
  required?: boolean
  check?: TypesCheck
}

export interface TypesCheck {
  created?: number
  ended?: number
  id?: number
  identifier?: string
  link?: string
  metadata?: unknown
  payload?: TypesCheckPayload
  reported_by?: TypesPrincipalInfo
  started?: number
  status?: EnumCheckStatus
  summary?: string
  updated?: number
}

export interface TypesCheckPayload {
  data?: unknown
  kind?: EnumCheckPayloadKind
  version?: string
}

export type EnumCheckPayloadKind = '' | 'markdown' | 'pipeline' | 'raw'
export type EnumCheckStatus = 'error' | 'failure' | 'pending' | 'running' | 'success' | 'blocked'

export interface TypesViolation {
  code?: string
  message?: string
  params?: unknown
}

export interface TypesRuleViolations {
  bypassable?: boolean
  bypassed?: boolean
  rule?: TypesRuleInfo
  violations?: TypesViolation[] | null
}

export interface TypesRuleInfo {
  identifier?: string
  repo_path?: string
  space_path?: string
  state?: EnumRuleState
  type?: string
}

export type EnumRuleState = 'active' | 'disabled' | 'monitor' | null

export enum ExecutionState {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
  ERROR = 'error',
  SKIPPED = 'skipped',
  KILLED = 'killed',
  BLOCKED = 'blocked',
  WAITING_ON_DEPENDENCIES = 'waiting_on_dependencies',
  UNKNOWN = 'unknown'
}

export interface DiffViewerExchangeState {
  collapsed?: boolean
  useFullDiff?: boolean
  fullDiff?: DiffFileEntry
  comments?: Map<number, CommentRestorationTrackingState>
  commentsVisibilityAtLineNumber?: Map<number, boolean>
}

export interface CommentRestorationTrackingState extends DiffCommentItem<TypesPullReqActivity> {
  uncommittedText?: string
  showReplyPlaceHolder?: boolean
  uncommittedEditComments?: Map<number, string>
}

export interface DiffCommentItem<T = unknown> {
  inner: T
  left: boolean
  right: boolean
  lineNumberStart: number
  lineNumberEnd: number
  span: number
  commentItems: CommentItem<T>[]
  _commentItems?: CommentItem<T>[]
  filePath: string
  codeBlockContent?: string
  destroy: (() => void) | undefined
}
export interface CommentItem<T = unknown> {
  id: number
  author: string
  created: string | number
  edited: string | number
  updated: string | number
  deleted: string | number
  outdated: boolean
  content: string
  payload?: T // optional payload for callers to handle on callback calls
}

export interface DiffFileEntry extends DiffFile {
  fileId: string
  filePath: string
  containerId: string
  contentId: string
  fileViews?: Map<string, string>
}

export interface DiffFileName {
  oldName: string
  newName: string
}
export interface DiffFile extends DiffFileName {
  addedLines: number
  deletedLines: number
  isCombined: boolean
  isGitDiff: boolean
  language: string
  blocks: DiffBlock[]
  oldMode?: string | string[]
  newMode?: string
  deletedFileMode?: string
  newFileMode?: string
  isDeleted?: boolean
  isNew?: boolean
  isCopy?: boolean
  isRename?: boolean
  isBinary?: boolean
  isTooBig?: boolean
  unchangedPercentage?: number
  changedPercentage?: number
  checksumBefore?: string | string[]
  checksumAfter?: string
  mode?: string
  raw?: string
}

export interface DiffBlock {
  oldStartLine: number
  oldStartLine2?: number
  newStartLine: number
  header: string
  lines: DiffLine[]
}
export declare type DiffLineParts = {
  prefix: string
  content: string
}
export declare enum LineType {
  INSERT = 'insert',
  DELETE = 'delete',
  CONTEXT = 'context'
}

export interface DiffLineDeleted {
  type: LineType.DELETE
  oldNumber: number
  newNumber: undefined
}
export interface DiffLineInserted {
  type: LineType.INSERT
  oldNumber: undefined
  newNumber: number
}
export interface DiffLineContext {
  type: LineType.CONTEXT
  oldNumber: number
  newNumber: number
}
export declare type DiffLineContent = {
  content: string
}
export declare type DiffLine = (DiffLineDeleted | DiffLineInserted | DiffLineContext) & DiffLineContent

export interface ApprovalItem {
  id: number
  state?: string
  method: string
  title: string
  items?: ApprovalItems[]
}

export enum CommentAction {
  NEW = 'new',
  UPDATE = 'update',
  REPLY = 'reply',
  DELETE = 'delete',
  RESOLVE = 'resolve',
  REACTIVATE = 'reactivate'
}
export enum ToolbarAction {
  HEADER = 'HEADER',
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  UPLOAD = 'UPLOAD',
  UNORDER_LIST = 'UNORDER_LIST',
  CHECK_LIST = 'CHECK_LIST',
  CODE_BLOCK = 'CODE_BLOCK',
  SUGGESTION = 'SUGGESTION'
}

export interface ApprovalItems {
  items: ApprovalItem[]
}
export type ButtonEnum = 'success' | 'muted' | 'default' | 'error' | 'warning' | null | undefined
export type EnumPullReqReviewDecisionExtended = EnumPullReqReviewDecision | 'outdated'
export interface ReviewerItemProps {
  reviewer?: { display_name?: string; id?: number }
  reviewDecision?: EnumPullReqReviewDecision
  sha?: string
  sourceSHA?: string
  processReviewDecision: (
    review_decision: EnumPullReqReviewDecision,
    reviewedSHA?: string,
    sourceSHA?: string
  ) => EnumPullReqReviewDecision | PullReqReviewDecision.outdated
  handleDelete: (id: number) => void
}

export interface TypesCodeOwnerEvaluation {
  evaluation_entries?: TypesCodeOwnerEvaluationEntry[] | null
  file_sha?: string
}

export interface TypesOwnerEvaluation {
  owner?: TypesPrincipalInfo
  review_decision?: EnumPullReqReviewDecision
  review_sha?: string
}

export interface TypesUserGroupOwnerEvaluation {
  evaluations?: TypesOwnerEvaluation[] | null
  id?: string
  name?: string
}
export interface TypesCodeOwnerEvaluationEntry {
  line_number?: number
  owner_evaluations?: TypesOwnerEvaluation[] | null
  pattern?: string
  user_group_owner_evaluations?: TypesUserGroupOwnerEvaluation[] | null
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

export const PullRequestFilterOption = {
  ...PullRequestState,
  // REJECTED: 'rejected',
  DRAFT: 'draft',
  YOURS: 'yours',
  ALL: 'all'
}

export enum MergeCheckStatus {
  MERGEABLE = 'mergeable',
  UNCHECKED = 'unchecked',
  CONFLICT = 'conflict'
}

export interface PayloadAuthor {
  display_name: string
}

export interface PayloadCreated {
  created: number
}

export interface PayloadCodeComment {
  path: string
}

export enum orderSortDate {
  ASC = 'asc',
  DESC = 'desc'
}
export enum PRCommentFilterType {
  SHOW_EVERYTHING = 'showEverything',
  ALL_COMMENTS = 'allComments',
  MY_COMMENTS = 'myComments',
  RESOLVED_COMMENTS = 'resolvedComments',
  UNRESOLVED_COMMENTS = 'unresolvedComments'
}
export enum CommentType {
  COMMENT = 'comment',
  CODE_COMMENT = 'code-comment',
  TITLE_CHANGE = 'title-change',
  REVIEW_SUBMIT = 'review-submit',
  MERGE = 'merge',
  REVIEW_DELETE = 'reviewer-delete',
  BRANCH_UPDATE = 'branch-update',
  BRANCH_DELETE = 'branch-delete',
  STATE_CHANGE = 'state-change',
  REVIEW_ADD = 'reviewer-add',
  LABEL_MODIFY = 'label-modify'
}

export enum LabelActivity {
  ASSIGN = 'assign',
  UN_ASSIGN = 'unassign',
  RE_ASSIGN = 'reassign'
}
export enum MergeStrategy {
  MERGE = 'merge',
  SQUASH = 'squash',
  REBASE = 'rebase'
}
