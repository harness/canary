import { useEffect, useState } from 'react'

import {
  useDefineSpaceLabelMutation,
  useDeleteSpaceLabelMutation,
  useListSpaceLabelsQuery,
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
  const { labels: storeLabels, setLabels, addLabel, setPresetEditLabel, deleteLabel } = useLabelsStore()
  const handleOpenCreateLabelDialog = () => {
    setPresetEditLabel(null)
    setOpenCreateLabelDialog(true)
  }
  const handleOpenDeleteDialog = (identifier: string) => {
    setOpenAlertDeleteDialog(true)
    setIdentifier(identifier)
  }

  const { data: { body: labels } = {} } = useListSpaceLabelsQuery({
    space_ref: space_ref ?? '',
    queryParams: { page: 1, limit: 100 }
  })

  useEffect(() => {
    if (labels) {
      setLabels(labels as ILabelType[])
    }
  }, [labels, setLabels])

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
        addLabel(data.body as ILabelType)
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
        deleteLabel(variables.key)
        addLabel(data.body as ILabelType)
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
        deleteLabel(variables.key)
      }
    }
  )

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
