import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useAppContext } from '../../framework/context/AppContext'
import { OpenapiUpdateSpaceRequest, TypesMembershipSpace, useUpdateSpaceMutation } from '@harnessio/code-service-client'
import { ProjectSettingsSandboxPage } from './projsettings-sandbox-page'

export const ProjectSettingsGeneralPage = () => {
  const spaceId = useGetSpaceURLParam()
  const { spaces } = useAppContext()
  const space = spaces.find((space: TypesMembershipSpace) => space?.space?.identifier === spaceId)

  console.log(space)

  const spaceData = {
    identifier: space?.space?.identifier ?? '',
    description: space?.space?.description ?? ''
  }
  //I have one form submit but two inputchange has different api call, one is updateProject antoher is updateSpace

  //move space -> identifier, uid
  //update space -> description
  console.log(spaceData, 'spaceData')

  const updateDescription = useUpdateSpaceMutation(
    {
      space_ref: space?.space?.path
    }, // props passed to the mutation
    {
      onSuccess: data => {
        console.log('General settings updated successfully', data)
      },
      onError: error => {
        console.error('Error updating settings', error)
      }
    }
  )

  const handleUpdateDescription = (descriptionData: OpenapiUpdateSpaceRequest) => {
    // Prepare the request body
    const requestBody: OpenapiUpdateSpaceRequest = {
      description: descriptionData?.description
    }
    console.log(descriptionData, 'description')
    // Call the mutate function to trigger the API call
    updateDescription.mutate({
      space_ref: space?.space?.path,
      body: requestBody
    })
  }

  // Function to handle description input change
  const handleDescriptionChange = (newDescription: string) => {
    // Call API or save the description
    console.log('New description:', newDescription)
    handleUpdateDescription({ description: newDescription })
  }

  //handle form submit
  const handleFormSubmit = (formData: { description: string }) => {
    // Trigger API calls here, no need for useEffect
    updateDescription.mutate({
      space_ref: space?.space?.path,
      body: {
        description: formData?.description
      }
    })
  }

  //prevent double rendering

  return (
    <ProjectSettingsSandboxPage
      spaceData={spaceData}
      onFormSubmit={handleFormSubmit} //what should I use on handleFormSubmit to update two data with different api call
      onHandleDescription={handleDescriptionChange}
    />
  )
}
//check this data from form first

// Call the useMoveSpaceMutation hook to move the space
//   const updateProject = useMoveSpaceMutation(
//     {
//       space_ref: space?.space?.path
//     },
//     {
//       onSuccess: (data: MoveSpaceOkResponse) => {
//         console.log('Space moved successfully', data)
//       },
//       onError: (error: MoveSpaceErrorResponse) => {
//         console.error('Error moving space:', error)
//       }
//     }
//   )

// Function to handle changes coming from the child component

//   const handleUpdateProjName = (projData: OpenapiMoveSpaceRequest) => {
//     // Prepare the request body
//     const requestBody: OpenapiMoveSpaceRequest = {
//       identifier: projData?.identifier
//     }
//     console.log(projData, '')
//     // Call the mutate function to trigger the API call
//     updateProject.mutate({
//       space_ref: space?.space?.path,
//       body: requestBody
//     })
//   }

// Function to handle project name input change
//   const handleProjNameChange = (newProjectName: string) => {
//     // Do something with newProjectName
//     handleUpdateProjName({
//       identifier: newProjectName
//     })
//   }
