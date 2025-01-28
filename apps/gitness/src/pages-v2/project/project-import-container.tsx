import { useNavigate } from 'react-router-dom'

import { ImportSpaceRequestBody, useImportSpaceMutation } from '@harnessio/code-service-client'
import { ImportProjectFormFields, ImportProjectPage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'

export const ImportProjectContainer = () => {
  const routes = useRoutes()
  const navigate = useNavigate()

  const {
    mutate: importProjectMutation,
    error,
    isLoading
  } = useImportSpaceMutation(
    {},
    {
      onSuccess: (data, _variabels) => {
        navigate(routes.toRepositories({ spaceId: data.body?.identifier }))
      }
    }
  )

  const onSubmit = async (data: ImportProjectFormFields) => {
    const body: ImportSpaceRequestBody = {
      identifier: data.identifier,
      description: data.description,
      pipelines: data.pipelines === true ? 'convert' : 'ignore',
      provider: {
        host: data.hostUrl ?? '',
        password: data.password,
        type: 'github',
        username: ''
      },
      provider_space: data.organization
    }
    importProjectMutation({
      queryParams: {},
      body: body
    })
  }

  const onCancel = () => {
    navigate('/')
  }

  return (
    <>
      <ImportProjectPage
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        isLoading={isLoading}
        apiErrorsValue={error?.message?.toString()}
      />
    </>
  )
}
