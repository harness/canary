import { useNavigate, useParams } from 'react-router-dom'

import {
  ImportRepositoryErrorResponse,
  ImportRepositoryRequestBody,
  useImportRepositoryMutation
} from '@harnessio/code-service-client'
import { toast, Toaster } from '@harnessio/ui/components'
import { ImportRepoFormFields, RepoImportPage as RepoImportPageView } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'

export const ImportRepo = () => {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const navigate = useNavigate()
  const importRepoMutation = useImportRepositoryMutation({})

  const onSubmit = async (data: ImportRepoFormFields) => {
    const body: ImportRepositoryRequestBody = {
      identifier: data.identifier,
      description: data.description,
      parent_ref: spaceURL,
      pipelines: data.pipelines === true ? 'convert' : 'ignore',
      provider: {
        host: '',
        password: data.password,
        type: 'github',
        username: ''
      },
      provider_repo: `${data.organization}/${data.repository}`
    }
    importRepoMutation.mutate(
      {
        queryParams: {},
        body: body
      },
      {
        onSuccess: () => {
          navigate(routes.toRepositories({ spaceId }))
        },
        onError: (error: ImportRepositoryErrorResponse) => {
          const message = error.message || 'An unknown error occurred.'
          toast({
            title: message,
            variant: 'destructive'
          })
        }
      }
    )
  }

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    <>
      <RepoImportPageView onFormSubmit={onSubmit} onFormCancel={onCancel} isLoading={importRepoMutation.isLoading} />
      <Toaster />
    </>
  )
}
