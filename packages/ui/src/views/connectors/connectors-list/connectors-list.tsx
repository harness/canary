import { Icon, NoData, SkeletonList, StackedList } from '@/components'
import { useRouterContext } from '@/context'
import { timeAgo } from '@utils/utils'
import { ExecutionStatus } from '@views/execution/execution-status'
import { TFunction } from 'i18next'

import { ConnectorItem } from '../types'
import { TranslationStore } from './types'

interface RoutingProps {
  toConnectorDetails: (connector: ConnectorItem) => string
}

interface PageProps extends Partial<RoutingProps> {
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

const Pipe = (): JSX.Element => <span className="pointer-events-none h-3.5 w-px bg-borders-2" aria-hidden />

const LastUpdated = ({ lastModifiedAt, t }: { lastModifiedAt: number; t: TFunction }): JSX.Element => (
  <div className="inline-flex items-center gap-1">
    <Title title={t('views:repos.updated', 'Updated')} />
    {timeAgo(lastModifiedAt)}
  </div>
)

export function ConnectorsList({
  connectors,
  useTranslationStore,
  isLoading,
  toConnectorDetails
}: PageProps): JSX.Element {
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
      {connectors.map((item, idx) => {
        const { connector, status, lastModifiedAt } = item
        const isLastItem = idx === connectors.length - 1
        const connectorId = connector?.identifier

        return (
          <Link
            key={connectorId}
            to={toConnectorDetails?.(item) || ''}
            className={isLastItem ? 'border-b border-background-3' : ''}
          >
            <StackedList.Item
              thumbnail={<Icon name="github" size={20} className="text-foreground-5" />}
              isLast={isLastItem}
            >
              <StackedList.Field
                primary
                description={
                  <div className="flex items-center gap-1">
                    {connector?.description ? (
                      <>
                        <span className="max-w-full truncate">{connector.description}</span>
                        <Pipe />
                      </>
                    ) : null}
                    {lastModifiedAt ? <LastUpdated lastModifiedAt={lastModifiedAt} t={t} /> : null}
                  </div>
                }
                title={<Title title={connector?.name ?? ''} />}
                className="flex max-w-[80%] gap-1.5 text-wrap"
              />
              {status?.status && (
                <StackedList.Field
                  right
                  title={status?.status ? <ExecutionStatus.Badge status={status.status} /> : null}
                  description={status?.lastTestedAt ? timeAgo(status.lastTestedAt) : null}
                />
              )}
            </StackedList.Item>
          </Link>
        )
      })}
    </StackedList.Root>
  )
}
