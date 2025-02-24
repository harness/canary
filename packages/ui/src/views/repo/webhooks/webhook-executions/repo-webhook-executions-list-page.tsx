import { FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Badge, FormSeparator, NoData, Pagination, SkeletonList, Table, Text } from '@/components'
import { SandboxLayout, TranslationStore, WebhookStore } from '@/views'
import { timeAgo } from '@utils/utils'

import { getBranchEvents, getPrEvents, getTagEvents } from '../webhook-create/components/create-webhook-form-data'

interface RepoWebhookExecutionsPageProps {
  useWebhookStore: () => WebhookStore
  useTranslationStore: () => TranslationStore
  toRepoWebhooks: (repoRef?: string) => string
  repo_ref: string
  isLoading: boolean
  toRepoWebhookExecutionDetails: (executionId: string) => string
}

const RepoWebhookExecutionsPage: FC<RepoWebhookExecutionsPageProps> = ({
  useWebhookStore,
  useTranslationStore,
  toRepoWebhooks,
  repo_ref,
  isLoading,
  toRepoWebhookExecutionDetails
}) => {
  const { t } = useTranslationStore()
  const { executions, webhookExecutionPage, setWebhookExecutionPage, totalWebhookExecutionPages } = useWebhookStore()
  const navigate = useNavigate()
  const events = useMemo(() => {
    return [...getBranchEvents(t), ...getTagEvents(t), ...getPrEvents(t)]
  }, [])

  return (
    <SandboxLayout.Main className="mx-0">
      <SandboxLayout.Content className="pl-0">
        <h1 className="mb-4 text-2xl font-medium text-foreground-1">Order Status Update Webhook</h1>
        <Text>
          This webhook triggers every time an order status is updated, sending data to the specified endpoint for
          real-time tracking.
        </Text>
        <FormSeparator className="my-6" />
        <h1 className="mb-4 text-xl font-medium text-foreground-1">Executions</h1>
        {isLoading ? (
          <SkeletonList />
        ) : executions && executions.length > 0 ? (
          <>
            <Table.Root variant="asStackedList">
              <Table.Header>
                <Table.Row>
                  <Table.Head>ID</Table.Head>
                  <Table.Head>Event</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head className="text-right">Last triggered at</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {executions.map(execution => (
                  <Table.Row
                    key={execution.id}
                    onClick={() => navigate(toRepoWebhookExecutionDetails(`${execution.id}`))}
                    className="cursor-pointer"
                  >
                    <Table.Cell className="content-center">
                      <Text className="text-foreground-1" size={2}>{`#${execution.id}`}</Text>
                    </Table.Cell>
                    <Table.Cell className="content-center">
                      {events.find(event => event.id === execution.trigger_type)?.event || execution.trigger_type}
                    </Table.Cell>
                    <Table.Cell className="content-center">
                      <Badge
                        size="md"
                        disableHover
                        borderRadius="full"
                        theme={
                          execution.result === 'success'
                            ? 'success'
                            : ['fatal_error', 'retriable_error'].includes(execution.result ?? '')
                              ? 'destructive'
                              : 'muted'
                        }
                      >
                        {execution.result === 'success'
                          ? 'Success'
                          : ['fatal_error', 'retriable_error'].includes(execution.result ?? '')
                            ? 'Failed'
                            : 'Invalid'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="relative text-right">{timeAgo(execution.created ?? Date.now())}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Pagination
              totalPages={totalWebhookExecutionPages}
              currentPage={webhookExecutionPage}
              goToPage={setWebhookExecutionPage}
              t={t}
            />
          </>
        ) : (
          <NoData
            withBorder
            textWrapperClassName="max-w-[350px]"
            iconName="no-data-cog"
            title={t('views:noData.noWebhookExecution', 'No webhook executions yet')}
            description={[
              t(
                'views:noData.noWebhookExecutionsDescription',
                "Your webhook executions will appear here once they're completed. Trigger your webhook to see results."
              )
            ]}
            primaryButton={{
              label: t('views:webhookData.create', 'Create webhook'),
              to: `${toRepoWebhooks(repo_ref)}/create`
            }}
          />
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { RepoWebhookExecutionsPage }
