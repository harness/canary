export enum BranchSelectorTab {
  BRANCHES = 'branches',
  TAGS = 'tags'
}

export interface BranchSelectorBaseItem {
  name: string
}

interface BranchSelectorBaseListProps {
  viewAllUrl: string
}

export interface BranchSelectorBranchListProps extends BranchSelectorBaseListProps {
  items: BranchSelectorBranchProps[]
}

export interface BranchSelectorTagListProps extends BranchSelectorBaseListProps {
  items?: BranchSelectorBaseItem[]
}

export interface BranchSelectorBranchProps {
  id: number | string
  name: string
  sha: string
  timestamp: string
  default?: boolean
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
