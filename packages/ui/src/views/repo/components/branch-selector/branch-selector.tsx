import { FC } from 'react'

import { Button, DropdownMenu, Icon } from '@/components'
import { BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore, TranslationStore } from '@/views'

import { BranchSelectorDropdown } from './branch-selector-dropdown'

interface BranchSelectorProps {
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  branchPrefix?: string
  buttonSize?: 'default' | 'sm' | 'md'
  selectedBranch?: BranchSelectorListItem
  onSelectBranch: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  isBranchOnly?: boolean
  searchQuery?: string
  setSearchQuery: (query: string) => void
  dynamicWidth?: boolean
}
export const BranchSelector: FC<BranchSelectorProps> = ({
  useRepoBranchesStore,
  useTranslationStore,
  branchPrefix,
  buttonSize = 'default',
  selectedBranch,
  onSelectBranch,
  isBranchOnly = false,
  searchQuery = '',
  setSearchQuery,
  dynamicWidth = false
}) => {
  const { selectedBranchTag, branchList, tagList, repoId, spaceId } = useRepoBranchesStore()

  const isTag = selectedBranchTag
    ? tagList?.some(tag => tag.name === selectedBranchTag.name && tag.sha === selectedBranchTag.sha)
    : false

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          className="flex items-center gap-1.5 overflow-hidden bg-input-background px-3 data-[state=open]:border-borders-9"
          variant="outline"
          size={buttonSize}
        >
          {!branchPrefix && (
            <Icon className="shrink-0 fill-transparent text-icons-9" name={isTag ? 'tag' : 'branch'} size={14} />
          )}
          <span className="w-full truncate text-left text-foreground-8">
            {branchPrefix
              ? `${branchPrefix}: ${selectedBranch?.name || selectedBranchTag.name}`
              : selectedBranch?.name || selectedBranchTag.name}
          </span>
          <Icon name="chevron-down" className="chevron-down shrink-0 text-icons-2" size={12} />
        </Button>
      </DropdownMenu.Trigger>
      <BranchSelectorDropdown
        isBranchOnly={isBranchOnly}
        branchList={branchList}
        tagList={tagList}
        onSelectBranch={onSelectBranch}
        selectedBranch={selectedBranch || selectedBranchTag}
        repoId={repoId}
        spaceId={spaceId}
        useTranslationStore={useTranslationStore}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dynamicWidth={dynamicWidth}
      />
    </DropdownMenu.Root>
  )
}
