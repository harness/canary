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

export type LatestFileTypes = Pick<RepoFile, 'user' | 'lastCommitMessage' | 'timestamp' | 'sha'>

export interface IBranchSelectorStore {
  // selectedBranch?: BranchSelectorListItem
  // setSelectedBranch: (selectedBranch?: BranchSelectorListItem) => void

  selectedBranchTag: BranchSelectorListItem
  setSelectedBranchTag: (selectedBranchTag: BranchSelectorListItem) => void

  selectedBranchType: BranchSelectorTab
  setSelectedBranchType: (selectedBranchType: BranchSelectorTab) => void

  branchList: BranchSelectorListItem[]
  setBranchList: (branchList?: BranchSelectorListItem[]) => void

  tagList: BranchSelectorListItem[]
  setTagList: (tagList: BranchSelectorListItem[]) => void

  repoId: string
  setRepoId: (repoId: string) => void

  spaceId: string
  setSpaceId: (spaceId: string) => void
}
