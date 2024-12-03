import { FC } from 'react'

import { Button, DropdownMenu, DropdownMenuTrigger, Icon, Text } from '@/components'
import { BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore, TranslationStore } from '@/views'

import { BranchSelectorDropdown } from './branch-selector-dropdown'

interface BranchSelectorProps {
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  branchPrefix?: string
  buttonSize?: 'default' | 'sm'
  selectedBranch?: BranchSelectorListItem
  onSelectBranch?: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
}
export const BranchSelector: FC<BranchSelectorProps> = ({
  useRepoBranchesStore,
  useTranslationStore,
  branchPrefix,
  buttonSize = 'default',
  selectedBranch,
  onSelectBranch
}) => {
  const { selectedBranchTag, branchList, tagList, setSelectedBranchTag, setSelectedBranchType, repoId, spaceId } =
    useRepoBranchesStore()

  const isTag = selectedBranchTag
    ? tagList.some(tag => tag.name === selectedBranchTag.name && tag.sha === selectedBranchTag.sha)
    : false

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={
            'flex items-center gap-1.5 overflow-hidden px-3 data-[state=open]:border-borders-8 [&_svg]:data-[state=open]:text-foreground-1'
          }
          variant="outline"
          size={buttonSize}
        >
          {!branchPrefix && (
            <Icon className="shrink-0 fill-transparent text-icons-9" name={isTag ? 'tag' : 'branch'} size={12} />
          )}
          <Text className="w-full text-foreground-8" truncate align="left">
            {branchPrefix ? `${branchPrefix}: ${selectedBranchTag.name}` : selectedBranchTag.name}
          </Text>
          <Icon className="chevron-down text-icons-2" name="chevron-down" size={10} />
        </Button>
      </DropdownMenuTrigger>
      <BranchSelectorDropdown
        branchList={branchList}
        tagList={tagList}
        onSelectBranch={onSelectBranch}
        selectedBranch={selectedBranch || selectedBranchTag}
        setSelectedBranchTag={setSelectedBranchTag}
        setSelectedBranchType={setSelectedBranchType}
        repoId={repoId}
        spaceId={spaceId}
        useTranslationStore={useTranslationStore}
      />
    </DropdownMenu>
  )
}
