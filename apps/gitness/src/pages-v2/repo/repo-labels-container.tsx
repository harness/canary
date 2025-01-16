import { useEffect, useState } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import {
  useDefineRepoLabelMutation,
  useDeleteRepoLabelMutation,
  useListRepoLabelsQuery,
  useUpdateRepoLabelMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { CreateLabelDialog, CreateLabelFormFields, ILabelType, RepoLabelsListView } from '@harnessio/ui/views'

import { useGetRepoId } from '../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useRepoLabelsStore } from './stores/repo-labels-store'

export const RepoLabelsList = () => {
  const repo_ref = useGetRepoRef()
  const space_ref = useGetSpaceURLParam()
  const repoId = useGetRepoId()
  const [openCreateLabelDialog, setOpenCreateLabelDialog] = useState(false)
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const {
    page,
    setPage,
    labels: storeLabels,
    setLabels,
    addLabel,
    setPresetEditLabel,
    deleteLabel,
    setRepoSpaceRef,
    setValues
  } = useRepoLabelsStore()

  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const handleOpenCreateLabelDialog = () => {
    setPresetEditLabel(null)
    setOpenCreateLabelDialog(true)
  }
  const handleOpenDeleteDialog = (identifier: string) => {
    setOpenAlertDeleteDialog(true)
    setIdentifier(identifier)
  }

  const { data: { body: labels } = {}, isLoading: isLoadingRepoLabels } = useListRepoLabelsQuery({
    repo_ref: repo_ref ?? '',
    queryParams: { page, limit: 100, query: query ?? '', inherited: true }
  })

  // const { data: { body: spaceLabels } = {}, isLoading: isLoadingSpaceLabels } = useListSpaceLabelsQuery({
  //   space_ref: space_ref ?? '',
  //   queryParams: { page, limit: 100, query: query ?? '' }
  // })

  // console.log(labels)

  // useEffect(() => {
  //   if (spaceLabels) {
  //     setParentLabels!(spaceLabels as ILabelType[])
  //   }
  // }, [spaceLabels, setParentLabels])

  useEffect(() => {
    setRepoSpaceRef!(repoId ?? '', space_ref ?? '')
  }, [repoId, space_ref])

  useEffect(() => {
    if (labels) {
      setLabels(labels as ILabelType[])
    }
  }, [labels, setLabels])

  useEffect(() => {
    setQueryPage(page)
  }, [page, setPage, queryPage])

  const {
    mutate: defineRepoLabel,
    isLoading: isCreatingLabel,
    error
  } = useDefineRepoLabelMutation(
    {
      repo_ref: repo_ref ?? ''
    },
    {
      onSuccess: data => {
        setOpenCreateLabelDialog(false)
        addLabel(data.body as ILabelType)
      }
    }
  )

  const { mutate: updateRepoLabel } = useUpdateRepoLabelMutation(
    {
      repo_ref: repo_ref ?? ''
    },
    {
      onSuccess: (data, variables) => {
        setOpenCreateLabelDialog(false)
        deleteLabel(variables.key)
        addLabel(data.body as ILabelType)
      }
    }
  )

  const { mutate: deleteRepoLabel, isLoading: isDeletingRepoLabel } = useDeleteRepoLabelMutation(
    {
      repo_ref: repo_ref ?? ''
    },
    {
      onSuccess: (_data, variables) => {
        setOpenAlertDeleteDialog(false)
        deleteLabel(variables.key)
      }
    }
  )

  useEffect(() => {
    async function fetchAllLabelValues(storeLabels: ILabelType[], repo_ref: string) {
      if (!repo_ref || !storeLabels) return

      const valuesByKey: Record<string, any> = {}

      for (const label of storeLabels) {
        try {
          const response = await fetch(`/api/v1/repos/${repo_ref}/labels/${label.key}/values`)
          const json = await response.json()
          valuesByKey[label.key] = json ?? []
        } catch (error) {
          console.error(`Error fetching values for label ${label.key}:`, error)
        }
      }
      console.log(valuesByKey)
      setValues(valuesByKey)
    }

    fetchAllLabelValues(storeLabels, repo_ref)
  }, [storeLabels, space_ref, setValues])

  const handleLabelCreate = (data: CreateLabelFormFields, identifier?: string) => {
    if (identifier) {
      updateRepoLabel({
        key: identifier,
        body: {
          key: data.name,
          color: data.color,
          description: data.description
        }
      })
      return
    }
    defineRepoLabel({
      body: {
        key: data.name,
        color: data.color,
        description: data.description
      }
    })
  }

  const handleEditLabel = (identifier: string) => {
    const label = (storeLabels ?? []).find(label => label.key === identifier)
    if (label) {
      setPresetEditLabel(label as ILabelType)
      setOpenCreateLabelDialog(true)
    }
  }

  const handleDeleteLabel = (identifier: string) => {
    deleteRepoLabel({
      key: identifier
    })
  }

  return (
    <>
      <RepoLabelsListView
        useTranslationStore={useTranslationStore}
        useLabelsStore={useRepoLabelsStore}
        // createdIn={space_ref}
        openCreateLabelDialog={handleOpenCreateLabelDialog}
        handleEditLabel={handleEditLabel}
        handleDeleteLabel={handleOpenDeleteDialog}
        showSpacer={false}
        searchQuery={query}
        setSearchQuery={setQuery}
        isLoadingSpaceLabels={isLoadingRepoLabels}
      />
      <CreateLabelDialog
        open={openCreateLabelDialog}
        onClose={() => setOpenCreateLabelDialog(false)}
        onSubmit={handleLabelCreate}
        useTranslationStore={useTranslationStore}
        isCreatingLabel={isCreatingLabel}
        error={error?.message ?? ''}
        useLabelsStore={useRepoLabelsStore}
      />
      <DeleteAlertDialog
        open={openAlertDeleteDialog}
        onClose={() => setOpenAlertDeleteDialog(false)}
        identifier={identifier ?? ''}
        type="label"
        deleteFn={handleDeleteLabel}
        isLoading={isDeletingRepoLabel}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
