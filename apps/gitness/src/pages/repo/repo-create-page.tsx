// import { useState } from 'react'
import { SandboxRepoCreatePage } from '@harnessio/playground'

import Header from '../../components/Header'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

import {
  useCreateRepositoryMutation,
  OpenapiCreateRepositoryRequest,
  CreateRepositoryOkResponse,
  CreateRepositoryErrorResponse
} from '@harnessio/code-service-client'

interface DataProps {
  name: string
  description: string
  gitignore: string
  license: string
  access: string
}

export const CreateRepo = () => {
  const createRepositoryMutation = useCreateRepositoryMutation({})
  const spaceID = useGetSpaceURLParam()
  // const [apiError, setApiError] = useState<string | null>(null)

  const onSubmit = (data: DataProps) => {
    const repositoryRequest: OpenapiCreateRepositoryRequest = {
      default_branch: 'main',
      parent_ref: spaceID,
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
        onSuccess: (data: CreateRepositoryOkResponse) => {
          // Handle success (show a success message, redirect, etc.)
          // setApiError(null)
          console.log(data)
        },
        onError: (error: CreateRepositoryErrorResponse) => {
          console.error('Error creating repository:', error)
          const message = error.message || 'An unknown error occurred.'
          // setApiError(message)
          console.log(message)
        }
      }
    )
  }

  return (
    <>
      <Header />
      {/* <SandboxLayout.Main hasLeftPanel hasHeader> */}

      <SandboxRepoCreatePage onFormSubmit={onSubmit} />
    </>
  )
}
