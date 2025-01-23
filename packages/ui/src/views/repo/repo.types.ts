import { PullRequestType } from '@/views'

import { BranchSelectorTab } from './components/branch-selector/types'

export interface BranchSelectorListItem {
  name: string
  sha: string
  default?: boolean
}

export interface Branch {
  id: number | string
  name: string
  sha: string
  timestamp: string
  user: {
    name: string
    avatarUrl?: string
  }
  checks: {
    done?: number
    total?: number
    status?: number
  }
  behindAhead: {
    behind?: number
    ahead?: number
    default?: boolean
  }
}

export enum SummaryItemType {
  Folder,
  File
}

export interface User {
  name: string
  avatarUrl?: string
}

export interface RepoFile {
  id: string
  type: SummaryItemType
  name: string
  lastCommitMessage: string
  timestamp: string
  user?: User
  sha?: string
  path: string
  toCommitDetails?: ({ sha }: { sha: string }) => string
}

export interface RepositoryType {
  id: number
  name: string
  description?: string
  private: boolean
  stars: number
  forks: number
  pulls: number
  createdAt: number
  timestamp: string
  importing?: boolean
}

export interface BranchData {
  id: number
  name: string
  sha: string
  timestamp: string
  default: boolean
  user: {
    name: string
    avatarUrl: string
  }
  behindAhead: {
    behind: number
    ahead: number
    default: boolean
  }
  pullRequests?: PullRequestType[]
  checks?: {
    done?: number
    total?: number
    status: {
      failure: number
      error: number
      pending: number
      running: number
      success: number
    }
  }
}

export type LatestFileTypes = Pick<RepoFile, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha' | 'toCommitDetails'>

export type CommitDivergenceType = {
  ahead?: number
  behind?: number
}

export interface IBranchSelectorStore {
  // states
  selectedBranchTag: BranchSelectorListItem
  selectedRefType: BranchSelectorTab
  branchList: BranchData[]
  tagList: BranchSelectorListItem[]
  spaceId: string
  repoId: string
  defaultBranch: string
  xNextPage: number
  xPrevPage: number
  page: number

  //actions
  setSelectedBranchTag: (selectedBranchTag: BranchSelectorListItem) => void
  setSelectedRefType: (selectedRefType: BranchSelectorTab) => void
  setTagList: (tagList: BranchSelectorListItem[]) => void
  setSpaceIdAndRepoId: (spaceId: string, repoId: string) => void
  setBranchList: (branches: BranchData[]) => void
  setDefaultBranch: (branch: string) => void
  setPage: (page: number) => void
  setPaginationFromHeaders: (xNextPage: number, xPrevPage: number) => void
}

export enum CodeModes {
  EDIT = 'edit',
  NEW = 'new',
  VIEW = 'view'
}

export interface TypesChangeStats {
  changes?: number
  deletions?: number
  insertions?: number
}

export interface TypesSignature {
  identity?: TypesIdentity
  when?: string
}

export interface TypesIdentity {
  email?: string
  name?: string
}

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

export interface TypesCommitFileStats {
  changes?: number
  deletions?: number
  insertions?: number
  old_path?: string
  path?: string
  status?: string
}
