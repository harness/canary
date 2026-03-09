import { TFunctionWithFallback } from '@harnessio/ui/context'
import { BranchSelectorTab } from '@harnessio/ui/types'
import { BranchSelectorListItem } from '@views/repo/repo.types'

// Re-export from UI types for backward compatibility
export { BranchSelectorTab } from '@harnessio/ui/types'

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
  selectorTitle?: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  dynamicWidth?: boolean
  preSelectedTab?: BranchSelectorTab
  setCreateBranchDialogOpen?: (open: boolean) => void
  disabled?: boolean
  hideViewAllLink?: boolean
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
