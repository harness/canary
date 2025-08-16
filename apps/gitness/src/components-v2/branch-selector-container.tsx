import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useFindRepositoryQuery, useListBranchesQuery, useListTagsQuery } from '@harnessio/code-service-client'
import { BranchData, BranchSelectorListItem, BranchSelectorTab, BranchSelectorV2 } from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { transformBranchList } from '../pages-v2/repo/transform-utils/branch-transform'
import { PathParams } from '../RouteDefinitions'
import { orderSortDate } from '../types'

interface BranchSelectorContainerProps {
  selectedBranch?: BranchSelectorListItem
  onSelectBranchorTag: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  isBranchOnly?: boolean
  dynamicWidth?: boolean
  preSelectedTab?: BranchSelectorTab
  isFilesPage?: boolean
  setCreateBranchDialogOpen?: (open: boolean) => void
  onBranchQueryChange?: (query: string) => void
  className?: string
  branchPrefix?: string
  isUpdating?: boolean
  disabled?: boolean
  autoSelectDefaultBranch?: boolean
}
export const BranchSelectorContainer: React.FC<BranchSelectorContainerProps> = ({
  selectedBranch,
  onSelectBranchorTag,
  isBranchOnly = false,
  dynamicWidth = false,
  preSelectedTab,
  setCreateBranchDialogOpen,
  isFilesPage = false,
  onBranchQueryChange,
  branchPrefix,
  className,
  isUpdating,
  disabled,
  autoSelectDefaultBranch = true
}) => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const [branchTagQuery, setBranchTagQuery] = useState<string | null>(null)
  const [branchList, setBranchList] = useState<BranchData[]>([])
  const [tagList, setTagList] = useState<BranchSelectorListItem[]>([])

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: branches } = {}, refetch: refetchBranches } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: orderSortDate.DESC,
      limit: 30,
      query: branchTagQuery ?? ''
    }
  })

  const { data: { body: tags } = {} } = useListTagsQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: orderSortDate.DESC,
      limit: 30,
      page: 1,
      query: branchTagQuery ?? ''
    }
  })

  useEffect(() => {
    // Only auto-select default branch if no branch is currently selected
    // This prevents the flakiness when the form is being updated
    if (repository && !selectedBranch?.name && !isUpdating && autoSelectDefaultBranch) {
      const defaultBranch = branches?.find(branch => branch.name === repository.default_branch)

      onSelectBranchorTag(
        { name: defaultBranch?.name ?? repository.default_branch ?? '', sha: defaultBranch?.sha ?? '', default: true },
        BranchSelectorTab.BRANCHES
      )
    }
  }, [repository, selectedBranch?.name, branches, onSelectBranchorTag, isUpdating, autoSelectDefaultBranch])

  useEffect(() => {
    refetchBranches()
  }, [refetchBranches])

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches, repository?.default_branch))
    }
  }, [branches, repository?.default_branch, setBranchList, selectedBranch])

  useEffect(() => {
    if (tags) {
      setTagList(
        tags.map(item => ({
          name: item?.name || '',
          sha: item?.sha || '',
          default: false
        }))
      )
    }
  }, [setTagList, tags])

  useEffect(() => {
    onBranchQueryChange?.(branchTagQuery ?? '')
  }, [branchTagQuery, onBranchQueryChange])

  return (
    <BranchSelectorV2
      className={className}
      branchList={branchList}
      tagList={tagList}
      selectedBranchorTag={selectedBranch}
      repoId={repoId ?? ''}
      spaceId={spaceId ?? ''}
      searchQuery={branchTagQuery ?? ''}
      setSearchQuery={setBranchTagQuery}
      onSelectBranch={onSelectBranchorTag}
      isBranchOnly={isBranchOnly}
      dynamicWidth={dynamicWidth}
      preSelectedTab={preSelectedTab}
      isFilesPage={isFilesPage}
      setCreateBranchDialogOpen={setCreateBranchDialogOpen}
      branchPrefix={branchPrefix}
      disabled={disabled}
    />
  )
}
