import { useEffect } from 'react'

import { useListRepoWebhookExecutionsQuery } from '@harnessio/code-service-client'
import { useRouterContext } from '@harnessio/ui/context'
import { RepoWebhookExecutionsPage, WebhookExecutionType } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { useWebhookStore } from './stores/webhook-store'

export const WebhookExecutionsContainer = () => {
  const repo_ref = useGetRepoRef()
  const routes = useRoutes()
  const { useParams } = useRouterContext()
  const { repoId, webhookId } = useParams<PathParams>()
  const spaceId = useGetSpaceURLParam()
  const { webhookExecutionPage, setWebhookExecutionPage, setExecutions, setTotalWebhookExecutionPages } =
    useWebhookStore()

  const { queryPage } = usePaginationQueryStateWithStore({
    page: webhookExecutionPage,
    setPage: setWebhookExecutionPage
  })

  const { data: { body: executions, headers } = {}, isLoading } = useListRepoWebhookExecutionsQuery(
    {
      repo_ref,
      webhook_identifier: parseInt(webhookId ?? ''),
      queryParams: {
        page: queryPage
      }
    },
    { enabled: !!webhookId }
  )

  useEffect(() => {
    if (executions && headers) {
      setExecutions(executions as WebhookExecutionType[])
      setTotalWebhookExecutionPages(headers)
    }
  }, [executions, setExecutions])

  return (
    <RepoWebhookExecutionsPage
      useTranslationStore={useTranslationStore}
      useWebhookStore={useWebhookStore}
      toRepoWebhooks={() => routes.toRepoWebhooks({ webhookId })}
      repo_ref={repo_ref}
      isLoading={isLoading}
      toRepoWebhookExecutionDetails={(executionId: string) =>
        routes.toRepoWebhookExecutionDetails({ spaceId, repoId, webhookId, executionId })
      }
    />
  )
}
