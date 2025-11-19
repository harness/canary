import { forwardRef, useState } from 'react'

import { BranchData, BranchSelectorListItem, BranchSelectorTab } from '@/views'

import { Button, IconV2, Popover, Text, type ButtonSizes } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

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
  preventCloseOnSelect?: boolean
}
export const BranchSelectorV2 = forwardRef<HTMLButtonElement, BranchSelectorProps>(
  (
    {
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
      disabled,
      preventCloseOnSelect = false
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const isTag = selectedBranchorTag
      ? tagList?.some(tag => tag.name === selectedBranchorTag.name && tag.sha === selectedBranchorTag.sha)
      : false

    const handleSelectBranch = (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => {
      onSelectBranch(branchTag, type)
      if (!preventCloseOnSelect) {
        setOpen(false)
      }
    }

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger ref={ref} asChild>
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
          onSelectBranch={handleSelectBranch}
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
)

BranchSelectorV2.displayName = 'BranchSelectorV2'
