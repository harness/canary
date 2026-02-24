// Mock for @harnessio/views - provides only the types/enums needed for tests

export enum PipelineExecutionStatus {
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

export enum SummaryItemType {
  Folder = 0,
  File = 1
}

export interface RepoFile {
  type: SummaryItemType
  name: string
  lastCommitMessage: string
  timestamp: string
  user?: { name: string; avatarUrl?: string }
  sha?: string
  path: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
  status?: string
}

// Scope types
export interface Scope {
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export interface ExtendedScope extends Scope {
  space?: string
  repo?: string
}

// Filters
export interface PRListFilters {
  state?: string
  query?: string
  author?: string
}

// Default reviewers types
export interface DefaultReviewersDataProps {
  reviewers?: unknown[]
  approvals?: unknown[]
}

export interface DefaultReviewersApprovalsData {
  required?: number
  current?: number
}

// Patterns button type
export enum PatternsButtonType {
  INCLUDE = 'Include',
  EXCLUDE = 'Exclude'
}

// Target repos button type
export enum TargetReposButtonType {
  SELECT_INCLUDED = 'Select Included',
  SELECT_EXCLUDED = 'Select Excluded'
}

// Bypass list type
export enum EnumBypassListType {
  SERVICE = 'service',
  SERVICEACCOUNT = 'serviceaccount',
  USER = 'user',
  USER_GROUP = 'user_group'
}

// Push rules
export enum PushRuleId {
  FILE_SIZE_LIMIT = 'push.file_size_limit',
  PRINCIPAL_COMMITTER_MATCH = 'push.principal_committer_match',
  SECRET_SCANNING_ENABLED = 'push.secret_scanning_enabled'
}

// Branch rules
export enum BranchRuleId {
  REQUIRE_LATEST_COMMIT = 'require_latest_commit',
  REQUIRE_NO_CHANGE_REQUEST = 'require_no_change_request',
  COMMENTS = 'comments',
  STATUS_CHECKS = 'status_checks',
  MERGE = 'merge',
  DELETE_BRANCH = 'delete_branch',
  BLOCK_BRANCH_CREATION = 'create_forbidden',
  BLOCK_BRANCH_DELETION = 'delete_forbidden',
  BLOCK_BRANCH_UPDATE = 'update_forbidden_with_merge_block',
  BLOCK_FORCE_PUSH = 'update_force_forbidden',
  REQUIRE_PULL_REQUEST = 'update_forbidden_without_merge_block',
  ENABLE_DEFAULT_REVIEWERS = 'enable_default_reviewers',
  REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT = 'require_minimum_default_reviewer_count',
  REQUIRE_CODE_REVIEW = 'require_minimum_count',
  REQUIRE_CODE_OWNERS = 'require_code_owners',
  AUTO_ADD_CODE_OWNERS = 'request_code_owners'
}

// Utility functions
export const easyPluralize = (count: number, singular: string, plural?: string) => {
  return count === 1 ? singular : (plural || singular + 's')
}

// Add any other exports that tests might need
export const SandboxLayout = {
  SubHeader: () => null,
  Root: () => null,
  Main: () => null,
  LeftPanel: () => null,
  Content: () => null
}
