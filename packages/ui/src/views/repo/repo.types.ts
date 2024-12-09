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

interface BranchData {
  id: number
  name: string
  sha: string
  timestamp: string
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
  ahead: number
  behind: number
}
export interface IBranchSelectorStore {
  // states
  selectedBranchTag: BranchSelectorListItem
  selectedBranchType: BranchSelectorTab
  branchList: BranchData[]
  tagList: BranchSelectorListItem[]
  spaceId: string
  repoId: string
  defaultBranch: string
  branchDivergence: CommitDivergenceType[]

  //actions
  setSelectedBranchTag: (selectedBranchTag: BranchSelectorListItem) => void

  setSelectedBranchType: (selectedBranchType: BranchSelectorTab) => void

  setBranchList: (branchList?: BranchData[]) => void

  setTagList: (tagList: BranchSelectorListItem[]) => void

  setSpaceIdAndRepoId: (spaceId: string, repoId: string) => void
}
