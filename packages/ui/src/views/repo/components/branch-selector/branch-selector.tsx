import { FC } from 'react'

import { Button, ButtonSizes, DropdownMenu, Icon } from '@/components'
import { BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore, TranslationStore } from '@/views'

import { BranchSelectorDropdown } from './branch-selector-dropdown'

interface BranchSelectorProps {
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  branchPrefix?: string
  buttonSize?: ButtonSizes
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
  buttonSize,
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

  const branchName = selectedBranch?.name || selectedBranchTag?.name

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size={buttonSize}>
          {!branchPrefix && <Icon className="shrink-0 fill-transparent" name={isTag ? 'tag' : 'branch'} size={14} />}

          <span className="w-full truncate text-left">
            {branchPrefix ? `${branchPrefix}: ${branchName}` : branchName}
          </span>

          <Icon name="chevron-down" className="chevron-down" size={12} />
        </Button>
      </DropdownMenu.Trigger>

      <BranchSelectorDropdown
        isBranchOnly={isBranchOnly}
        branchList={branchList}
        tagList={tagList}
        onSelectBranch={onSelectBranch}
        selectedBranch={selectedBranch || selectedBranchTag || { name: '', sha: '' }}
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
