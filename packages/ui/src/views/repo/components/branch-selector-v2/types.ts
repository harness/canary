import { TFunctionWithFallback } from '@/context'
import { BranchSelectorListItem } from '@views/repo/repo.types'

export enum BranchSelectorTab {
  BRANCHES = 'branches',
  TAGS = 'tags'
}

export const getBranchSelectorLabels = (t: TFunctionWithFallback) => ({
  [BranchSelectorTab.BRANCHES]: {
    label: t('views:repos.branches', 'Branches'),
    searchPlaceholder: t('views:repos.findBranch', 'Find a branch')
  },
  [BranchSelectorTab.TAGS]: {
    label: t('views:repos.tags', 'Tags'),
    searchPlaceholder: t('views:repos.findTag', 'Find a tag')
  }
})

export interface BranchSelectorDropdownProps {
  selectedBranch: BranchSelectorListItem
  branchList: BranchSelectorListItem[]
  tagList: BranchSelectorListItem[]
  onSelectBranch?: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  repoId: string
  spaceId: string
  isBranchOnly?: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  dynamicWidth?: boolean
  preSelectedTab?: BranchSelectorTab
  setCreateBranchDialogOpen?: (open: boolean) => void
  isFilesPage?: boolean
}

export interface BranchSelectorProps extends BranchSelectorDropdownProps {
  size?: 'default' | 'sm'
  prefix?: string
  className?: string
}

export interface BranchSelectorContainerProps {
  selectedBranch?: BranchSelectorListItem | null
  onSelectBranchorTag: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  isBranchOnly?: boolean
  dynamicWidth?: boolean
  preSelectedTab?: BranchSelectorTab
}
