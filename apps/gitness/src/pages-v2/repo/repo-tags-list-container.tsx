import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  useCreateBranchMutation,
  useCreateTagMutation,
  useDeleteTagMutation,
  useFindRepositoryQuery,
  useListBranchesQuery,
  useListTagsQuery
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import {
  CommitTagType,
  CreateBranchDialog,
  CreateBranchFormFields,
  CreateTagDialog,
  CreateTagFromFields,
  RepoTagsListView
} from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { PageResponseHeader } from '../../types'
import { useRepoBranchesStore } from './stores/repo-branches-store'
import { useRepoTagsStore } from './stores/repo-tags-store'
import { transformBranchList } from './transform-utils/branch-transform'

export const RepoTagsListContainer = () => {
  const repo_ref = useGetRepoRef()
  const { setTags, addTag, removeTag, page, setPage, setPaginationFromHeaders } = useRepoTagsStore()
  const { setBranchList, setDefaultBranch, setSelectedBranchTag, branchList } = useRepoBranchesStore()
  const { spaceId, repoId } = useParams<PathParams>()

  const routes = useRoutes()
  const [query, setQuery] = useQueryState('query')
  const [branchQuery, setBranchQuery] = useState('')

  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)
  const [openCreateBranchDialog, setOpenCreateBranchDialog] = useState(false)
  const [deleteTagDialog, setDeleteTagDialog] = useState(false)
  const [deleteTagName, setDeleteTagName] = useState<string | null>(null)

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repo_ref })

  const { data: { body: tagsList, headers } = {}, isLoading: isLoadingTags } = useListTagsQuery({
    repo_ref: repo_ref,
    queryParams: {
      query: query ?? '',
      page: queryPage,
      limit: 10
    }
  })

  const { data: { body: branches } = {} } = useListBranchesQuery({
    queryParams: {
      limit: 50,
      query: branchQuery ?? ''
    },
    repo_ref: repo_ref
  })

  const { mutate: createTag, isLoading: isCreatingTag } = useCreateTagMutation(
    { repo_ref: repo_ref },
    {
      onSuccess: data => {
        setOpenCreateTagDialog(false)
        addTag(data.body as CommitTagType)
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

  const { mutate: createBranch, error: createBranchError } = useCreateBranchMutation(
    {},
    {
      onSuccess: () => {
        setOpenCreateBranchDialog(false)
      }
    }
  )

  useEffect(() => {
    if (tagsList) {
      setTags(tagsList as CommitTagType[])
    }
  }, [tagsList, setTags])

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches, repository?.default_branch))
    }
  }, [branches, setBranchList, repository])

  useEffect(() => {
    setPaginationFromHeaders(
      parseInt(headers?.get(PageResponseHeader.xNextPage) || ''),
      parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')
    )
  }, [headers, setPaginationFromHeaders])

  useEffect(() => {
    const defaultBranch = branchList?.find(branch => branch.default)
    setSelectedBranchTag({
      name: defaultBranch?.name || repository?.default_branch || '',
      sha: defaultBranch?.sha || '',
      default: true
    })
    setDefaultBranch(repository?.default_branch ?? '')
  }, [branchList, repository?.default_branch])

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

  const handleCreateBranch = (data: CreateBranchFormFields) => {
    createBranch({
      repo_ref,
      body: {
        ...data
      }
    })
  }

  return (
    <>
      <RepoTagsListView
        useTranslationStore={useTranslationStore}
        isLoading={isLoadingTags}
        openCreateBranchDialog={() => setOpenCreateBranchDialog(true)}
        openCreateTagDialog={() => setOpenCreateTagDialog(true)}
        searchQuery={query}
        setSearchQuery={setQuery}
        onDeleteTag={(tagName: string) => {
          setDeleteTagDialog(true)
          setDeleteTagName(tagName)
        }}
        useRepoTagsStore={useRepoTagsStore}
        toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      />
      <CreateTagDialog
        useTranslationStore={useTranslationStore}
        open={openCreateTagDialog}
        onClose={() => setOpenCreateTagDialog(false)}
        onSubmit={onSubmit}
        branchQuery={branchQuery}
        setBranchQuery={setBranchQuery}
        useRepoBranchesStore={useRepoBranchesStore}
        isLoading={isCreatingTag}
      />
      <CreateBranchDialog
        open={openCreateBranchDialog}
        onClose={() => setOpenCreateBranchDialog(false)}
        useRepoBranchesStore={useRepoBranchesStore}
        onSubmit={handleCreateBranch}
        useTranslationStore={useTranslationStore}
        handleChangeSearchValue={setBranchQuery}
        error={createBranchError?.message}
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
