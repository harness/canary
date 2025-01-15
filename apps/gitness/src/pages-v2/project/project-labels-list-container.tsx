import { useEffect, useState } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import {
  useDefineSpaceLabelMutation,
  useDeleteSpaceLabelMutation,
  useListSpaceLabelsQuery,
  // useListSpaceLabelValuesQuery,
  useUpdateSpaceLabelMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { CreateLabelDialog, CreateLabelFormFields, ILabelType, ProjectLabelsListView } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useLabelsStore } from './stores/labels-store'

export const ProjectLabelsList = () => {
  const space_ref = useGetSpaceURLParam()
  const [openCreateLabelDialog, setOpenCreateLabelDialog] = useState(false)
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const {
    page,
    setPage,
    spaceLabels: storeLabels,
    setSpaceLabels,
    addSpaceLabel,
    setPresetEditLabel,
    deleteSpaceLabel: deleteStoreSpaceLabel,
    setSpaceValues,
    setRepoSpaceRef
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

  const { data: { body: labels } = {}, isLoading: isLoadingSpaceLabels } = useListSpaceLabelsQuery({
    space_ref: space_ref ?? '',
    queryParams: { page, limit: 100, query: query ?? '' }
  })

  useEffect(() => {
    if (labels) {
      setSpaceLabels(labels as ILabelType[])
    }
  }, [labels, setSpaceLabels])

  useEffect(() => {
    setQueryPage(page)
  }, [page, setPage, queryPage])

  useEffect(() => {
    setRepoSpaceRef(space_ref ?? '')
  }, [space_ref])

  const {
    mutate: defineSpaceLabel,
    isLoading: isCreatingLabel,
    error
  } = useDefineSpaceLabelMutation(
    {
      space_ref: space_ref ?? ''
    },
    {
      onSuccess: data => {
        setOpenCreateLabelDialog(false)
        addSpaceLabel(data.body as ILabelType)
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
      }
    }
  )

  useEffect(() => {
    async function fetchAllLabelValues(storeLabels: ILabelType[], spaceRef: string) {
      if (!spaceRef || !storeLabels) return

      const valuesByKey: Record<string, any> = {}

      for (const label of storeLabels) {
        try {
          const response = await fetch(`/api/v1/spaces/${spaceRef}/labels/${label.key}/values`)
          const json = await response.json()
          valuesByKey[label.key] = json ?? []
        } catch (error) {
          console.error(`Error fetching values for label ${label.key}:`, error)
        }
      }

      setSpaceValues(valuesByKey)
    }

    fetchAllLabelValues(storeLabels, space_ref!)
  }, [storeLabels, space_ref, setSpaceValues])

  const handleLabelCreate = (data: CreateLabelFormFields, identifier?: string) => {
    if (identifier) {
      updateSpaceLabel({
        key: identifier,
        body: {
          key: data.name,
          color: data.color,
          description: data.description
        }
      })
      return
    }
    defineSpaceLabel({
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
    deleteSpaceLabel({
      key: identifier
    })
  }

  return (
    <>
      <ProjectLabelsListView
        useTranslationStore={useTranslationStore}
        useLabelsStore={useLabelsStore}
        createdIn={space_ref}
        openCreateLabelDialog={handleOpenCreateLabelDialog}
        handleEditLabel={handleEditLabel}
        handleDeleteLabel={handleOpenDeleteDialog}
        searchQuery={query}
        setSearchQuery={setQuery}
        isLoadingSpaceLabels={isLoadingSpaceLabels}
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
        isLoading={isDeletingSpaceLabel}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
