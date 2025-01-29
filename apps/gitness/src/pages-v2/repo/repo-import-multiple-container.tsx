import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ImporterProviderType, ImportSpaceRequestBody } from '@harnessio/code-service-client'
import { ImportMultipleReposFormFields, ProviderOptionsEnum, RepoImportMultiplePage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'

export const ImportMultipleRepos = () => {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string>('')

  const onSubmit = async (data: ImportMultipleReposFormFields) => {
    const body: ImportSpaceRequestBody = {
      identifier: spaceURL,
      description: '',
      parent_ref: spaceURL,
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

    try {
      const response = await fetch(`/api/v1/spaces/${spaceId}/+/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorData = await response.json()

        // temporary solution to handle unauthorized requests

        if (response.status === 401) {
          navigate('/login')
        }

        setApiError(errorData.message || 'Failed to import space')

        return
      }
      navigate(routes.toRepositories({ spaceId }))
    } catch (error) {
      setApiError((error as Error).message || 'An unexpected error occurred')
    }
  }

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    // @TODO: Add loading states and error handling when API is available
    <>
      <RepoImportMultiplePage
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        isLoading={false}
        apiErrorsValue={apiError}
      />
    </>
  )
}
