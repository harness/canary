import {
  RepoWebhooksCreatePage,
  CreateWebhookFormFields,
  SSLVerificationEnum,
  BranchEvents,
  PREvents,
  TagEvents
} from '@harnessio/playground'
import { useNavigate } from 'react-router-dom'
import { useCreateWebhookMutation } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
export const CreateWebhookContainer = () => {
  const repo_ref = useGetRepoRef()
  const navigate = useNavigate()

  const {
    mutate: createWebHook,
    isLoading: creatingWebHook,
    error: createWebHookError
  } = useCreateWebhookMutation(
    { repo_ref: repo_ref },
    {
      onSuccess: () => {
        navigate(`../webhooks`)
      }
    }
  )

  const onSubmit = (data: CreateWebhookFormFields) => {
    const webhookRequest = {
      identifier: data.identifier,
      description: data.description,
      url: data.url,
      enabled: data.enabled,
      insecure: data.insecure === SSLVerificationEnum.DISABLED,
      triggers: ([] as (BranchEvents | TagEvents | PREvents)[]).concat(
        data.branchEvents ?? [],
        data.tagEvents ?? [],
        data.prEvents ?? []
      )
    }

    createWebHook({
      repo_ref: repo_ref,
      body: webhookRequest
    })
  }

  const onCancel = () => {
    navigate(`../webhooks`)
  }

  return (
    <>
      <RepoWebhooksCreatePage
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        apiError={createWebHookError ? createWebHookError.message : null}
        isLoading={creatingWebHook}
      />
    </>
  )
}
