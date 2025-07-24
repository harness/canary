import { PrincipalType, UsererrorError } from '@/types'
import { ColorsEnum, ILabelsStore, LabelType, TypesBranchTable } from '@/views'
import { ComboBoxOption } from '@components/filters/filters-bar/actions/variants/combo-box'

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

export enum PULL_REQUEST_LIST_HEADER_FILTER_STATES {
  OPEN = 'open',
  CLOSED = 'closed'
}

export interface PullRequest extends PullRequestType {
  repoId?: string
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
}

export type IconType = 'git-pull-request-draft' | 'git-pull-request-closed' | 'git-merge' | 'git-pull-request'

export interface PullRequestListStore {
  pullRequests: PullRequest[] | null
  totalItems: number
  pageSize: number
  page: number
  setPage: (page: number) => void
  setLabelsQuery: (query: string) => void
  openPullReqs: number
  closedPullReqs: number
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
  source_repo_id?: number
  source_sha?: string
  state?: EnumPullReqState
  stats?: TypesPullReqStats
  target_branch?: string
  target_repo_id?: number
  title?: string
  labels?: TypesLabelPullReqAssignmentInfo[]
  updated?: number
}

export type EnumMergeMethod = 'fast-forward' | 'merge' | 'rebase' | 'squash'

export type EnumPullReqState = 'closed' | 'merged' | 'open'

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
  reviewer: { display_name: string; id: number }
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
}

interface RoutingProps {
  toPullRequest: ({ prNumber, repoId }: { prNumber: number; repoId?: string }) => string
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
  principalData?: Partial<PrincipalType>[]
  repository?: RepoRepositoryOutput
  setPrincipalsSearchQuery?: (query: string) => void
  onFilterChange?: (filterValues: PRListFilters) => void
  isLoading?: boolean
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
  onLabelClick?: (labelId: number) => void
}

export interface PullRequestListProps extends Partial<RoutingProps> {
  pullRequests?: PullRequest[]
  handleResetFilters?: () => void
  hasActiveFilters?: boolean
  query?: string
  openPRs?: number
  handleOpenClick?: () => void
  closedPRs?: number
  handleCloseClick?: () => void
  repoId?: string
  spaceId?: string
  headerFilter: PULL_REQUEST_LIST_HEADER_FILTER_STATES
  setHeaderFilter: (filter: PULL_REQUEST_LIST_HEADER_FILTER_STATES) => void
  onLabelClick?: (labelId: number) => void
}

export type PRListFilters = {
  created_by?: ComboBoxOption
  created_lt?: Date
  created_gt?: Date
  label_by?: LabelsValue
}

export type HandleUploadType = (blob: File, setMarkdownContent: (data: string) => void, currentComment?: string) => void
