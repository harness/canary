import { TranslationStore } from '../repo-list/types'

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
  useTranslationStore: () => TranslationStore
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}

export enum PULL_REQUEST_LIST_HEADER_FILTER_STATES {
  OPEN = 'open',
  CLOSED = 'closed'
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
  state?: string
  updated: number
  labels?: {
    text: string
    color: string
  }[]
}

export type IconType = 'pr-open' | 'pr-closed' | 'pr-draft' | 'pr-merge'

export interface PullRequestListStore {
  pullRequests: PullRequestType[] | null
  totalPages: number
  page: number
  setPage: (page: number) => void
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

export type EnumRepoState = number

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

export interface TypesPrincipalInfo {
  created?: number
  display_name?: string
  email?: string
  id?: number
  type?: EnumPrincipalType
  uid?: string
  updated?: number
}

export type EnumPrincipalType = 'service' | 'serviceaccount' | 'user'

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
