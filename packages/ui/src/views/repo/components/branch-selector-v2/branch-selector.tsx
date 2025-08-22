import { FC } from 'react'

import { Button, IconV2, Popover, Text, type ButtonSizes } from '@/components'
import { BranchData, BranchSelectorListItem, BranchSelectorTab } from '@/views'
import { cn } from '@utils/cn'

import { BranchSelectorDropdown } from './branch-selector-dropdown'

interface BranchSelectorProps {
  branchList: BranchData[]
  tagList: BranchSelectorListItem[]
  selectedBranchorTag?: BranchSelectorListItem
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
  setCreateBranchDialogOpen?: (open: boolean) => void
  className?: string
  disabled?: boolean
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
  setCreateBranchDialogOpen,
  className,
  disabled
}) => {
  const isTag = selectedBranchorTag
    ? tagList?.some(tag => tag.name === selectedBranchorTag.name && tag.sha === selectedBranchorTag.sha)
    : false

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button className={cn('min-w-0', className)} variant="outline" size={buttonSize} disabled={disabled}>
          {!hideIcon && <IconV2 name={isTag ? 'tag' : 'git-branch'} size="sm" />}
          {selectedBranch || selectedBranchorTag ? (
            <Text className="truncate">
              {branchPrefix
                ? `${branchPrefix}: ${selectedBranch?.name || selectedBranchorTag?.name}`
                : selectedBranch?.name || selectedBranchorTag?.name}
            </Text>
          ) : (
            <Text className="truncate">Select a branch or tag</Text>
          )}
          <IconV2 name="nav-arrow-down" size="xs" className="ml-auto" />
        </Button>
      </Popover.Trigger>
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
        setCreateBranchDialogOpen={setCreateBranchDialogOpen}
        disabled={disabled}
      />
    </Popover.Root>
  )
}
