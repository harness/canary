import { MoreActionsTooltip, NoData, Pagination, Spacer, StatusBadge, Switch, Table, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { WebhookType } from '@/views'

import { formatWebhookTriggers } from '../../utils'

export interface RepoWebhookListProps {
  webhooks: WebhookType[]
  error?: string
  isDirtyList: boolean
  handleReset: () => void
  totalItems: number
  pageSize: number
  page: number
  setPage: (val: number) => void
  openDeleteWebhookDialog: (id: number) => void
  handleEnableWebhook: (id: number, enabled: boolean) => void
  toRepoWebhookDetails?: ({ webhookId }: { webhookId: number }) => string
  toRepoWebhookCreate?: () => string
}

export function RepoWebhookList({
  webhooks,
  error,
  isDirtyList,
  handleReset,
  totalItems,
  pageSize,
  page,
  setPage,
  openDeleteWebhookDialog,
  handleEnableWebhook,
  toRepoWebhookDetails,
  toRepoWebhookCreate
}: RepoWebhookListProps) {
  const { t } = useTranslation()
  const { navigate } = useRouterContext()

  const handleNavigate = () => {
    if (toRepoWebhookCreate) {
      navigate(toRepoWebhookCreate())
    }
  }

  if (error) {
    return (
      <>
        <Spacer size={2} />
        <Text color="danger">{error || 'Something went wrong'}</Text>
      </>
    )
  }

  if (!webhooks.length) {
    return (
      <NoData
        withBorder
        textWrapperClassName="max-w-[350px]"
        imageName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-webhooks'}
        title={
          isDirtyList
            ? t('views:noData.noResults', 'No search results')
            : t('views:noData.noWebhooks', 'No webhooks yet')
        }
        description={[
          isDirtyList
            ? t(
                'views:noData.noResultsDescription',
                'No webhooks match your search. Try adjusting your keywords or filters.',
                {
                  type: 'webhooks'
                }
              )
            : t(
                'views:noData.noWebhooksDescription',
                'Add or manage webhooks to automate tasks and connect external services to your project.'
              )
        ]}
        primaryButton={
          isDirtyList
            ? {
                label: t('views:noData.clearFilters', 'Clear filters'),
                onClick: handleReset
              }
            : {
                label: t('views:webhookData.create', 'Create webhook'),
                onClick: handleNavigate
              }
        }
      />
    )
  }

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-2/3">Name</Table.Head>
            <Table.Head className="w-1/3">Execution</Table.Head>
            <Table.Head></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {webhooks.map(webhook => (
            <Table.Row
              to={toRepoWebhookDetails ? toRepoWebhookDetails({ webhookId: webhook.id }) : `${webhook.id}`}
              key={webhook.id}
            >
              <Table.Cell className="w-1/2 max-w-0 cursor-pointer pr-4">
                <Switch
                  checked={webhook.enabled}
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleEnableWebhook(webhook.id, !webhook.enabled)
                  }}
                  label={webhook.display_name}
                  caption={formatWebhookTriggers(webhook?.triggers)}
                  captionTooltip={formatWebhookTriggers(webhook?.triggers)}
                />
              </Table.Cell>
              <Table.Cell className="cursor-pointer content-center">
                <StatusBadge
                  variant="status"
                  theme={
                    webhook.latest_execution_result === 'success'
                      ? 'success'
                      : webhook.latest_execution_result === 'fatal_error' ||
                          webhook.latest_execution_result === 'retriable_error'
                        ? 'danger'
                        : 'muted'
                  }
                >
                  {webhook.latest_execution_result === 'success'
                    ? 'Success'
                    : webhook.latest_execution_result === 'fatal_error' ||
                        webhook.latest_execution_result === 'retriable_error'
                      ? 'Failed'
                      : 'Invalid'}
                </StatusBadge>
              </Table.Cell>

              <Table.Cell className="cursor-pointer content-center text-right">
                <MoreActionsTooltip
                  actions={[
                    {
                      title: t('views:webhookData.edit', 'Edit webhook'),
                      onClick: () =>
                        navigate(
                          toRepoWebhookDetails ? toRepoWebhookDetails({ webhookId: webhook.id }) : `${webhook.id}`
                        )
                    },
                    {
                      isDanger: true,
                      title: t('views:webhookData.delete', 'Delete webhook'),
                      onClick: () => openDeleteWebhookDialog(webhook.id)
                    }
                  ]}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
    </>
  )
}
