import { useNavigate } from 'react-router-dom'

import {
  ImportRepositoryErrorResponse,
  ImportRepositoryRequestBody,
  useImportRepositoryMutation
} from '@harnessio/code-service-client'
import { toast, Toaster } from '@harnessio/ui/components'
import { ImportRepoFormFields, RepoImportPage as RepoImportPageView } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

export const ImportRepo = () => {
  const spaceId = useGetSpaceURLParam()
  const navigate = useNavigate()
  const importRepoMutation = useImportRepositoryMutation({})

  const onSubmit = async (data: ImportRepoFormFields) => {
    const body: ImportRepositoryRequestBody = {
      identifier: data.identifier,
      description: data.description,
      parent_ref: spaceId,
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
          navigate(`/${spaceId}/repos`)
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
    navigate(`/${spaceId}/repos`)
  }

  return (
    <>
      <RepoImportPageView onFormSubmit={onSubmit} onFormCancel={onCancel} isLoading={importRepoMutation.isLoading} />
      <Toaster />
    </>
  )
}
