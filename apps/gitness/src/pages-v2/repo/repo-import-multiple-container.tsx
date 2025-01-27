import { useNavigate, useParams } from 'react-router-dom'

import { ImportSpaceRequestBody } from '@harnessio/code-service-client'
import { ImportMultipleReposFormFields, RepoImportMultiplePage } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'

export const ImportMultipleRepos = () => {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const navigate = useNavigate()

  const onSubmit = async (data: ImportMultipleReposFormFields) => {
    const body: ImportSpaceRequestBody = {
      identifier: spaceURL,
      description: '',
      parent_ref: spaceURL,
      pipelines: data.pipelines === true ? 'convert' : 'ignore',
      provider: {
        host: data.hostUrl ?? '',
        password: data.password,
        type: 'github',
        username: ''
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
        console.error('Error importing space:', errorData)
        throw new Error(errorData.message || 'Failed to import space')
      }

      navigate(routes.toRepositories({ spaceId }))
    } catch (error) {
      console.error('Error during API call:', error)
    }
  }

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    // @TODO: Add loading states and error handling when API is available
    <>
      <RepoImportMultiplePage onFormSubmit={onSubmit} onFormCancel={onCancel} isLoading={false} apiErrorsValue={''} />
    </>
  )
}
