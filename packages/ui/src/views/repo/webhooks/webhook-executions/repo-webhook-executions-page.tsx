import { FC, useMemo } from 'react'

import {
  Badge,
  FormSeparator,
  NoData,
  PaginationComponent,
  SkeletonList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@/components'
import { SandboxLayout, TranslationStore, WebhookStore } from '@/views'
import { timeAgo } from '@utils/utils'

import { getBranchEvents, getPrEvents, getTagEvents } from '../webhook-create/components/create-webhook-form-data'

interface RepoWebhookExecutionsPageProps {
  useWebhookStore: () => WebhookStore
  useTranslationStore: () => TranslationStore
  toRepoWebhooks: (repoRef?: string) => string
  repo_ref: string
  isLoading: boolean
}
const RepoWebhookExecutionsPage: FC<RepoWebhookExecutionsPageProps> = ({
  useWebhookStore,
  useTranslationStore,
  toRepoWebhooks,
  repo_ref,
  isLoading
}) => {
  const { t } = useTranslationStore()
  const { executions, webhookExecutionPage, setWebhookExecutionPage, totalWebhookExecutionPages } = useWebhookStore()

  const events = useMemo(() => {
    return [...getBranchEvents(t), ...getTagEvents(t), ...getPrEvents(t)]
  }, [])

  return (
    <SandboxLayout.Main className="mx-0">
      <SandboxLayout.Content className="max-w-[812px] pl-0">
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
            <Table variant="asStackedList">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Last triggered at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map(execution => (
                  <TableRow key={execution.id}>
                    <TableCell>
                      <Text className="text-foreground-1" size={2}>{`#${execution.id}`}</Text>
                    </TableCell>
                    <TableCell>
                      {events.find(event => event.id === execution.trigger_type)?.event || execution.trigger_type}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      <Text size={2}>{timeAgo(execution.created)}</Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationComponent
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
