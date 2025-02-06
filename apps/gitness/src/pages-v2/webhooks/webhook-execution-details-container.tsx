import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  useGetRepoWebhookExecutionQuery,
  useRetriggerRepoWebhookExecutionMutation
} from '@harnessio/code-service-client'
import { RepoWebhookExecutionDetailsPage, WebhookExecutionType } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { useWebhookStore } from './stores/webhook-store'

export const WebhookExecutionDetailsContainer = () => {
  const { webhookId, executionId } = useParams<PathParams>()
  const repo_ref = useGetRepoRef()
  const { setExecutionId, updateExecution } = useWebhookStore()

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

  const { mutate: retriggerExecution } = useRetriggerRepoWebhookExecutionMutation({})

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
      isLoading={false}
      handleRetriggerExecution={handleRetriggerExecution}
    />
  )
}
