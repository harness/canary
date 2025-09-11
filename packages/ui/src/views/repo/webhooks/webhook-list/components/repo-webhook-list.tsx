import { useCallback } from 'react'

import { Layout, MoreActionsTooltip, StatusBadge, Switch, Table, Text, useCustomDialogTrigger } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { WebhookType } from '@/views'

import { formatWebhookTriggers } from '../../utils'

export interface RepoWebhookListProps {
  webhooks: WebhookType[]
  openDeleteWebhookDialog: (id: number) => void
  handleEnableWebhook: (id: number, enabled: boolean) => void
  toRepoWebhookDetails?: ({ webhookId }: { webhookId: number }) => string
}

export function RepoWebhookList({
  webhooks,
  openDeleteWebhookDialog,
  handleEnableWebhook,
  toRepoWebhookDetails
}: RepoWebhookListProps) {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const handleDeleteWebhook = useCallback(
    (webhookId: number) => {
      registerTrigger()
      openDeleteWebhookDialog(webhookId)
    },
    [openDeleteWebhookDialog, registerTrigger]
  )

  return (
    <>
      <Table.Root className="table-fixed" size="compact">
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-[52px]"></Table.Head>
            <Table.Head hideDivider>Name</Table.Head>
            <Table.Head className="w-1/5">Execution</Table.Head>
            <Table.Head className="w-[68px]"></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {webhooks.map(webhook => {
            const isSuccess = webhook.latest_execution_result === 'success'
            const isError = ['fatal_error', 'retriable_error'].includes(webhook.latest_execution_result ?? '')
            const webhooksUrl = toRepoWebhookDetails ? toRepoWebhookDetails({ webhookId: webhook.id }) : `${webhook.id}`
            return (
              <Table.Row to={webhooksUrl} key={webhook.id}>
                <Table.Cell className="!pr-0">
                  <Switch checked={webhook.enabled} onClick={() => handleEnableWebhook(webhook.id, !webhook.enabled)} />
                </Table.Cell>

                <Table.Cell>
                  <Layout.Flex className="w-full" direction="column" gap="4xs">
                    <Text color="foreground-1" truncate>
                      {webhook.display_name}
                    </Text>
                    <Text>{formatWebhookTriggers(webhook?.triggers)}</Text>
                  </Layout.Flex>
                </Table.Cell>

                <Table.Cell>
                  <StatusBadge variant="status" theme={isSuccess ? 'success' : isError ? 'danger' : 'muted'}>
                    {isSuccess ? 'Success' : isError ? 'Failed' : 'Waiting'}
                  </StatusBadge>
                </Table.Cell>

                <Table.Cell>
                  <MoreActionsTooltip
                    ref={triggerRef}
                    iconName="more-horizontal"
                    actions={[
                      {
                        title: t('views:webhookData.edit', 'Edit Webhook'),
                        iconName: 'edit-pencil',
                        onClick: () => navigate(webhooksUrl)
                      },
                      {
                        isDanger: true,
                        iconName: 'trash',
                        title: t('views:webhookData.delete', 'Delete Webhook'),
                        onClick: () => handleDeleteWebhook(webhook.id)
                      }
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </>
  )
}
