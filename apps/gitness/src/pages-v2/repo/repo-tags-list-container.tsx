import { useEffect, useState } from 'react'

import { use } from 'i18next'

import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useListBranchesQuery,
  useListTagsQuery
} from '@harnessio/code-service-client'
import { CreateTagDialog, CreateTagFromFields, RepoTagsListView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useQueryState } from '../../framework/hooks/useQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useRepoBranchesStore } from './stores/repo-branches-store'
import { useRepoTagsStore } from './stores/repo-tags-store'
import { transformBranchList } from './transform-utils/branch-transform'

export const RepoTagsListContainer = () => {
  const repo_ref = useGetRepoRef()
  const { setTags } = useRepoTagsStore()
  const { setBranchList, setDefaultBranch } = useRepoBranchesStore()
  const [query, setQuery] = useQueryState('query')

  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)

  const { data: { body: tagsList } = {}, isLoading: isLoadingTags } = useListTagsQuery({
    repo_ref: repo_ref,
    queryParams: {
      query: query ?? '',
      include_commit: true
    }
  })

  const { isLoading: isLoadingBranches, data: { body: branches } = {} } = useListBranchesQuery({
    queryParams: {
      limit: 50,
      //   query: query ?? '',
      //   order: orderSortDate.DESC,
      include_commit: true,
      include_pullreqs: true
    },
    repo_ref: repo_ref
  })

  const { mutate: createTag, isLoading: isCreatingTag } = useCreateTagMutation(
    { repo_ref: repo_ref },
    {
      onSuccess: () => {
        setOpenCreateTagDialog(false)
      }
    }
  )

  const { mutate: deleteTag } = useDeleteTagMutation({ repo_ref: repo_ref })

  useEffect(() => {
    if (tagsList) {
      setTags(tagsList)
    }
  }, [tagsList, setTags])

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches))
    }
  }, [branches, setBranchList])

  const onSubmit = (data: CreateTagFromFields) => {
    createTag({
      body: {
        ...data
      }
    })
  }

  const onDeleteTag = (tagName: string) => {
    deleteTag({
      tag_name: tagName,
      queryParams: {}
    })
  }
  return (
    <>
      <RepoTagsListView
        useTranslationStore={useTranslationStore}
        isLoading={isLoadingTags}
        openCreateBranchDialog={() => setOpenCreateTagDialog(true)}
        searchQuery={query}
        setSearchQuery={setQuery}
        onDeleteTag={onDeleteTag}
        useRdpoTagsStore={useRepoTagsStore}
      />
      <CreateTagDialog
        useTranslationStore={useTranslationStore}
        open={openCreateTagDialog}
        onClose={() => setOpenCreateTagDialog(false)}
        onSubmit={onSubmit}
        handleChangeSearchValue={() => {}}
        branches={branches}
        isLoading={isCreatingTag}
      />
    </>
  )
}
