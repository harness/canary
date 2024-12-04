export enum PRCommentFilterType {
  SHOW_EVERYTHING = 'showEverything',
  ALL_COMMENTS = 'allComments',
  MY_COMMENTS = 'myComments',
  RESOLVED_COMMENTS = 'resolvedComments',
  UNRESOLVED_COMMENTS = 'unresolvedComments'
}

export interface TypesListCommitResponse {
  commits?: TypesCommit[] | null
  rename_details?: TypesRenameDetails[] | null
  total_commits?: number
}

export interface TypesPullReqChecks {
  checks?: TypesPullReqCheck[] | null
  commit_sha?: string
}

export interface TypesRenameDetails {
  commit_sha_after?: string
  commit_sha_before?: string
  new_path?: string
  old_path?: string
}

export type EnumPullReqReviewDecision = 'approved' | 'changereq' | 'pending' | 'reviewed' | 'outdated'

export enum orderSortDate {
  ASC = 'asc',
  DESC = 'desc'
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

export enum PullReqReviewDecision {
  approved = 'approved',
  changeReq = 'changereq',
  pending = 'pending',
  outdated = 'outdated'
}
export interface Reviewer {
  id: number
  uid: string
  display_name: string
  email: string
  type: string
  created: number
  updated: number
}

export enum MergeCheckStatus {
  MERGEABLE = 'mergeable',
  UNCHECKED = 'unchecked',
  CONFLICT = 'conflict'
}

export enum PullRequestState {
  OPEN = 'open',
  MERGED = 'merged',
  CLOSED = 'closed'
}

export interface AddedBy {
  id: number
  uid: string
  display_name: string
  email: string
  type: string
  created: number
  updated: number
}

export interface ReviewerData {
  created: number
  updated: number
  type: string
  latest_review_id: number
  review_decision: EnumPullReqReviewDecision
  sha: string
  reviewer: Reviewer
  added_by: AddedBy
}

export interface TypesPullReq {
  author?: TypesPrincipalInfo
  closed?: number | null
  created?: number
  description?: string
  edited?: number
  is_draft?: boolean
  merge_base_sha?: string
  merge_check_status?: string
  merge_conflicts?: string[]
  merge_method?: EnumMergeMethod
  merge_target_sha?: string | null
  merged?: number | null
  merger?: TypesPrincipalInfo
  number?: number
  source_branch?: string
  source_repo_id?: number
  source_sha?: string
  state?: EnumPullReqState
  stats?: TypesPullReqStats
  target_branch?: string
  target_repo_id?: number
  title?: string
  labels?: TypesLabelPullReqAssignmentInfo[]
}

export interface TypesLabelPullReqAssignmentInfo {
  color?: EnumLabelColor
  id?: number
  key?: string
  scope?: number
  value?: string | null
  value_color?: EnumLabelColor
  value_count?: number
  value_id?: number | null
}
export type EnumLabelColor =
  | 'blue'
  | 'brown'
  | 'cyan'
  | 'green'
  | 'indigo'
  | 'lime'
  | 'mint'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'violet'
  | 'yellow'

export type EnumMergeMethod = 'fast-forward' | 'merge' | 'rebase' | 'squash'

export type EnumPullReqState = 'closed' | 'merged' | 'open'

export interface TypesPullReqStats {
  additions?: number | null
  commits?: number | null
  conversations?: number
  deletions?: number | null
  files_changed?: number | null
  unresolved_count?: number
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

export interface TypesPullReqCheck {
  bypassable?: boolean
  required?: boolean
  check?: TypesCheck
}

export interface TypesCheckPayload {
  data?: unknown
  kind?: EnumCheckPayloadKind
  version?: string
}
export type EnumCheckPayloadKind = '' | 'markdown' | 'pipeline' | 'raw'
export type EnumCheckStatus = 'error' | 'failure' | 'pending' | 'running' | 'success' | 'blocked'

export interface TypesCommit {
  author?: TypesSignature
  committer?: TypesSignature
  message?: string
  parent_shas?: string[]
  sha?: string
  stats?: TypesCommitStats
  title?: string
}
export interface TypesCommitStats {
  files?: TypesCommitFileStats[]
  total?: TypesChangeStats
}

export interface TypesChangeStats {
  changes?: number
  deletions?: number
  insertions?: number
}

export interface TypesCommitFileStats {
  changes?: number
  deletions?: number
  insertions?: number
  old_path?: string
  path?: string
  status?: string
}

export interface TypesSignature {
  identity?: TypesIdentity
  when?: string
}
export interface TypesIdentity {
  email?: string
  name?: string
}

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

export type EnumPullReqReviewerType = 'assigned' | 'requested' | 'self_assigned'

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

export interface TypesCodeOwnerEvaluation {
  evaluation_entries?: TypesCodeOwnerEvaluationEntry[] | null
  file_sha?: string
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
}

export interface RepoRepositoryOutput {
  created?: number
  created_by?: number
  default_branch?: string
  deleted?: number | null
  description?: string
  fork_id?: number
  git_ssh_url?: string
  git_url?: string
  id?: number
  identifier?: string
  importing?: boolean
  is_empty?: boolean
  is_public?: boolean
  num_closed_pulls?: number
  num_forks?: number
  num_merged_pulls?: number
  num_open_pulls?: number
  num_pulls?: number
  parent_id?: number
  path?: string
  size?: number
  size_updated?: number
  state?: EnumRepoState
  updated?: number
}

export type EnumRepoState = number

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

export enum ReviewerAddActivity {
  REQUESTED = 'requested',
  ASSIGNED = 'assigned',
  SELF_ASSIGNED = 'self_assigned'
}

export enum CodeCommentState {
  ACTIVE = 'active',
  RESOLVED = 'resolved'
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

export interface PayloadAuthor {
  display_name: string
}

export interface PayloadCreated {
  created: number
}

export interface Payload {
  payload: {
    author: PayloadAuthor
  }
}
export interface PayloadCodeComment {
  path: string
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

export enum MergeStrategy {
  MERGE = 'merge',
  SQUASH = 'squash',
  REBASE = 'rebase'
}

export interface PullRequestAction {
  id: string
  title: string
  description?: string
  action?: () => void
}

export const PullRequestFilterOption = {
  ...PullRequestState,
  // REJECTED: 'rejected',
  DRAFT: 'draft',
  YOURS: 'yours',
  ALL: 'all'
}

export type IconType = 'pr-open' | 'pr-closed' | 'pr-draft' | 'pr-merge'

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
