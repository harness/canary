import { PrincipalType, UsererrorError } from '@/types'
import {
  EnumPullReqReviewDecision,
  PRReviewer,
  PullReqReviewDecision,
  RepoRepositoryOutput,
  TypesListCommitResponse,
  TypesPullReq,
  TypesPullReqStats
} from '@/views'

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
  disabled?: boolean
  loading?: boolean
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

export interface DefaultReviewersApprovalsData {
  current_count?: number
  evaluations?: TypesReviewerEvaluation[] | null
  minimum_required_count?: number
  minimum_required_count_latest?: number
  principals?: TypesPrincipalInfo[] | null
  user_groups?: TypesUserGroupInfo[] | null
}

/**
 * Interface for the defaultReviewersData object
 */
export interface DefaultReviewersDataProps {
  defReviewerLatestApprovalRequiredByRule: boolean
  defReviewerApprovalRequiredByRule: boolean
  defReviewerApprovedChanges: boolean
  defReviewerApprovedLatestChanges: boolean
  defaultReviewersApprovals?: DefaultReviewersApprovalsData[]
}

export interface PRPanelData {
  conflictingFiles?: string[]
  allowedMethods?: string[]
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
  defaultReviewersApprovals?: DefaultReviewersApprovalsData[]
  mergeBlockedViaRule?: boolean
}

export interface DiffStatistics {
  additions?: number
  commits?: number
  deletions?: number
  files_changed?: number
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
  user_group_mentions?: { [key: string]: TypesUserGroupInfo }
}

export type EnumPrincipalType = 'service' | 'serviceaccount' | 'user'

export interface TypesPrincipalInfo {
  created?: number
  display_name?: string
  email?: string
  id?: number
  type?: EnumPrincipalType
  uid?: string
  updated?: number
}

export interface TypesUserGroupInfo {
  description?: string
  id?: number
  identifier?: string
  name?: string
  scope?: number
}

export declare type EnumPullReqReviewerType = 'assigned' | 'requested' | 'self_assigned' | 'default' | 'code_owners'

export declare type ReviewerListPullReqOkResponse = TypesPullReqReviewer[]
export interface TypesPullReqReviewer {
  added_by?: Partial<PrincipalType>
  created?: number
  latest_review_id?: number | null
  review_decision?: EnumPullReqReviewDecision
  reviewer?: Partial<PrincipalType>
  sha?: string
  type?: EnumPullReqReviewerType
  updated?: number
}

export interface TypesReviewerEvaluation {
  decision?: EnumPullReqReviewDecision
  reviewer?: TypesPrincipalInfo
  sha?: string
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
  user_group_ids?: number[]
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
  | 'merge'
  | 'review-submit'
  | 'reviewer-delete'
  | 'state-change'
  | 'title-change'
  | 'reviewer-add'
  | 'label-modify'
  | 'branch-restore'
  | 'target-branch-change'
  | 'title-change'
  | 'user-group-reviewer-add'
  | 'user-group-reviewer-delete'

export enum ReviewerAddActivity {
  REQUESTED = 'requested',
  ASSIGNED = 'assigned',
  SELF_ASSIGNED = 'self_assigned',
  DEFAULT = 'default',
  CODEOWNERS = 'code_owners'
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
  reported_by?: Partial<PrincipalType>
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
export type EnumCheckStatus = 'error' | 'failure' | 'pending' | 'running' | 'success' | 'blocked' | 'failure_ignored'

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
  UNKNOWN = 'unknown',
  FAILURE_IGNORED = 'failure_ignored',
  IGNORE_FAILED = 'ignorefailed'
}

export interface DiffViewerExchangeState {
  collapsed?: boolean
  useFullDiff?: boolean
  fullDiff?: DiffFileEntry
  comments?: Map<number, CommentRestorationTrackingState>
  commentsVisibilityAtLineNumber?: Map<number, boolean>
}

export interface DiffViewerState {
  collapsed?: boolean
  useFullDiff?: boolean
  fullRawDiff?: string
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
  appliedCheckSum?: string
  checkSums?: string[]
  codeBlockContent?: string
  appliedCommitSha?: string
}

export interface DiffFileEntry extends DiffFile {
  filePath: string
  containerId: string
  contentId: string
  fileViews?: Map<string, string>
  isRename?: boolean
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
  UNORDERED_LIST = 'UNORDERED_LIST',
  CHECK_LIST = 'CHECK_LIST',
  CODE_BLOCK = 'CODE_BLOCK',
  SUGGESTION = 'SUGGESTION',
  AI_SUMMARY = 'AI_SUMMARY'
}

export interface ApprovalItems {
  items: ApprovalItem[]
}
export type ButtonEnum = 'success' | 'muted' | 'default' | 'error' | 'warning' | null | undefined
export type EnumPullReqReviewDecisionExtended = EnumPullReqReviewDecision | 'outdated'
export interface ReviewerItemProps {
  reviewer?: PRReviewer['reviewer']
  reviewDecision?: EnumPullReqReviewDecision
  sha?: string
  sourceSHA?: string
  processReviewDecision: (
    review_decision: EnumPullReqReviewDecision,
    reviewedSHA?: string,
    sourceSHA?: string
  ) => EnumPullReqReviewDecision | PullReqReviewDecision.outdated
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

export interface PullRequestRoutingProps {
  toPRCheck: ({ pipelineId, executionId }: { pipelineId: string; executionId: string }) => string
}

export type LatestCodeOwnerApprovalArrType = {
  entryEvaluation: TypesOwnerEvaluation[]
}

export interface PullRequestChangesSectionProps {
  changesInfo: { header: string; content: string; status: string }
  minApproval?: number
  codeOwnersData: CodeOwnersData
  minReqLatestApproval?: number
  approvedEvaluations?: TypesPullReqReviewer[]
  changeReqEvaluations?: TypesPullReqReviewer[]
  latestApprovalArr?: TypesPullReqReviewer[]
  reqNoChangeReq?: boolean
  changeReqReviewer?: string
  accordionValues: string[]
  defaultReviewersData?: DefaultReviewersDataProps
  pullReqMetadata?: TypesPullReq
}

export interface CodeOwnersData {
  codeOwners?: TypesCodeOwnerEvaluation | null
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

export type CodeOwnersSectionProps = Pick<PullRequestChangesSectionProps, 'minReqLatestApproval' | 'pullReqMetadata'> &
  CodeOwnersData & { className?: string }

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
  BRANCH_UPDATE = 'branch-update',
  BRANCH_DELETE = 'branch-delete',
  STATE_CHANGE = 'state-change',
  REVIEWER_ADD = 'reviewer-add',
  USER_GROUP_REVIEWER_ADD = 'user-group-reviewer-add',
  REVIEWER_DELETE = 'reviewer-delete',
  USER_GROUP_REVIEWER_DELETE = 'user-group-reviewer-delete',
  LABEL_MODIFY = 'label-modify',
  BRANCH_RESTORE = 'branch-restore',
  TARGET_BRANCH_CHANGE = 'target-branch-change'
}

export enum LabelActivity {
  ASSIGN = 'assign',
  UN_ASSIGN = 'unassign',
  RE_ASSIGN = 'reassign'
}

export interface DiffHeaderProps {
  text: string
  data?: string
  title: string
  lang: string
  addedLines?: number
  deletedLines?: number
  isBinary?: boolean
  isDeleted?: boolean
  unchangedPercentage?: number
  filePath?: string
  fileViews?: Map<string, string>
  checksumAfter?: string
  diffData?: DiffFileEntry
}

export enum MergeStrategy {
  MERGE = 'merge',
  SQUASH = 'squash',
  REBASE = 'rebase',
  FAST_FORWARD = 'fast-forward'
}

export enum MergeMethodDisplay {
  MERGED = 'merged',
  SQUASHED = 'squashed',
  REBASED = 'rebased',
  FAST_FORWARDED = 'fast-forwarded'
}

export const mergeMethodMapping: Record<MergeStrategy, MergeMethodDisplay> = {
  [MergeStrategy.MERGE]: MergeMethodDisplay.MERGED,
  [MergeStrategy.SQUASH]: MergeMethodDisplay.SQUASHED,
  [MergeStrategy.REBASE]: MergeMethodDisplay.REBASED,
  [MergeStrategy.FAST_FORWARD]: MergeMethodDisplay.FAST_FORWARDED
}
export type PrincipalsMentionMap = Record<string, TypesPrincipalInfo>

export interface PrincipalPropsType {
  principals?: PrincipalType[]
  userGroups?: TypesUserGroupInfo[]
  searchPrincipalsQuery?: string
  setSearchPrincipalsQuery?: (query: string) => void
  isPrincipalsLoading?: boolean
  principalsError?: UsererrorError | null
}
