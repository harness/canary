import { FC } from 'react'

import { Button, DropdownMenu, Icon } from '@/components'
import { BranchData, BranchSelectorListItem, BranchSelectorTab, TranslationStore } from '@/views'

import { BranchSelectorDropdown } from './branch-selector-dropdown'

interface BranchSelectorProps {
  branchList: BranchData[]
  tagList: BranchSelectorListItem[]
  selectedBranchorTag: BranchSelectorListItem
  repoId: string
  spaceId: string
  useTranslationStore: () => TranslationStore
  branchPrefix?: string
  buttonSize?: 'default' | 'sm' | 'md'
  selectedBranch?: BranchSelectorListItem
  onSelectBranch: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  isBranchOnly?: boolean
  searchQuery?: string
  setSearchQuery: (query: string) => void
  dynamicWidth?: boolean
  preSelectedTab?: BranchSelectorTab
}
export const BranchSelectorV2: FC<BranchSelectorProps> = ({
  repoId,
  spaceId,
  branchList,
  tagList,
  selectedBranchorTag,
  useTranslationStore,
  branchPrefix,
  buttonSize = 'default',
  selectedBranch,
  onSelectBranch,
  isBranchOnly = false,
  searchQuery = '',
  setSearchQuery,
  dynamicWidth = false,
  preSelectedTab
}) => {
  const isTag = selectedBranchorTag
    ? tagList?.some(tag => tag.name === selectedBranchorTag.name && tag.sha === selectedBranchorTag.sha)
    : false

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          className="data-[state=open]:border-cn-borders-9 bg-cn-background-2 flex items-center gap-1.5 overflow-hidden px-3"
          variant="outline"
          size={buttonSize}
        >
          {!branchPrefix && (
            <Icon className="text-icons-9 shrink-0 fill-transparent" name={isTag ? 'tag' : 'branch'} size={14} />
          )}
          <span className="text-cn-foreground-1 w-full truncate text-left">
            {branchPrefix
              ? `${branchPrefix}: ${selectedBranch?.name || selectedBranchorTag.name}`
              : selectedBranch?.name || selectedBranchorTag.name}
          </span>
          <Icon name="chevron-down" className="chevron-down text-icons-2 shrink-0" size={12} />
        </Button>
      </DropdownMenu.Trigger>
      <BranchSelectorDropdown
        isBranchOnly={isBranchOnly}
        branchList={branchList}
        tagList={tagList}
        onSelectBranch={onSelectBranch}
        selectedBranch={selectedBranch || selectedBranchorTag}
        repoId={repoId}
        spaceId={spaceId}
        useTranslationStore={useTranslationStore}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dynamicWidth={dynamicWidth}
        preSelectedTab={preSelectedTab}
      />
    </DropdownMenu.Root>
  )
}
