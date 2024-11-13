import { useState } from 'react'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useAppContext } from '../../framework/context/AppContext'
import { NoData } from '@harnessio/views'
import {
  TypesSpace,
  useUpdateSpaceMutation,
  useDeleteSpaceMutation,
  UpdateSpaceErrorResponse,
  DeleteSpaceErrorResponse,
  UpdateSpaceRequestBody
} from '@harnessio/code-service-client'
import { ProjectSettingsPage } from './project-settings-page'
import { redirect } from 'react-router-dom'

type spaceData = {
  identifier: string
  description: string
}

export const ProjectSettingsGeneralPage = () => {
  const spaceId = useGetSpaceURLParam()
  const { spaces } = useAppContext()
  const space = spaces.find((space: TypesSpace) => space?.identifier === spaceId)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const spaceData: spaceData = {
    identifier: space?.identifier ?? '',
    description: space?.description ?? ''
  }

  const updateDescription = useUpdateSpaceMutation(
    {
      space_ref: space?.path
    },
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

  const handleUpdateDescription = (descriptionData: UpdateSpaceRequestBody) => {
    const requestBody: UpdateSpaceRequestBody = {
      description: descriptionData?.description
    }

    updateDescription.mutate({
      space_ref: space?.path,
      body: requestBody
    })
  }

  const handleDescriptionChange = (newDescription: string) => {
    handleUpdateDescription({ description: newDescription })
  }

  const handleFormSubmit = (formData: { description: string }) => {
    updateDescription.mutate({
      space_ref: space?.path,
      body: {
        description: formData?.description
      }
    })
  }

  // delete API call here
  const deleteSpaceMutation = useDeleteSpaceMutation(
    {
      space_ref: space?.path
    },
    {
      onSuccess: ({ body: data }) => {
        if (data) {
          setDeleteError(null)
          window.location.href = '/'
        }
      },
      onError: (error: DeleteSpaceErrorResponse) => {
        const deleteErrorMsg = error?.message || 'An unknown error occurred.'
        setDeleteError(deleteErrorMsg)
      }
    }
  )

  const handleDeleteProject = () => {
    deleteSpaceMutation.mutate(
      { space_ref: space?.path },
      {
        onSuccess: () => {
          setDeleteError(null)
          window.location.href = '/'
        }
      }
    )
  }

  const renderContent = (space: spaceData) => {
    if (space?.identifier === '') {
      return (
        <NoData iconName="no-data-folder" title="No project found" description={['There are no projects found.']} />
      )
    } else {
      return (
        <ProjectSettingsPage
          spaceData={spaceData}
          onFormSubmit={handleFormSubmit}
          onHandleDescription={handleDescriptionChange}
          handleDeleteProject={handleDeleteProject}
          isUpdating={updateDescription.isLoading}
          isDeleting={deleteSpaceMutation.isLoading}
          isUpateSuccess={updateDescription.isSuccess}
          isDeleteSuccess={deleteSpaceMutation.isSuccess}
          updateError={updateError}
          deleteError={deleteError}
        />
      )
    }
  }

  return <>{renderContent(spaceData)}</>
}
