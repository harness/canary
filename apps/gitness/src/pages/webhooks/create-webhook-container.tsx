import { useState } from 'react'
import { RepoWebhooksCreatePage, CreateWebhookFormFields, SSLVerificationEnum } from '@harnessio/playground'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateWebhookMutation, useGetWebhookQuery } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
export const CreateWebhookContainer = () => {
  const repo_ref = useGetRepoRef()
  const navigate = useNavigate()
  const { webhookId } = useParams()

  const [preSetWebhookData, setPreSetWebhookData] = useState<CreateWebhookFormFields | null>(null)

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

  useGetWebhookQuery(
    {
      repo_ref,
      webhook_identifier: Number(webhookId)
    },
    {
      onSuccess: ({ body: data }) => {
        console.log(data)
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
      triggers: data.triggers
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
