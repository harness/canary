import { ReactNode } from 'react'

import { PrincipalType, UsererrorError } from '@harnessio/ui/types'
import {
  ColorsEnum,
  EnumBypassListType,
  ILabelsStore,
  LabelType,
  RepositoryType,
  Scope,
  TypesBranchTable,
  TypesRepositoryCore
} from '@views'
import { CheckboxOptions } from '@harnessio/ui/components'
import { ComboBoxOptions } from '@harnessio/ui/components'
import { StackedListPaginationProps } from '@harnessio/ui/components'

import { LabelsValue } from './components/labels'

export interface CommitSelectorListItem {
  title: string
  sha: string
}

export interface CommitSelectorDropdownProps {
  selectedCommit?: CommitSelectorListItem
  commitList: CommitSelectorListItem[]
  onSelectCommit?: (branchTag: CommitSelectorListItem) => void
  repoId?: string
  spaceId?: string
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}

export interface PullRequest extends PullRequestType {
  repo?: Pick<RepoRepositoryOutput, 'identifier' | 'path'>
}

export interface PullRequestType {
  is_draft?: boolean
  merged?: number | null // TODO: Should merged really be all these??
  name?: string
  number?: number
  sha?: string
  author?: string
  reviewRequired: boolean
  tasks?: number
  sourceBranch?: string
  targetBranch?: string
  timestamp: string
  comments?: number
  state?: EnumPullReqState
  updated: number
  labels: PRListLabelType[]
  source_repo?: TypesRepositoryCore
}

export type PRState = EnumPullReqState

export type IconType = 'git-pull-request-draft' | 'git-pull-request-closed' | 'git-merge' | 'git-pull-request'

export interface PullRequestListStore {
  pullRequests: PullRequest[] | null
  totalItems: number
  pageSize: number
  page: number
  prState: Array<PRState>
  setPrState: (prState: Array<PRState>) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setLabelsQuery: (query: string) => void
  openPullReqs: number
  closedPullReqs: number
  mergedPullReqs: number
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

export type EnumRepoState = number | null

export interface TypesDiffStats {
  additions?: number | null
  commits?: number | null
  deletions?: number | null
  files_changed?: number | null
}

export interface IPullRequestStore {
  pullRequest?: TypesPullReq | null
}

export interface TypesPullReq {
  author?: Partial<PrincipalType>
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
  merger?: Partial<PrincipalType>
  number?: number
  source_branch?: string
  source_repo_id?: number | null
  source_sha?: string
  state?: EnumPullReqState
  stats?: TypesPullReqStats
  target_branch?: string
  target_repo_id?: number | null
  title?: string
  labels?: TypesLabelPullReqAssignmentInfo[]
  updated?: number
  merge_violations_bypassed?: boolean | null
  rebase_check_status?: string
  rebase_conflicts?: string[]
}

export type EnumMergeMethod = 'fast-forward' | 'merge' | 'rebase' | 'squash'

export type EnumPullReqState = 'closed' | 'merged' | 'open'

export enum PrState {
  Draft = 'draft',
  Ready = 'ready',
  Success = 'success',
  Error = 'error',
  Closed = 'closed',
  Merged = 'merged'
}

export declare type EnumPullReqReviewDecision = 'approved' | 'changereq' | 'pending' | 'reviewed'

export enum PullReqReviewDecision {
  approved = 'approved',
  changeReq = 'changereq',
  pending = 'pending',
  outdated = 'outdated',
  approve = 'approve'
}

export interface TypesPullReqStats {
  additions?: number | null
  commits?: number | null
  conversations?: number
  deletions?: number | null
  files_changed?: number | null
  unresolved_count?: number
}

export interface PRReviewer {
  reviewer: { display_name: string; id: number; email: string; type: EnumBypassListType }
  review_decision?: EnumPullReqReviewDecision
  sha?: string
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

export interface CreateCommentPullReqRequest {
  line_end?: number
  line_end_new?: boolean
  line_start?: number
  line_start_new?: boolean
  parent_id?: number
  path?: string
  source_commit_sha?: string
  target_commit_sha?: string
  text?: string
}

export interface CommitSuggestion {
  check_sum: string
  comment_id: number
}

export interface LabelAssignmentType {
  assigned?: boolean | null
  assigned_value?: {
    color?: ColorsEnum
    id?: number | null
    value?: string | null
  }
  color: ColorsEnum
  id: number
  key: string
  scope: number
  type: LabelType
  values?: {
    color?: ColorsEnum
    id?: number | null
    value?: string | null
  }[]
}

export interface HandleAddLabelType {
  label_id: number
  value?: string
  value_id?: number
}

export interface PRListLabelType {
  color: ColorsEnum
  key: string
  value?: string
  id?: number
  scope: number
}

interface RoutingProps {
  toPullRequest: ({ prNumber, repoId, repoPath }: { prNumber: number; repoId?: string; repoPath?: string }) => string
  onClickPullRequest: ({ prNumber, repo }: { prNumber?: number; repo: Pick<RepositoryType, 'name' | 'path'> }) => void
  toBranch: ({ branch, repoId }: { branch: string; repoId?: string }) => string
}

export interface PullRequestPageProps extends Partial<RoutingProps> {
  usePullRequestListStore: () => PullRequestListStore
  useLabelsStore: () => ILabelsStore
  onFilterOpen?: (filter: keyof PRListFilters) => void
  repoId?: string
  spaceId?: string
  defaultSelectedAuthorError?: UsererrorError | null
  isPrincipalsLoading?: boolean
  prCandidateBranches?: TypesBranchTable[]
  principalsSearchQuery?: string
  defaultSelectedAuthor?: Partial<PrincipalType>
  currentUser?: Partial<PrincipalType>
  principalData?: Partial<PrincipalType>[]
  repository?: RepoRepositoryOutput
  setPrincipalsSearchQuery?: (query: string) => void
  onFilterChange?: (filterValues: PRListFilters) => void
  isLoading?: boolean
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  onLabelClick?: (labelId: number) => void
  scope: Scope
  toUpstreamRepo?: (path: string, subPath?: string) => string
}

export interface PullRequestListProps extends Partial<RoutingProps> {
  pullRequests?: PullRequest[]
  handleResetFilters?: () => void
  hasActiveFilters?: boolean
  query?: string
  openPRs?: number
  mergedPRs?: number
  closedPRs?: number
  repo?: RepoRepositoryOutput
  spaceId?: string
  headerFilter: Array<PRState>
  setHeaderFilter: (filter: Array<PRState>) => void
  onLabelClick?: (labelId: number) => void
  scope: Scope
  showScope?: boolean
  dirtyNoDataContent?: ReactNode
  isLoading?: boolean
  paginationProps?: StackedListPaginationProps
  toUpstreamRepo?: (path: string, subPath?: string) => string
}

export type PRListFilters = {
  created_by?: ComboBoxOptions
  created_lt?: Date
  created_gt?: Date
  label_by?: LabelsValue
  include_subspaces?: CheckboxOptions
  review_decision?: CheckboxOptions[]
  // reviewer_id?: string
}

export enum PRFilterGroupTogglerOptions {
  All = 'All',
  Created = 'Created',
  ReviewRequested = 'ReviewRequested'
}

export interface TextSelection {
  start: number
  end: number
}

export type HandleUploadType = (
  blob: File,
  setMarkdownContent: (data: string) => void,
  currentComment?: string,
  textSelection?: TextSelection
) => void
export type HandleAiPullRequestSummaryType = () => Promise<{ summary: string }>
