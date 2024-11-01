import { useState } from 'react'
import { RepoWebhooksCreatePage, CreateWebhookFormFields, SSLVerificationEnum } from '@harnessio/playground'
import { useNavigate } from 'react-router-dom'
import { useCreateWebhookMutation, CreateWebhookErrorResponse } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
export const CreateWebhookContainer = () => {
  const repo_ref = useGetRepoRef()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const { mutate: createWebHook, isLoading: creatingWebHook } = useCreateWebhookMutation(
    { repo_ref: repo_ref },
    {
      onSuccess: () => {
        setApiError(null)
        navigate(`../webhooks`)
      },
      onError: (error: CreateWebhookErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError(message)
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
      triggers: [...(data.branchEvents ?? []), ...(data.tagEvents ?? []), ...(data.prEvents ?? [])]
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
        apiError={apiError}
        isLoading={creatingWebHook}
      />
    </>
  )
}
