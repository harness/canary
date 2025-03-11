import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DeleteSpaceErrorResponse,
  TypesSpace,
  UpdateSpaceErrorResponse,
  useDeleteSpaceMutation,
  useUpdateSpaceMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog, DeleteAlertDialogProps } from '@harnessio/ui/components'
import { ProjectSettingsGeneralFields, ProjectSettingsGeneralPage } from '@harnessio/ui/views'

import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext.tsx'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store.ts'

export const ProjectGeneralSettingsPageContainer = () => {
  const routes = useRoutes()
  const navigate = useNavigate()
  const spaceURL = useGetSpaceURLParam()
  const { spaces, isSpacesLoading, setSpaces } = useAppContext()
  const space = spaces.find((space: TypesSpace) => space?.identifier === spaceURL)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<DeleteAlertDialogProps['error']>(null)

  const updateDescription = useUpdateSpaceMutation(
    { space_ref: space?.path },
    {
      onSuccess: ({ body: data }) => {
        if (space) {
          setUpdateError('')
          space.description = data?.description
        }
        navigate(routes.toHome())
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
  const { mutate: deleteSpaceMutation, isLoading } = useDeleteSpaceMutation(
    { space_ref: space?.path },
    {
      onSuccess: ({ body: data }) => {
        if (!data) return

        setDeleteError(null)
        navigate(routes.toHome())
        setSpaces(spaces.filter((s: TypesSpace) => s.identifier !== space?.identifier))
      },
      onError: (error: DeleteSpaceErrorResponse) => {
        const deleteErrorMsg = error?.message || 'An unknown error occurred.'
        setDeleteError({ message: deleteErrorMsg })
      }
    }
  )

  const handleDeleteProject = () => deleteSpaceMutation({})

  return (
    <>
      <ProjectSettingsGeneralPage
        data={space}
        isLoading={isSpacesLoading}
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
        isLoading={isLoading}
        withForm
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}
