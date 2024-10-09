import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useAppContext } from '../../framework/context/AppContext'
import {
  useMoveSpaceMutation,
  MoveSpaceOkResponse,
  MoveSpaceErrorResponse,
  OpenapiMoveSpaceRequest,
  TypesMembershipSpace
} from '@harnessio/code-service-client'
import { ProjectSettingsSandboxPage } from './projsettings-sandbox-page'

export const ProjectSettingsGeneralPage = () => {
  const spaceId = useGetSpaceURLParam()
  const { spaces } = useAppContext()
  const space = spaces.find((space: TypesMembershipSpace) => space?.space?.identifier === spaceId)

  const spaceData = {
    projectName: space?.space?.identifier,
    identifier: space?.space?.identifier,
    projectURL: `/${space?.space?.path}/repos`
  }

  console.log(spaceData, 'spaceData')

  const { mutate } = useMoveSpaceMutation(
    {
      space_ref: space?.space?.path
    },
    {
      onSuccess: (data: MoveSpaceOkResponse) => {
        console.log('Space moved successfully', data)
      },
      onError: (error: MoveSpaceErrorResponse) => {
        console.error('Error moving space:', error)
      }
    }
  )

  // Function to handle changes coming from the child component

  const handleMoveSpace = (formData: OpenapiMoveSpaceRequest) => {
    // Prepare the request body
    const requestBody: OpenapiMoveSpaceRequest = {
      identifier: formData?.identifier,
      uid: formData?.identifier
    }
    console.log(formData, 'formData')
    // Call the mutate function to trigger the API call
    mutate({
      space_ref: space?.space?.path,
      body: requestBody
    })
  }

  return <ProjectSettingsSandboxPage data={spaceData} onFormSubmit={handleMoveSpace} />
}
