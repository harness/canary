import { useNavigate } from 'react-router-dom'

import {
  Badge,
  MoreActionsTooltip,
  NoData,
  PaginationComponent,
  Spacer,
  StackedList,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@/components'
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
  const navigate = useNavigate()

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
      <Table variant="asStackedList">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Execution</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.map(webhook => (
            <TableRow onClick={() => navigate(`${webhook.id}`)} key={webhook.id}>
              <TableCell>
                <StackedList.Item key={webhook.id} className="max-w-full cursor-pointer !p-0 py-3 pr-1.5" isLast>
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
              </TableCell>
              <TableCell className="content-center">
                <Badge
                  size="md"
                  disableHover
                  borderRadius="full"
                  theme={
                    webhook.latest_execution_result === 'success'
                      ? 'success'
                      : webhook.latest_execution_result === 'fatal_error' ||
                          webhook.latest_execution_result === 'retriable_error'
                        ? 'destructive'
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
              </TableCell>

              <TableCell className="content-center text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
    </>
  )
}
