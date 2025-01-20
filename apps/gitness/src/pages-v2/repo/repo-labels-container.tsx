import { useEffect, useState } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import {
  useDefineRepoLabelMutation,
  useDeleteRepoLabelMutation,
  useDeleteSpaceLabelMutation,
  useListRepoLabelsQuery,
  useUpdateRepoLabelMutation,
  useUpdateSpaceLabelMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { CreateLabelDialog, CreateLabelFormFields, ILabelType, RepoLabelsListView } from '@harnessio/ui/views'

import { useGetRepoId } from '../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useLabelsStore } from '../project/stores/labels-store'

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
    repoLabels: storeLabels,
    setRepoLabels,

    addRepoLabel,
    addSpaceLabel,
    setPresetEditLabel,
    deleteRepoLabel: deleteRepoStoreLabel,
    deleteSpaceLabel: deleteStoreSpaceLabel,
    setRepoSpaceRef,
    setRepoValues,
    getParentScopeLabels
  } = useLabelsStore()

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
    queryParams: { page, limit: 100, query: query ?? '', inherited: getParentScopeLabels }
  })

  useEffect(() => {
    setRepoSpaceRef!(repoId ?? '', space_ref ?? '')
  }, [repoId, space_ref])

  useEffect(() => {
    if (labels) {
      setRepoLabels(labels as ILabelType[])
    }
  }, [labels, setRepoLabels])

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
        addRepoLabel(data.body as ILabelType)
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
        deleteRepoStoreLabel(variables.key)
        addRepoLabel(data.body as ILabelType)
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
        deleteRepoStoreLabel(variables.key)
      }
    }
  )

  const { mutate: updateSpaceLabel } = useUpdateSpaceLabelMutation(
    {
      space_ref: space_ref ?? ''
    },
    {
      onSuccess: (data, variables) => {
        setOpenCreateLabelDialog(false)
        deleteStoreSpaceLabel(variables.key)
        addSpaceLabel(data.body as ILabelType)
        deleteRepoStoreLabel(variables.key)
        addRepoLabel(data.body as ILabelType)
      }
    }
  )

  const { mutate: deleteSpaceLabel, isLoading: isDeletingSpaceLabel } = useDeleteSpaceLabelMutation(
    {
      space_ref: space_ref ?? ''
    },
    {
      onSuccess: (_data, variables) => {
        setOpenAlertDeleteDialog(false)
        deleteStoreSpaceLabel(variables.key)
        deleteRepoStoreLabel(variables.key)
      }
    }
  )

  useEffect(() => {
    async function fetchAllLabelValues(storeLabels: ILabelType[]) {
      if (!repo_ref || !storeLabels) return

      const valuesByKey: Record<string, any> = {}

      for (const label of storeLabels) {
        if (label.scope === 0) {
          try {
            const response = await fetch(`/api/v1/repos/${repo_ref}/labels/${label.key}/values`)
            const json = await response.json()
            valuesByKey[label.key] = json ?? []
          } catch (error) {
            console.error(`Error fetching values for label ${label.key}:`, error)
          }
        } else {
          try {
            const response = await fetch(`/api/v1/spaces/${space_ref}/labels/${label.key}/values`)
            const json = await response.json()
            valuesByKey[label.key] = json ?? []
          } catch (error) {
            console.error(`Error fetching values for label ${label.key}:`, error)
          }
        }
      }
      setRepoValues(valuesByKey)
    }
    fetchAllLabelValues(storeLabels)
  }, [storeLabels, space_ref, setRepoValues, getParentScopeLabels])

  const handleLabelCreate = (data: CreateLabelFormFields, identifier?: string) => {
    if (identifier) {
      const label = (storeLabels ?? []).find(label => label.key === identifier)
      if (label?.scope === 0) {
        updateRepoLabel({
          key: identifier,
          body: {
            key: data.name,
            color: data.color,
            description: data.description
          }
        })
      } else {
        updateSpaceLabel({
          key: identifier,
          body: {
            key: data.name,
            color: data.color,
            description: data.description
          }
        })
      }
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
    const label = (storeLabels ?? []).find(label => label.key === identifier)
    if (label?.scope === 0) {
      deleteRepoLabel({
        key: identifier
      })
    } else {
      deleteSpaceLabel({
        key: identifier
      })
    }
  }

  return (
    <>
      <RepoLabelsListView
        useTranslationStore={useTranslationStore}
        useLabelsStore={useLabelsStore}
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
        useLabelsStore={useLabelsStore}
      />
      <DeleteAlertDialog
        open={openAlertDeleteDialog}
        onClose={() => setOpenAlertDeleteDialog(false)}
        identifier={identifier ?? ''}
        type="label"
        deleteFn={handleDeleteLabel}
        isLoading={isDeletingRepoLabel || isDeletingSpaceLabel}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
