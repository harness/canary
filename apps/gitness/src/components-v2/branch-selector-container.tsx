import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useFindRepositoryQuery, useListBranchesQuery, useListTagsQuery } from '@harnessio/code-service-client'
import { BranchData, BranchSelectorListItem, BranchSelectorTab, BranchSelectorV2 } from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { transformBranchList } from '../pages-v2/repo/transform-utils/branch-transform'
import { PathParams } from '../RouteDefinitions'
import { orderSortDate } from '../types'

interface BranchSelectorContainerProps {
  selectedBranch?: BranchSelectorListItem | null
  onSelectBranchorTag: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  isBranchOnly?: boolean
  dynamicWidth?: boolean
}
export const BranchSelectorContainer: React.FC<BranchSelectorContainerProps> = ({
  selectedBranch,
  onSelectBranchorTag,
  isBranchOnly = false,
  dynamicWidth = false
}) => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const [branchTagQuery, setBranchTagQuery] = useState<string | null>(null)
  const [branchList, setBranchList] = useState<BranchData[]>([])
  const [tagList, setTagList] = useState<BranchSelectorListItem[]>([])
  // const [_refType, setRefType] = useState<BranchSelectorTab>(BranchSelectorTab.BRANCHES)

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: branches } = {} } = useListBranchesQuery({
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
    if (repository && !selectedBranch) {
      const defaultBranch = branches?.find(branch => branch.name === repository.default_branch)

      onSelectBranchorTag(
        { name: defaultBranch?.name ?? repository.default_branch ?? '', sha: defaultBranch?.sha ?? '', default: true },
        BranchSelectorTab.BRANCHES
      )
    }
    // setRefType(BranchSelectorTab.BRANCHES)
  }, [branches, repository])

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches, repository?.default_branch))
    }
  }, [branches, repository?.default_branch, setBranchList])

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

  return (
    <BranchSelectorV2
      useTranslationStore={useTranslationStore}
      branchList={branchList}
      tagList={tagList}
      selectedBranchorTag={selectedBranch ?? { name: '', sha: '', default: false }}
      repoId={repoId ?? ''}
      spaceId={spaceId ?? ''}
      searchQuery={branchTagQuery ?? ''}
      setSearchQuery={setBranchTagQuery}
      onSelectBranch={onSelectBranchorTag}
      isBranchOnly={isBranchOnly}
      dynamicWidth={dynamicWidth}
    />
  )
}
