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
}

export type LatestFileTypes = Pick<RepoFile, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'>

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
