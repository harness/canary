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
import { useRouterContext, useTranslation } from '@/context'
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
  const { navigate } = useRouterContext()
  const events = useMemo(() => {
    return [...getBranchAndTagEvents(t), ...getPrEvents(t), ...getPrActivityEvents(t)]
  }, [t])

  return (
    <Layout.Vertical gap="xl" className="grow">
      <Layout.Grid gap="xs">
        <Text as="h1" variant="heading-section">
          Order Status Update Webhook
        </Text>
        <Text className="settings-form-width">
          This webhook triggers every time an order status is updated, sending data to the specified endpoint for
          real-time tracking.
        </Text>
      </Layout.Grid>
      <FormSeparator />
      <Layout.Grid gap="md">
        <Text as="h2" variant="heading-subsection" className="mb-4">
          Executions
        </Text>
        {isLoading ? (
          <Skeleton.List />
        ) : executions && executions.length > 0 ? (
          <>
            <Table.Root size="compact">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="w-[136px]">
                    <Text variant="caption-strong">ID</Text>
                  </Table.Head>
                  <Table.Head className="w-[462px]">
                    <Text variant="caption-strong">Event</Text>
                  </Table.Head>
                  <Table.Head className="w-[136px]">
                    <Text variant="caption-strong">Status</Text>
                  </Table.Head>
                  <Table.Head className="flex w-[176px] justify-end">
                    <Text variant="caption-strong">Last triggered at</Text>
                  </Table.Head>
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
                      <Text color="foreground-1">{`#${execution.id}`}</Text>
                    </Table.Cell>
                    <Table.Cell className="content-center">
                      {events.find(event => event.id === execution.trigger_type)?.event || execution.trigger_type}
                    </Table.Cell>
                    <Table.Cell className="content-center">
                      <StatusBadge
                        variant="status"
                        theme={
                          execution.result === 'success'
                            ? 'success'
                            : ['fatal_error', 'retriable_error'].includes(execution.result ?? '')
                              ? 'danger'
                              : 'muted'
                        }
                      >
                        {execution.result === 'success'
                          ? 'Success'
                          : ['fatal_error', 'retriable_error'].includes(execution.result ?? '')
                            ? 'Failed'
                            : 'Invalid'}
                      </StatusBadge>
                    </Table.Cell>
                    <Table.Cell className="relative text-right">
                      <TimeAgoCard timestamp={execution.created ?? Date.now()} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Pagination
              totalItems={totalItems}
              pageSize={pageSize}
              currentPage={webhookExecutionPage}
              goToPage={setWebhookExecutionPage}
            />
          </>
        ) : (
          <NoData
            withBorder
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
        )}
      </Layout.Grid>
    </Layout.Vertical>
  )
}

export { RepoWebhookExecutionsPage }
