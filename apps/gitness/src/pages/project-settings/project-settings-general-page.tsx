import { useState } from 'react'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useAppContext } from '../../framework/context/AppContext'
import {
  OpenapiUpdateSpaceRequest,
  TypesSpace,
  useUpdateSpaceMutation,
  useDeleteSpaceMutation,
  UpdateSpaceErrorResponse,
  DeleteSpaceErrorResponse
} from '@harnessio/code-service-client'
import { ProjectSettingsSandboxPage } from './project-settings-sandbox-page'
import { redirect } from 'react-router-dom'

export const ProjectSettingsGeneralPage = () => {
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const spaceId = useGetSpaceURLParam()
  const { spaces } = useAppContext()
  const space = spaces.find((space: TypesSpace) => space?.identifier === spaceId)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const spaceData = {
    identifier: space?.identifier ?? '',
    description: space?.description ?? ''
  }

  const updateDescription = useUpdateSpaceMutation(
    {
      space_ref: space?.path
    },
    {
      onSuccess: data => {
        if (space) {
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

  const handleUpdateDescription = (descriptionData: OpenapiUpdateSpaceRequest) => {
    const requestBody: OpenapiUpdateSpaceRequest = {
      description: descriptionData?.description
    }

    updateDescription.mutate({
      space_ref: space?.path,
      body: requestBody
    })
  }

  // Function to handle description input change
  const handleDescriptionChange = (newDescription: string) => {
    handleUpdateDescription({ description: newDescription })
  }

  //handle form submit
  const handleFormSubmit = (formData: { description: string }) => {
    updateDescription.mutate({
      space_ref: space?.path,
      body: {
        description: formData?.description
      }
    })
  }

  // Define the delete API call here
  const deleteSpaceMutation = useDeleteSpaceMutation(
    {
      space_ref: space?.path
    },
    {
      onSuccess: () => {
        setIsDeleting(true)
        setTimeout(() => {
          setIsDeleting(false)
          setIsDeleteSuccess(true) // Mark deletion as successful
          window.location.href = '/'
        }, 2000)
      },
      onError: (error: DeleteSpaceErrorResponse) => {
        const deleteErrorMsg = error?.message || 'An unknown error occurred.'
        setDeleteError(deleteErrorMsg)
      }
    }
  )

  // Create the delete handler function
  const handleDeleteProject = () => {
    deleteSpaceMutation.mutate(
      { space_ref: space?.path },
      {
        onSettled: () => setIsDeleting(false) // Ensure isDeleting is reset after the mutation completes
      }
    )
  }

  return (
    <ProjectSettingsSandboxPage
      spaceData={spaceData}
      onFormSubmit={handleFormSubmit}
      onHandleDescription={handleDescriptionChange}
      handleDeleteProject={handleDeleteProject}
      isDeleteSuccess={isDeleteSuccess}
      isDeleting={isDeleting}
      updateError={updateError}
      deleteError={deleteError}
    />
  )
}
