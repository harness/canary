import { useEffect, useState } from 'react'

import {
  useDefineRepoLabelMutation,
  useDeleteRepoLabelMutation,
  useListRepoLabelsQuery,
  useUpdateRepoLabelMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { CreateLabelDialog, CreateLabelFormFields, ILabelType, ProjectLabelsListView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useRepoLabelsStore } from './stores/repo-labels-store'

export const RepoLabelsList = () => {
  //   const space_ref = useGetSpaceURLParam()
  const repo_ref = useGetRepoRef()
  const [openCreateLabelDialog, setOpenCreateLabelDialog] = useState(false)
  const [openAlertDeleteDialog, setOpenAlertDeleteDialog] = useState(false)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const { labels: storeLabels, setLabels, addLabel, setPresetEditLabel, deleteLabel } = useRepoLabelsStore()
  const handleOpenCreateLabelDialog = () => {
    setPresetEditLabel(null)
    setOpenCreateLabelDialog(true)
  }
  const handleOpenDeleteDialog = (identifier: string) => {
    setOpenAlertDeleteDialog(true)
    setIdentifier(identifier)
  }

  const { data: { body: labels } = {} } = useListRepoLabelsQuery({
    repo_ref: repo_ref ?? '',
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

  const { mutate: updateSpaceLabel } = useUpdateRepoLabelMutation(
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

  const { mutate: deleteSpaceLabel, isLoading: isDeletingSpaceLabel } = useDeleteRepoLabelMutation(
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
        openAlertDeleteDialog={() => {}}
        useTranslationStore={useTranslationStore}
        useLabelsStore={useRepoLabelsStore}
        space_ref={repo_ref}
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
        useLabelsStore={useRepoLabelsStore}
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
