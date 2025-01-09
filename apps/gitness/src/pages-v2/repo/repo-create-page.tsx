import { useNavigate, useParams } from 'react-router-dom'

import {
  CreateRepositoryErrorResponse,
  OpenapiCreateRepositoryRequest,
  useCreateRepositoryMutation,
  useListGitignoreQuery,
  useListLicensesQuery
} from '@harnessio/code-service-client'
import { toast, Toaster } from '@harnessio/ui/components'
import { FormFields, RepoCreatePage as RepoCreatePageView } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'

export const CreateRepo = () => {
  const createRepositoryMutation = useCreateRepositoryMutation({})
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const navigate = useNavigate()

  const onSubmit = (data: FormFields) => {
    const repositoryRequest: OpenapiCreateRepositoryRequest = {
      default_branch: 'main',
      parent_ref: spaceURL,
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
    navigate(`/${spaceId}/repos`)
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
