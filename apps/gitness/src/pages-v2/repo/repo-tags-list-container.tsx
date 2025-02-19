import { useEffect, useState } from 'react'

import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useListBranchesQuery,
  useListTagsQuery
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { CreateTagDialog, CreateTagFromFields, RepoTagsListView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useQueryState } from '../../framework/hooks/useQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useRepoBranchesStore } from './stores/repo-branches-store'
import { useRepoTagsStore } from './stores/repo-tags-store'
import { transformBranchList } from './transform-utils/branch-transform'

export const RepoTagsListContainer = () => {
  const repo_ref = useGetRepoRef()
  const { setTags, addTag, removeTag } = useRepoTagsStore()
  const { setBranchList, setDefaultBranch } = useRepoBranchesStore()
  const [query, setQuery] = useQueryState('query')

  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)
  const [deleteTagDialog, setDeleteTagDialog] = useState(false)
  const [deleteTagName, setDeleteTagName] = useState<string | null>(null)

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
      onSuccess: data => {
        setOpenCreateTagDialog(false)
        addTag(data.body)
      }
    }
  )

  const { mutate: deleteTag, isLoading: isDeletingTag } = useDeleteTagMutation(
    { repo_ref: repo_ref },
    {
      onSuccess: () => {
        setDeleteTagDialog(false)
        removeTag(deleteTagName ?? '')
      }
    }
  )

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
        onDeleteTag={(tagName: string) => {
          setDeleteTagDialog(true)
          setDeleteTagName(tagName)
        }}
        useRepoTagsStore={useRepoTagsStore}
      />
      <CreateTagDialog
        useTranslationStore={useTranslationStore}
        open={openCreateTagDialog}
        onClose={() => setOpenCreateTagDialog(false)}
        onSubmit={onSubmit}
        handleChangeSearchValue={() => {}}
        useRepoBranchesStore={useRepoBranchesStore}
        isLoading={isCreatingTag}
      />
      <DeleteAlertDialog
        open={deleteTagDialog}
        onClose={() => setDeleteTagDialog(false)}
        deleteFn={onDeleteTag}
        error={{ type: '', message: '' }}
        type="tag"
        identifier={deleteTagName ?? undefined}
        isLoading={isDeletingTag}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
