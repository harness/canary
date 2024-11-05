import { useState } from 'react'
import {
  RepoWebhooksCreatePage,
  CreateWebhookFormFields,
  SSLVerificationEnum,
  WebhookTriggerEnum,
  TriggerEventsEnum
} from '@harnessio/playground'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateWebhookMutation, useGetWebhookQuery, useUpdateWebhookMutation } from '@harnessio/code-service-client'
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

  const {
    mutate: updateWebHook,
    isLoading: updatingWebHook,
    error: updateWebhookError
  } = useUpdateWebhookMutation(
    { repo_ref: repo_ref, webhook_identifier: Number(webhookId) },
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
        setPreSetWebhookData({
          identifier: data.identifier || '',
          description: data.description,
          url: data.url || '',
          enabled: data.enabled || false,
          insecure: data.insecure ? SSLVerificationEnum.DISABLED : SSLVerificationEnum.ENABLE,
          trigger: data?.triggers?.length ? TriggerEventsEnum.SELECTED_EVENTS : TriggerEventsEnum.ALL_EVENTS,
          triggers: (data.triggers as WebhookTriggerEnum[]) || []
        })
      },
      enabled: !!webhookId
    }
  )

  const onSubmit = (data: CreateWebhookFormFields) => {
    const webhookRequest = {
      identifier: data.identifier,
      display_name: data.identifier,
      description: data.description,
      url: data.url,
      enabled: data.enabled,
      insecure: data.insecure === SSLVerificationEnum.DISABLED,
      triggers: data.triggers
    }

    if (webhookId) {
      updateWebHook({
        repo_ref: repo_ref,
        webhook_identifier: Number(webhookId),
        body: webhookRequest
      })
    } else {
      createWebHook({
        repo_ref: repo_ref,
        body: webhookRequest
      })
    }
  }

  const onCancel = () => {
    navigate(`../webhooks`)
  }

  const apiError = createWebHookError?.message || updateWebhookError?.message || null

  return (
    <>
      <RepoWebhooksCreatePage
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        apiError={apiError}
        isLoading={creatingWebHook || updatingWebHook}
        preSetWebHookData={preSetWebhookData}
      />
    </>
  )
}
