export type CommitDivergenceType = {
  ahead: number
  behind: number
}

export interface BranchData {
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

export interface BranchStore {
  // State
  branches: BranchData[]
  defaultBranch: string
  branchDivergence: CommitDivergenceType[]
}
