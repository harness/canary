import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CreateRepositoryErrorResponse,
  OpenapiCreateRepositoryRequest,
  useCreateRepositoryMutation,
  useListGitignoreQuery,
  useListLicensesQuery
} from '@harnessio/code-service-client'
import { FormFields, RepoCreatePageForm } from '@harnessio/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

export const CreateRepoV1 = () => {
  const createRepositoryMutation = useCreateRepositoryMutation({})
  const spaceId = useGetSpaceURLParam()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

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
          setApiError(null)
          navigate(`/spaces/${spaceId}/repos/${data?.identifier}`)
        },
        onError: (error: CreateRepositoryErrorResponse) => {
          const message = error.message || 'An unknown error occurred.'
          setApiError(message)
        }
      }
    )
  }

  const { data: { body: gitIgnoreOptions } = {} } = useListGitignoreQuery({})

  const { data: { body: licenseOptions } = {} } = useListLicensesQuery({})

  const onCancel = () => {
    navigate(`/spaces/${spaceId}/repos`)
  }

  return (
    <>
      <RepoCreatePageForm
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        apiError={apiError}
        isLoading={createRepositoryMutation.isLoading}
        isSuccess={createRepositoryMutation.isSuccess}
        gitIgnoreOptions={gitIgnoreOptions}
        licenseOptions={licenseOptions}
      />
    </>
  )
}
