import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useFindRepositoryQuery, useListBranchesQuery, useListTagsQuery } from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, BranchSelectorV2 } from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { transformBranchList } from '../pages-v2/repo/transform-utils/branch-transform'
import { PathParams } from '../RouteDefinitions'
import { orderSortDate } from '../types'
import { useBranchSelectorStore } from './stores/branch-selector-store'

export const BranchSelectorContainer = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const [branchTagQuery, setBranchTagQuery] = useState<string | null>(null)
  // const [selectedBranchorTag, setSelectedBranchorTag] = useState<BranchSelectorListItem>()
  // const [branchList, setBranchList] = useState<BranchData[]>([])
  // const [tagList, setTagList] = useState<BranchSelectorListItem[]>([])

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  const {
    branchList,
    setBranchList,
    tagList,
    setTagList,
    selectedBranchOrTag,
    setSelectedBranchOrTag,
    setRefType,
    selectedRefType
  } = useBranchSelectorStore()

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
    if (repository) {
      const defaultBranch = branches?.find(branch => branch.name === repository.default_branch)
      setSelectedBranchOrTag({
        name: defaultBranch?.name ?? repository.default_branch ?? '',
        sha: defaultBranch?.sha ?? '',
        default: true
      })
    }
    setRefType(BranchSelectorTab.BRANCHES)
  }, [branches, repository, setSelectedBranchOrTag])

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

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        const branch = branchList.find(branch => branch.name === branchTagName.name)
        if (branch) {
          // setPage(1)
          setSelectedBranchOrTag(branch)
          setRefType(type)
        }
      } else if (type === BranchSelectorTab.TAGS) {
        const tag = tagList.find(tag => tag.name === branchTagName.name)
        if (tag) {
          setSelectedBranchOrTag(tag)
          setRefType(type)
        }
      }
    },
    [repoId, spaceId, branchList, tagList]
  )

  return (
    <BranchSelectorV2
      useTranslationStore={useTranslationStore}
      branchList={branchList}
      tagList={tagList}
      selectedBranchorTag={selectedBranchOrTag ?? { name: '', sha: '', default: false }}
      repoId={repoId ?? ''}
      spaceId={spaceId ?? ''}
      searchQuery={branchTagQuery ?? ''}
      setSearchQuery={setBranchTagQuery}
      onSelectBranch={selectBranchOrTag}
    />
  )
}
