import { FC, useMemo } from 'react'

import {
  FormSeparator,
  Layout,
  NoData,
  Pagination,
  Skeleton,
  StatusBadge,
  Table,
  Text,
  TimeAgoCard
} from '@/components'
import { useTranslation } from '@/context'
import { WebhookStore } from '@/views'

import {
  getBranchAndTagEvents,
  getPrActivityEvents,
  getPrEvents
} from '../webhook-create/components/create-webhook-form-data'

interface RepoWebhookExecutionsPageProps {
  useWebhookStore: () => WebhookStore
  isLoading: boolean
  toRepoWebhookExecutionDetails: (executionId: string) => string
}

const RepoWebhookExecutionsPage: FC<RepoWebhookExecutionsPageProps> = ({
  useWebhookStore,
  isLoading,
  toRepoWebhookExecutionDetails
}) => {
  const { t } = useTranslation()
  const { executions, webhookExecutionPage, setWebhookExecutionPage, totalItems, pageSize } = useWebhookStore()
  const events = useMemo(() => {
    return [...getBranchAndTagEvents(t), ...getPrEvents(t), ...getPrActivityEvents(t)]
  }, [t])

  const hasExecutions = !isLoading && !!executions?.length

  if (!hasExecutions) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-cog"
        title={t('views:noData.noWebhookExecution', 'No webhook executions yet')}
        description={[
          t(
            'views:noData.noWebhookExecutionsDescription',
            "Your webhook executions will appear here once they're completed. Trigger your webhook to see results."
          )
        ]}
      />
    )
  }

  return (
    <Layout.Vertical gap="xl" grow>
      <Layout.Grid gap="xs">
        <Text as="h1" variant="heading-section">
          {t('views:repos.editWebhookTitle', 'Order Status Update Webhook')}
        </Text>
        <Text className="settings-form-width">
          {t(
            'views:webhookData.editWebhookDescription',
            'This webhook triggers every time an order status is updated, sending data to the specified endpoint for real-time tracking'
          )}
        </Text>
      </Layout.Grid>
      <FormSeparator />
      <Layout.Vertical grow>
        <Text as="h2" variant="heading-subsection">
          {t('views:repos.webhookExecutions.title', 'Executions')}
        </Text>
        {isLoading && <Skeleton.List />}
        {hasExecutions && (
          <div>
            <Table.Root size="compact">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="w-32">{t('views:repos.webhookExecutions.table.id', 'ID')}</Table.Head>
                  <Table.Head>{t('views:repos.webhookExecutions.table.event', 'Event')}</Table.Head>
                  <Table.Head className="w-1/6">{t('views:repos.webhookExecutions.table.status', 'Status')}</Table.Head>
                  <Table.Head className="w-1/5" containerProps={{ justify: 'end' }}>
                    {t('views:repos.webhookExecutions.table.lastTriggeredAt', 'Last triggered at')}
                  </Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {executions.map(execution => {
                  const isSuccess = execution.result === 'success'
                  const isError = ['fatal_error', 'retriable_error'].includes(execution.result ?? '')
                  const executionEvent =
                    events.find(event => event.id === execution.trigger_type)?.event || execution.trigger_type
                  return (
                    <Table.Row key={execution.id} to={toRepoWebhookExecutionDetails(`${execution.id}`)}>
                      <Table.Cell>
                        <Text>{`#${execution.id}`}</Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Text>{executionEvent}</Text>
                      </Table.Cell>

                      <Table.Cell>
                        <StatusBadge variant="status" theme={isSuccess ? 'success' : isError ? 'danger' : 'muted'}>
                          {isSuccess
                            ? t('views:repos.webhookExecutions.table.success', 'Success')
                            : isError
                              ? t('views:repos.webhookExecutions.table.failed', 'Failed')
                              : t('views:repos.webhookExecutions.table.invalid', 'Invalid')}
                        </StatusBadge>
                      </Table.Cell>

                      <Table.Cell className="relative" linkProps={{ className: 'justify-end' }}>
                        <TimeAgoCard timestamp={execution.created ?? Date.now()} />
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table.Root>
            <Pagination
              totalItems={totalItems}
              pageSize={pageSize}
              currentPage={webhookExecutionPage}
              goToPage={setWebhookExecutionPage}
            />
          </div>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export { RepoWebhookExecutionsPage }
