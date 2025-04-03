import { Badge, MoreActionsTooltip, NoData, Pagination, Spacer, StackedList, Switch, Table, Text } from '@/components'
import { useRouterContext } from '@/context'
import { TranslationStore, WebhookType } from '@/views'

const Title = ({
  title,
  isEnabled,
  handleEnableWebhook,
  id
}: {
  id: number
  title: string
  isEnabled: boolean
  handleEnableWebhook: (id: number, enabled: boolean) => void
}) => (
  <div className="inline-flex items-center gap-2.5">
    <Switch
      checked={isEnabled}
      onClick={e => e.stopPropagation()}
      onCheckedChange={() => handleEnableWebhook(id, !isEnabled)}
    />
    <span className="font-medium">{title}</span>
  </div>
)

export interface RepoWebhookListProps {
  webhooks: WebhookType[]
  error?: string
  useTranslationStore: () => TranslationStore
  isDirtyList: boolean
  handleReset: () => void
  totalPages: number
  page: number
  setPage: (val: number) => void
  openDeleteWebhookDialog: (id: number) => void
  handleEnableWebhook: (id: number, enabled: boolean) => void
}

export function RepoWebhookList({
  webhooks,
  error,
  useTranslationStore,
  isDirtyList,
  handleReset,
  totalPages,
  page,
  setPage,
  openDeleteWebhookDialog,
  handleEnableWebhook
}: RepoWebhookListProps) {
  const { t } = useTranslationStore()
  const { navigate } = useRouterContext()

  const handleNavigate = () => {
    navigate('create')
  }

  if (error) {
    return (
      <>
        <Spacer size={2} />
        <Text size={1} className="text-destructive">
          {error || 'Something went wrong'}
        </Text>
      </>
    )
  }

  if (!webhooks.length) {
    return (
      <NoData
        withBorder
        textWrapperClassName="max-w-[350px]"
        iconName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-webhooks'}
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
      <Table.Root variant="asStackedList">
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Execution</Table.Head>
            <Table.Head></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {webhooks.map(webhook => (
            <Table.Row onClick={() => navigate(`${webhook.id}`)} key={webhook.id}>
              <Table.Cell>
                <StackedList.Item
                  key={webhook.id}
                  className="max-w-full cursor-pointer !p-0 py-3 pr-1.5"
                  isLast
                  disableHover
                >
                  <StackedList.Field
                    primary
                    description={
                      <Text className="ml-10 max-w-[500px]" truncate color="secondary">
                        {webhook?.triggers?.length
                          ? webhook.triggers
                              .map(trigger => trigger.replace(/_/g, ' ').replace(/\b\w/g, match => match.toUpperCase()))
                              .join(', ')
                          : 'All Events'}
                      </Text>
                    }
                    title={
                      <Title
                        title={webhook.display_name}
                        isEnabled={webhook.enabled}
                        id={webhook.id}
                        handleEnableWebhook={handleEnableWebhook}
                      />
                    }
                    className="max-w-full gap-1.5"
                  />
                </StackedList.Item>
              </Table.Cell>
              <Table.Cell className="cursor-pointer content-center">
                <Badge
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
                </Badge>
              </Table.Cell>

              <Table.Cell className="cursor-pointer content-center text-right">
                <MoreActionsTooltip
                  actions={[
                    {
                      title: t('views:webhookData.edit', 'Edit webhook'),
                      onClick: () => navigate(`${webhook.id}`)
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
      <Pagination totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
    </>
  )
}
