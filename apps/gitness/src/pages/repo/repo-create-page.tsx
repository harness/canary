import { useState } from 'react'
import { SandboxRepoCreatePage, FormFields } from '@harnessio/playground'
import { useNavigate } from 'react-router-dom'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

import {
  useCreateRepositoryMutation,
  OpenapiCreateRepositoryRequest,
  CreateRepositoryErrorResponse
} from '@harnessio/code-service-client'

export const CreateRepo = () => {
  const createRepositoryMutation = useCreateRepositoryMutation({})
  const spaceId = useGetSpaceURLParam()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const onSubmit = (data: FormFields) => {
    const repositoryRequest: OpenapiCreateRepositoryRequest = {
      default_branch: 'main',
      parent_ref: spaceId,
      description: data.description,
      // git_ignore: data.gitignore,
      // license: data.license,
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

  const onCancel = () => {
    navigate(`/${spaceId}/repos`)
  }

  return (
    <>
      <SandboxRepoCreatePage
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        apiError={apiError}
        isLoading={createRepositoryMutation.isLoading}
        isSuccess={createRepositoryMutation.isSuccess}
      />
    </>
  )
}
