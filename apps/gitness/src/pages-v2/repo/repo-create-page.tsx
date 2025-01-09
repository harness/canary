import { useNavigate } from 'react-router-dom'

import {
  CreateRepositoryErrorResponse,
  OpenapiCreateRepositoryRequest,
  useCreateRepositoryMutation,
  useListGitignoreQuery,
  useListLicensesQuery
} from '@harnessio/code-service-client'
import { toast, Toaster } from '@harnessio/ui/components'
import { FormFields, RepoCreatePage as RepoCreatePageView } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

export const CreateRepo = () => {
  const routes = useRoutes()
  const createRepositoryMutation = useCreateRepositoryMutation({})
  const spaceId = useGetSpaceURLParam()
  const navigate = useNavigate()

  const onSubmit = (data: FormFields) => {
    const repositoryRequest: OpenapiCreateRepositoryRequest = {
      default_branch: 'main',
      parent_ref: spaceId,
      description: data.description,
      git_ignore: data.gitignore,
      license: data.license,
      is_public: data.access === '1',
      readme: true,
      identifier: data.name
    }

    createRepositoryMutation.mutate(
      {
        queryParams: {},
        body: repositoryRequest
      },
      {
        onSuccess: ({ body: data }) => {
          navigate(`/${spaceId}/repos/${data?.identifier}`)
        },
        onError: (error: CreateRepositoryErrorResponse) => {
          const message = error.message || 'An unknown error occurred.'
          toast({
            title: message,
            variant: 'destructive'
          })
        }
      }
    )
  }

  const { data: { body: gitIgnoreOptions } = {} } = useListGitignoreQuery({})

  const { data: { body: licenseOptions } = {} } = useListLicensesQuery({})

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    <>
      <RepoCreatePageView
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        isLoading={createRepositoryMutation.isLoading}
        isSuccess={createRepositoryMutation.isSuccess}
        gitIgnoreOptions={gitIgnoreOptions}
        licenseOptions={licenseOptions}
      />
      <Toaster />
    </>
  )
}
