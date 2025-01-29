import { TranslationStore } from '@/views'
import { BranchSelectorListItem } from '@views/repo/repo.types'
import { TFunction } from 'i18next'

export enum BranchSelectorTab {
  BRANCHES = 'branches',
  TAGS = 'tags'
}

export const getBranchSelectorLabels = (t: TFunction) => ({
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
  useTranslationStore: () => TranslationStore
  isBranchOnly?: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export interface BranchSelectorProps extends BranchSelectorDropdownProps {
  size?: 'default' | 'sm'
  prefix?: string
  className?: string
  useTranslationStore: () => TranslationStore
}
