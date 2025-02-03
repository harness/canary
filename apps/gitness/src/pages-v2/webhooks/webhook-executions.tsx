import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useListRepoWebhookExecutionsQuery } from '@harnessio/code-service-client'
import { RepoWebhookExecutionsPage, WebhookExecutionType } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { useWebhookStore } from './stores/webhook-store'

export const WebhookExecutionsContainer = () => {
  const repo_ref = useGetRepoRef()
  const { webhookId } = useParams<PathParams>()
  const { setExecutions } = useWebhookStore()

  const { data: { body: executions, headers } = {} } = useListRepoWebhookExecutionsQuery(
    {
      repo_ref,
      webhook_identifier: parseInt(webhookId ?? ''),
      queryParams: {}
    },
    { enabled: !!webhookId }
  )

  useEffect(() => {
    setExecutions(executions as WebhookExecutionType[])
  }, [executions, setExecutions])

  return <RepoWebhookExecutionsPage useTranslationStore={useTranslationStore} useWebhookStore={useWebhookStore} />
}
