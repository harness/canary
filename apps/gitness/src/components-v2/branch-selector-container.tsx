import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useFindRepositoryQuery, useListBranchesQuery, useListTagsQuery } from '@harnessio/code-service-client'
import { BranchData, BranchSelectorListItem, BranchSelectorTab, BranchSelectorV2 } from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { transformBranchList } from '../pages-v2/repo/transform-utils/branch-transform'
import { PathParams } from '../RouteDefinitions'
import { orderSortDate } from '../types'

// import { useBranchSelectorStore } from './stores/branch-selector-store'
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
  // const [selectedBranchOrTag, setSelectedBranchOrTag] = useState<BranchSelectorListItem>({
  //   name: selectedBranch ?? '',
  //   sha: '',
  //   default: true
  // })
  const [branchList, setBranchList] = useState<BranchData[]>([])
  const [tagList, setTagList] = useState<BranchSelectorListItem[]>([])
  const [refType, setRefType] = useState<BranchSelectorTab>(BranchSelectorTab.BRANCHES)
  // const {
  //   branchList,
  //   setBranchList,
  //   tagList,
  //   setTagList,
  //   selectedBranchOrTag,
  //   setSelectedBranchOrTag,
  //   setRefType
  //   // selectedRefType
  // } = useBranchSelectorStore()

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
    // console.log(selectedBranchOrTag)
    if (repository && !selectedBranch) {
      console.log('yeah this right here')
      const defaultBranch = branches?.find(branch => branch.name === repository.default_branch)
      // setSelectedBranchOrTag({
      //   name: defaultBranch?.name ?? repository.default_branch ?? '',
      //   sha: defaultBranch?.sha ?? '',
      //   default: true
      // })
      onSelectBranchorTag(
        { name: defaultBranch?.name ?? repository.default_branch ?? '', sha: defaultBranch?.sha ?? '', default: true },
        BranchSelectorTab.BRANCHES
      )
    }
    setRefType(BranchSelectorTab.BRANCHES)
  }, [branches, repository, setRefType])

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

  // const selectBranchOrTag = useCallback(
  //   (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
  //     if (type === BranchSelectorTab.BRANCHES) {
  //       // const branch = branchList.find(branch => branch.name === branchTagName.name)
  //       // if (branch) {
  //       // setPage(1)
  //       // console.log('selectBranchOrTag', branchTagName, type)

  //       setSelectedBranchOrTag(branchTagName)
  //       setRefType(type)
  //       // }
  //     } else if (type === BranchSelectorTab.TAGS) {
  //       // const tag = tagList.find(tag => tag.name === branchTagName.name)
  //       // if (tag) {
  //       setSelectedBranchOrTag(branchTagName)
  //       setRefType(type)
  //       // }
  //     }
  //   },
  //   [repoId, spaceId, setRefType, setSelectedBranchOrTag, branchList, tagList]
  // )

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
