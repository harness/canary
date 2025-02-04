import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useGetRepoWebhookExecutionQuery,
  useRetriggerRepoWebhookExecutionMutation
} from '@harnessio/code-service-client'
import { RepoWebhookExecutionDetailsPage, WebhookExecutionType } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { useWebhookStore } from './stores/webhook-store'

export const WebhookExecutionDetailsContainer = () => {
  const { repoId, spaceId, webhookId, executionId } = useParams<PathParams>()
  const repo_ref = useGetRepoRef()
  const { setExecutionId, updateExecution } = useWebhookStore()
  const navigate = useNavigate()
  const routes = useRoutes()

  useEffect(() => {
    setExecutionId(parseInt(executionId ?? ''))
  }, [setExecutionId, executionId])

  const { data: { body: execution } = {} } = useGetRepoWebhookExecutionQuery(
    {
      repo_ref: repo_ref ?? '',
      webhook_identifier: parseInt(webhookId ?? ''),
      webhook_execution_id: parseInt(executionId ?? ''),
      queryParams: {}
    },
    {
      enabled: !!repo_ref && !!webhookId && !!executionId
    }
  )

  const { mutate: retriggerExecution, isLoading: isTriggeringExecution } = useRetriggerRepoWebhookExecutionMutation(
    {},
    {
      onSuccess: data => {
        updateExecution(data.body as WebhookExecutionType)
        navigate(routes.toRepoWebhookExecutionDetails({ spaceId, repoId, webhookId, executionId: `${data.body.id}` }))
      }
    }
  )

  useEffect(() => {
    if (execution) {
      updateExecution(execution as WebhookExecutionType)
    }
  }, [execution, updateExecution])

  const handleRetriggerExecution = () => {
    retriggerExecution({
      repo_ref: repo_ref ?? '',
      webhook_identifier: parseInt(webhookId ?? ''),
      webhook_execution_id: parseInt(executionId ?? '')
    })
  }

  return (
    <RepoWebhookExecutionDetailsPage
      useWebhookStore={useWebhookStore}
      useTranslationStore={useTranslationStore}
      isLoading={isTriggeringExecution}
      handleRetriggerExecution={handleRetriggerExecution}
    />
  )
}
