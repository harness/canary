import { FC } from 'react'

import { Button, DropdownMenu, IconV2, Text, type ButtonSizes } from '@/components'
import { BranchData, BranchSelectorListItem, BranchSelectorTab } from '@/views'

import { BranchSelectorDropdown } from './branch-selector-dropdown'

interface BranchSelectorProps {
  branchList: BranchData[]
  tagList: BranchSelectorListItem[]
  selectedBranchorTag: BranchSelectorListItem
  repoId: string
  spaceId: string
  branchPrefix?: string
  hideIcon?: boolean
  buttonSize?: ButtonSizes
  selectedBranch?: BranchSelectorListItem
  onSelectBranch: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  isBranchOnly?: boolean
  searchQuery?: string
  setSearchQuery: (query: string) => void
  dynamicWidth?: boolean
  preSelectedTab?: BranchSelectorTab
  isFilesPage?: boolean
  setCreateBranchDialogOpen?: (open: boolean) => void
  className?: string
}
export const BranchSelectorV2: FC<BranchSelectorProps> = ({
  repoId,
  spaceId,
  branchList,
  tagList,
  selectedBranchorTag,
  branchPrefix,
  hideIcon = false,
  buttonSize = 'md',
  selectedBranch,
  onSelectBranch,
  isBranchOnly = false,
  searchQuery = '',
  setSearchQuery,
  dynamicWidth = false,
  preSelectedTab,
  isFilesPage = false,
  setCreateBranchDialogOpen,
  className
}) => {
  const isTag = selectedBranchorTag
    ? tagList?.some(tag => tag.name === selectedBranchorTag.name && tag.sha === selectedBranchorTag.sha)
    : false

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className={className} variant="outline" size={buttonSize}>
          {!hideIcon && <IconV2 name={isTag ? 'tag' : 'git-branch'} size="sm" />}
          <Text className="truncate">
            {branchPrefix
              ? `${branchPrefix}: ${selectedBranch?.name || selectedBranchorTag.name}`
              : selectedBranch?.name || selectedBranchorTag.name}
          </Text>
          <IconV2 name="nav-arrow-down" size="xs" className="ml-auto" />
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dynamicWidth={dynamicWidth}
        preSelectedTab={preSelectedTab}
        isFilesPage={isFilesPage}
        setCreateBranchDialogOpen={setCreateBranchDialogOpen}
      />
    </DropdownMenu.Root>
  )
}
