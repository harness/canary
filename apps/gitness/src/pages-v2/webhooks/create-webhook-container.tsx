import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useCreateRepoWebhookMutation,
  useGetRepoWebhookQuery,
  useUpdateRepoWebhookMutation
} from '@harnessio/code-service-client'
import { SkeletonForm } from '@harnessio/ui/components'
import {
  CreateWebhookFormFields,
  NotFoundPage,
  RepoWebhooksCreatePage,
  SSLVerificationEnum,
  TriggerEventsEnum,
  WebhookTriggerEnum
} from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PathParams } from '../../RouteDefinitions'
import { useWebhookStore } from './stores/webhook-store'

export const CreateWebhookContainer = () => {
  const routes = useRoutes()
  const repo_ref = useGetRepoRef()
  const navigate = useNavigate()
  const { spaceId, repoId, webhookId } = useParams<PathParams>()

  const { setPreSetWebhookData } = useWebhookStore()

  useEffect(() => {
    if (!webhookId) {
      setPreSetWebhookData(null)
    }
  }, [setPreSetWebhookData, webhookId])

  const {
    mutate: createWebHook,
    isLoading: creatingWebHook,
    error: createWebHookError
  } = useCreateRepoWebhookMutation(
    { repo_ref: repo_ref },
    {
      onSuccess: () => {
        navigate(routes.toRepoWebhooks({ spaceId, repoId }))
      }
    }
  )

  const {
    mutate: updateWebHook,
    isLoading: updatingWebHook,
    error: updateWebhookError
  } = useUpdateRepoWebhookMutation(
    { repo_ref: repo_ref, webhook_identifier: Number(webhookId) },
    {
      onSuccess: () => {
        navigate(routes.toRepoWebhooks({ spaceId, repoId }))
      }
    }
  )

  const { data: { body: webhookData } = {}, isLoading: getWebhookIsLoading } = useGetRepoWebhookQuery(
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

  useEffect(() => {
    if (webhookData) {
      setPreSetWebhookData({
        identifier: webhookData.identifier || '',
        description: webhookData.description,
        url: webhookData.url || '',
        enabled: webhookData.enabled || false,
        insecure: webhookData.insecure ? SSLVerificationEnum.DISABLED : SSLVerificationEnum.ENABLE,
        trigger: webhookData?.triggers?.length ? TriggerEventsEnum.SELECTED_EVENTS : TriggerEventsEnum.ALL_EVENTS,
        triggers: (webhookData.triggers as WebhookTriggerEnum[]) || []
      })
    }
  }, [webhookData, setPreSetWebhookData])

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
    navigate(routes.toRepoWebhooks({ spaceId, repoId }))
  }

  const apiError = createWebHookError?.message || updateWebhookError?.message || null

  if (!!webhookId && getWebhookIsLoading) {
    return <SkeletonForm className="mt-7" />
  }

  if (!!webhookId && !webhookData) return <NotFoundPage pageTypeText="webhooks" />

  return (
    <>
      <RepoWebhooksCreatePage
        onFormSubmit={onSubmit}
        onFormCancel={onCancel}
        apiError={apiError}
        isLoading={creatingWebHook || updatingWebHook}
        useWebhookStore={useWebhookStore}
      />
    </>
  )
}
