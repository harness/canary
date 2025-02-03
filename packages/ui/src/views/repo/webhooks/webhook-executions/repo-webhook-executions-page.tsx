import { FC, useMemo } from 'react'

import {
  Badge,
  Button,
  FormSeparator,
  FormWrapper,
  ListActions,
  SearchBox,
  SkeletonList,
  Spacer,
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
}
const RepoWebhookExecutionsPage: FC<RepoWebhookExecutionsPageProps> = ({ useWebhookStore, useTranslationStore }) => {
  const { t } = useTranslationStore()
  const { executions } = useWebhookStore()

  const events = useMemo(() => {
    return [...getBranchEvents(t), ...getTagEvents(t), ...getPrEvents(t)]
  }, [])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content maxWidth="2xl">
        <h1 className="text-2xl font-medium text-foreground-1 mb-4">Order Status Update Webhook</h1>
        <Text>
          This webhook triggers every time an order status is updated, sending data to the specified endpoint for
          real-time tracking.
        </Text>
        {/* <Spacer size={6} /> */}
        <FormSeparator className="my-6" />
        <h1 className="text-xl font-medium text-foreground-1 mb-4">Executions</h1>
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
            {executions &&
              executions.map((execution: any) => (
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
                          : execution.result === 'fatal_error' || execution.result === 'retriable_error'
                            ? 'destructive'
                            : 'muted'
                      }
                    >
                      {execution.result === 'success'
                        ? 'Success'
                        : execution.result === 'fatal_error' || execution.result === 'retriable_error'
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
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { RepoWebhookExecutionsPage }
