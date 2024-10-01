import { useState } from 'react'
import { SandboxRepoCreatePage, CreateRepoProps } from '@harnessio/playground'
import Header from '../../components/Header'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useNavigate } from 'react-router-dom'

import {
  useCreateRepositoryMutation,
  OpenapiCreateRepositoryRequest,
  CreateRepositoryOkResponse,
  CreateRepositoryErrorResponse
} from '@harnessio/code-service-client'

export const CreateRepo = () => {
  const createRepositoryMutation = useCreateRepositoryMutation({})
  const spaceId = useGetSpaceURLParam()
  const navigate = useNavigate()

  const [apiError, setApiError] = useState<string | null>(null)

  const handleFormSubmit = (data: CreateRepoProps) => {
    const repositoryRequest: OpenapiCreateRepositoryRequest = {
      default_branch: 'main',
      parent_ref: spaceId,
      description: data.description,
      // git_ignore: data.gitignore,
      // license: data.license,
      is_public: data.access === '1',
      // readme: data.readme,
      readme: true,
      identifier: data.name
    }

    createRepositoryMutation.mutate(
      {
        queryParams: {},
        body: repositoryRequest
      },
      {
        onSuccess: (data: CreateRepositoryOkResponse) => {
          setApiError(null)
          navigate(`/${spaceId}/repos/${data?.identifier}`)

          // console.log(data)
        },
        onError: (error: CreateRepositoryErrorResponse) => {
          console.error('Error creating repository:', error)
          const message = error.message || 'An unknown error occurred.'
          setApiError(message)
        }
      }
    )
  }

  return (
    <>
      <Header />

      <SandboxRepoCreatePage
        onFormSubmit={handleFormSubmit}
        isLoading={createRepositoryMutation.isLoading}
        apiError={apiError}
      />
    </>
  )
}
