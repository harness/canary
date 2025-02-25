import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useFindRepositoryQuery, useListBranchesQuery, useListTagsQuery } from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorV2 } from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../i18n/stores/i18n-store'
import { PathParams } from '../RouteDefinitions'
import { orderSortDate } from '../types'

export const BranchSelectorContainer = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const [branchTagQuery, setBranchTagQuery] = useState<string | null>(null)
  const [selectedBranchorTag, setSelectedBranchorTag] = useState<BranchSelectorListItem | null>(null)

  const { data: { body: repository } = {}, refetch: refetchRepo } = useFindRepositoryQuery({ repo_ref: repoRef })

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
      setSelectedBranchorTag({
        name: defaultBranch?.name ?? repository.default_branch ?? '',
        sha: defaultBranch?.sha ?? '',
        default: true
      })
    }
  }, [branches, repository])

  return (
    <BranchSelectorV2
      useTranslationStore={useTranslationStore}
      branchList={branches}
      tagList={tags}
      selectedBranchorTag={selectedBranchorTag}
      repoId={repoId ?? ''}
      spaceId={spaceId ?? ''}
      searchQuery={branchTagQuery ?? ''}
      setSearchQuery={setBranchTagQuery}
      onSelectBranch={(branchTag, _type) => {
        setSelectedBranchorTag(branchTag)
        setBranchTagQuery('')
      }}
    />
  )
}
