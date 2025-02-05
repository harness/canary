import { useEffect, useState } from 'react'
import { redirect } from 'react-router-dom'

import {
  DeleteSpaceErrorResponse,
  TypesSpace,
  UpdateSpaceErrorResponse,
  useDeleteSpaceMutation,
  useUpdateSpaceMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { ProjectSettingsGeneralFields, ProjectSettingsGeneralPage } from '@harnessio/ui/views'

import { useAppContext } from '../../framework/context/AppContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store.ts'
import { useSpaceStore } from './stores/spaces-store'

export const ProjectGeneralSettingsPageContainer = () => {
  const spaceURL = useGetSpaceURLParam()
  const { spaces, isSpacesLoading } = useAppContext()
  const { setSpace, setIsLoading } = useSpaceStore()
  const space = spaces.find((space: TypesSpace) => space?.identifier === spaceURL)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<{ type: string; message: string } | null>(null)

  const updateDescription = useUpdateSpaceMutation(
    { space_ref: space?.path },
    {
      onSuccess: ({ body: data }) => {
        if (space) {
          setUpdateError('')
          space.description = data?.description
        }
        redirect('/')
      },
      onError: (error: UpdateSpaceErrorResponse) => {
        const errormsg = error?.message || 'An unknown error occurred.'
        setUpdateError(errormsg)
      }
    }
  )

  const handleFormSubmit = (formData: ProjectSettingsGeneralFields) => {
    updateDescription.mutate({ space_ref: space?.path, body: { description: formData?.description } })
  }

  // delete API call here
  const deleteSpaceMutation = useDeleteSpaceMutation(
    { space_ref: space?.path },
    {
      onSuccess: ({ body: data }) => {
        if (data) {
          setDeleteError(null)
          redirect('/')
        }
      },
      onError: (error: DeleteSpaceErrorResponse) => {
        const deleteErrorMsg = error?.message || 'An unknown error occurred.'
        setDeleteError({ type: '', message: deleteErrorMsg })
      }
    }
  )

  const handleDeleteProject = () => {
    deleteSpaceMutation.mutate(
      { space_ref: space?.path },
      {
        onSuccess: () => {
          setDeleteError(null)
          redirect('/')
        }
      }
    )
  }

  useEffect(() => {
    setIsLoading(isSpacesLoading)
  }, [isSpacesLoading, setIsLoading])

  useEffect(() => {
    setSpace(space || null)
  }, [space, setSpace])

  return (
    <>
      <ProjectSettingsGeneralPage
        useSpaceStore={useSpaceStore}
        onFormSubmit={handleFormSubmit}
        isUpdating={updateDescription.isLoading}
        isUpdateSuccess={updateDescription.isSuccess}
        updateError={updateError}
        setOpenDeleteDialog={() => setOpenDeleteDialog(true)}
        useTranslationStore={useTranslationStore}
      />
      <DeleteAlertDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        deleteFn={handleDeleteProject}
        type="Project"
        error={deleteError}
        identifier=""
        isLoading={deleteSpaceMutation.isLoading}
        withForm
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
