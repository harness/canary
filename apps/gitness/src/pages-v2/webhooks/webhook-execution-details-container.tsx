import { useParams } from 'react-router-dom'

import { useGetRepoWebhookExecutionQuery } from '@harnessio/code-service-client'
import { RepoWebhookExecutionDetailsPage } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { decodeGitContent } from '../../utils/git-utils'
import { useWebhookStore } from './stores/webhook-store'

export const WebhookExecutionDetailsContainer = () => {
  const { webhookId, executionId } = useParams<PathParams>()
  const repo_ref = useGetRepoRef()
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
  console.log('execution', execution)
  return (
    <RepoWebhookExecutionDetailsPage
      useWebhookStore={useWebhookStore}
      execution={decodeGitContent(execution?.request?.body)}
      useTranslationStore={useTranslationStore}
      isLoading={false}
    />
  )
}
