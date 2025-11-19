import { BranchSelectorListItem } from '@views/repo/repo.types'

import { TFunctionWithFallback } from '@harnessio/ui/context'

export enum BranchSelectorTab {
  BRANCHES = 'branches',
  TAGS = 'tags'
}

export const getBranchSelectorLabels = (t: TFunctionWithFallback) => ({
  [BranchSelectorTab.BRANCHES]: {
    label: t('views:repos.branches.title', 'Branches'),
    searchPlaceholder: t('views:repos.findBranch', 'Find a branch')
  },
  [BranchSelectorTab.TAGS]: {
    label: t('views:repos.tags', 'Tags'),
    searchPlaceholder: t('views:repos.findTag', 'Find a tag')
  }
})

export interface BranchSelectorDropdownProps {
  selectedBranch?: BranchSelectorListItem
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
  disabled?: boolean
}

export interface BranchSelectorProps extends BranchSelectorDropdownProps {
  size?: 'default' | 'sm'
  prefix?: string
  className?: string
}

export interface BranchSelectorContainerProps {
  selectedBranch?: BranchSelectorListItem
  onSelectBranchorTag: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  isBranchOnly?: boolean
  dynamicWidth?: boolean
  preSelectedTab?: BranchSelectorTab
  className?: string
  isUpdating?: boolean
  disabled?: boolean
  setCreateBranchDialogOpen?: (open: boolean) => void
  onBranchQueryChange?: (query: string) => void
}
