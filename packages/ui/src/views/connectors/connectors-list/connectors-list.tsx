import { Icon, NoData, SkeletonList, StackedList } from '@/components'
import { useRouterContext } from '@/context'
import { ExecutionStatus } from '@views/execution/execution-status'
import { formatDistanceToNow } from 'date-fns'

import { ConnectorItem } from '../types'
import { TranslationStore } from './types'

interface PageProps {
  connectors: ConnectorItem[]
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  onEditConnector: (connector: ConnectorItem) => void
}

const Title = ({ title }: { title: string }): JSX.Element => (
  <div className="inline-flex items-center gap-2.5">
    <span className="max-w-full truncate font-medium">{title}</span>
  </div>
)

export function ConnectorsList({ connectors, useTranslationStore, isLoading }: PageProps): JSX.Element {
  const { Link } = useRouterContext()
  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (!connectors.length) {
    return (
      <NoData
        withBorder
        iconName="no-data-cog"
        title={t('views:noData.noConnectors', 'No connectors yet')}
        description={[
          t('views:noData.noConnectorsProject', 'There are no connectors in this project yet.'),
          t('views:noData.createOrImportConnectors', 'Create new or import an existing connector.')
        ]}
      />
    )
  }

  return (
    <StackedList.Root>
      {connectors.map(({ connector, status, lastModifiedAt }, idx) => {
        const isLastItem = idx === connectors.length - 1
        const connectorId = connector?.identifier
        const connectorName = connector?.name ?? ''
        const connectorDescription = connector?.description

        return (
          <Link
            key={connectorId}
            to={`/connectors/${connectorId}`}
            className={isLastItem ? 'border-b border-background-3' : ''}
          >
            <StackedList.Item
              thumbnail={<Icon name="github-actions" size={16} className="text-foreground-5" />}
              isLast={isLastItem}
            >
              <StackedList.Field
                primary
                description={<span className="max-w-full truncate">{connectorDescription}</span>}
                title={<Title title={connectorName} />}
                className="flex max-w-[80%] gap-1.5 text-wrap"
              />
              {lastModifiedAt ? (
                <StackedList.Field
                  title={
                    <div className="inline-flex items-center gap-1">
                      <Title title={t('component:sort.lastUpdated', 'Last updated')} />
                      <span className="max-w-full truncate">
                        {formatDistanceToNow(lastModifiedAt, { addSuffix: true })}
                      </span>
                    </div>
                  }
                  className="flex max-w-[80%] gap-1.5 text-wrap"
                />
              ) : null}
              {status?.status && (
                <StackedList.Field
                  right
                  title={<ExecutionStatus.Badge status={status.status} />}
                  description={status.lastTestedAt ? formatDistanceToNow(status.lastTestedAt, { addSuffix: true }) : ''}
                />
              )}
            </StackedList.Item>
          </Link>
        )
      })}
    </StackedList.Root>
  )
}
