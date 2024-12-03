import { Badge, NoData, Spacer, StackedList, Text } from '@/components'

import { WebhookType } from './types'

export interface PageProps {
  webhooks?: WebhookType[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
  handleResetFilters?: () => void
  hasActiveFilters?: boolean
  query?: string
  handleResetQuery: () => void
  handleNavigate: () => void
  loading: boolean
  error?: string
}

const Title = ({ title, isEnabled }: { title: string; isEnabled: boolean }) => (
  <div className="inline-flex items-center gap-2.5">
    {title}
    <Badge size="sm" disableHover borderRadius="full" theme={isEnabled ? 'success' : 'muted'}>
      {isEnabled ? 'Enabled' : 'Disabled'}
    </Badge>
  </div>
)

export function RepoWebhookList({
  webhooks,
  LinkComponent,
  handleResetFilters,
  hasActiveFilters,
  query,
  handleResetQuery,
  handleNavigate,
  error
}: PageProps) {
  const renderListContent = () => {
    if (webhooks?.length === 0) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center py-20">
          {hasActiveFilters || query ? (
            <NoData
              iconName="no-search-magnifying-glass"
              title="No search results"
              description={['Check your spelling and filter options,', 'or search for a different keyword.']}
              primaryButton={{
                label: 'Clear search',
                onClick: handleResetQuery
              }}
              secondaryButton={{
                label: 'Clear filters',
                onClick: handleResetFilters
              }}
            />
          ) : (
            <NoData
              iconName="no-data-folder"
              title="No webhooks yet"
              description={['There are no webhooks in this project yet.', 'Create new webhooks.']}
              primaryButton={{
                label: 'Create webhook',
                onClick: handleNavigate
              }}
            />
          )}
        </div>
      )
    } else if (error) {
      return (
        <>
          <Spacer size={2} />
          <Text size={1} className="text-destructive">
            {error || 'Something went wrong'}
          </Text>
        </>
      )
    }
    return (
      <>
        {webhooks?.map((webhook, webhook_idx) => (
          <LinkComponent key={`${webhook.name}-${webhook_idx}`} to={webhook.name}>
            <StackedList.Item key={webhook.name} isLast={webhooks.length - 1 === webhook_idx}>
              <StackedList.Field
                primary
                description={webhook.description}
                title={<Title title={webhook.name} isEnabled={webhook.enabled} />}
                className="gap-1.5"
              />
              <StackedList.Field
                title={
                  <>
                    Updated <em>{webhook.createdAt}</em>
                  </>
                }
                right
                label
                secondary
              />
            </StackedList.Item>
          </LinkComponent>
        ))}
      </>
    )
  }

  return (
    <>
      <StackedList.Root>{renderListContent()}</StackedList.Root>
    </>
  )
}
