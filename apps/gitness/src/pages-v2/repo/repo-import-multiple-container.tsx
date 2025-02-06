import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ImportSpaceRequestBody } from '@harnessio/code-service-client'
import { ImportMultipleReposFormFields, RepoImportMultiplePage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'
import { getRepoProviderConfig, PROVIDER_TYPE_MAP } from './constants/import-providers-map'

export const ImportMultipleRepos = () => {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async (data: ImportMultipleReposFormFields) => {
    const provider_space = getRepoProviderConfig(data)
    const body: ImportSpaceRequestBody = {
      identifier: spaceURL,
      description: '',
      parent_ref: spaceURL,
      pipelines: data.pipelines ? 'convert' : 'ignore',
      provider: {
        host: data.hostUrl ?? '',
        username: data.username,
        password: data.password,
        type: PROVIDER_TYPE_MAP[data.provider]
      },
      provider_space
    }

    try {
      setLoading(true)
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

        setLoading(false)
        setApiError(errorData.message || 'Failed to import space')

        return
      }
      setLoading(false)
      navigate(routes.toRepositories({ spaceId }))
    } catch (error) {
      setLoading(false)
      setApiError((error as Error).message || 'An unexpected error occurred')
    }
  }

  const onCancel = () => {
    setLoading(false)
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    // @TODO: Add loading states and error handling when API is available
    <>
      <RepoImportMultiplePage
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        isLoading={loading}
        apiErrorsValue={apiError}
      />
    </>
  )
}
