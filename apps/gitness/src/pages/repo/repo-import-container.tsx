import { useNavigate } from 'react-router-dom'

import { Spacer, Text } from '@harnessio/canary'
import { ImportRepositoryRequestBody, useImportRepositoryMutation } from '@harnessio/code-service-client'
import { RepoImportForm, RepoImportFormType, SandboxLayout } from '@harnessio/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

export const RepoImportContainer = () => {
  const spaceId = useGetSpaceURLParam()
  const navigate = useNavigate()
  const { mutateAsync: importRepo, isLoading: importingRepo, error: importRepoError } = useImportRepositoryMutation({})

  const handleImportRepo = async (data: RepoImportFormType) => {
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
    await importRepo({
      queryParams: { space_path: spaceId },
      body: body
    })

    navigate(`/spaces/${spaceId}/repos`)
  }

  const handleCancel = () => {
    navigate(`/spaces/${spaceId}/repos`)
  }
  return (
    <>
      <SandboxLayout.Main hasLeftPanel hasHeader>
        <SandboxLayout.Content maxWidth="2xl">
          <Spacer size={10} />
          <Text size={6} weight={'medium'}>
            Import a repository
          </Text>
          <Spacer size={8} />
          <RepoImportForm
            onSubmit={handleImportRepo}
            onCancel={handleCancel}
            isLoading={importingRepo}
            error={importRepoError?.message}
          />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </>
  )
}
