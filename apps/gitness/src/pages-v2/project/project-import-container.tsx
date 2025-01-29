import { useNavigate } from 'react-router-dom'

import { ImporterProviderType, ImportSpaceRequestBody, useImportSpaceMutation } from '@harnessio/code-service-client'
import { ImportProjectFormFields, ImportProjectPage, ProviderOptionsEnum } from '@harnessio/ui/views'

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
      onSuccess: data => {
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
        type:
          data.provider === ProviderOptionsEnum.GITHUB || data.provider === ProviderOptionsEnum.GITHUB_ENTERPRISE
            ? (ProviderOptionsEnum.GITHUB.toLocaleLowerCase() as ImporterProviderType)
            : undefined
      },
      provider_space: data.organization
    }
    importProjectMutation({
      queryParams: {},
      body: body
    })
  }

  const onCancel = () => {
    navigate(-1)
  }

  return (
    <ImportProjectPage
      onFormSubmit={onSubmit}
      onFormCancel={onCancel}
      isLoading={isLoading}
      apiErrorsValue={error?.message?.toString()}
    />
  )
}
