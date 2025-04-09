import { Button, Icon, Logo, MoreActionsTooltip, NoData, SkeletonList, SkeletonTable, Table, Text } from '@/components'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/utils'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorListItem, ConnectorListProps } from './types'
import { ConnectorTypeToLogoNameMap } from './utils'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="max-w-full truncate font-medium">{title}</span>
)

const ConnectivityStatus = ({ item }: { item: ConnectorListItem }): JSX.Element => {
  const isSuccess = item?.status?.toLowerCase() === ExecutionState.SUCCESS.toLowerCase()
  return (
    <div className="inline-flex items-center gap-2">
      <Icon name="dot" size={8} className={cn(isSuccess ? 'text-icons-success' : 'text-icons-danger')} />
      <Text>{isSuccess ? 'Success' : 'Failed'}</Text>
    </div>
  )
}

export function ConnectorsList({
  connectors,
  useTranslationStore,
  isLoading,
  toConnectorDetails,
  onDeleteConnector,
  onToggleFavoriteConnector
}: ConnectorListProps): JSX.Element {
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
          t('views:noData.noConnectors', 'There are no connectors in this project yet.'),
          t('views:noData.createConnector', 'Create new connector.')
        ]}
      />
    )
  }

  return (
    <Table.Root
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      variant="asStackedList"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-96">{t('views:connectors.id', 'Connector ID')}</Table.Head>
          <Table.Head className="w-96">Details</Table.Head>
          <Table.Head className="w-44 whitespace-nowrap">Connectivity status</Table.Head>
          <Table.Head className="w-44">Last updated</Table.Head>
          <Table.Head className="w-8" />
          <Table.Head className="w-8" />
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {connectors.map(({ identifier, type, spec, status, lastModifiedAt, isFavorite }) => {
            const connectorLogo = type ? ConnectorTypeToLogoNameMap.get(type) : undefined
            return (
              <Table.Row
                key={identifier}
                className="cursor-pointer"
                onClick={() => toConnectorDetails?.({ identifier, type, spec, status, lastModifiedAt })}
              >
                <Table.Cell className="max-w-80 content-center truncate">
                  <div className="flex items-center gap-2.5">
                    <div className="min-w-[40px]">
                      {connectorLogo ? <Logo name={connectorLogo} size={20} /> : <Icon name="connectors" size={20} />}
                    </div>
                    <Title title={identifier} />
                  </div>
                </Table.Cell>
                <Table.Cell className="max-w-80 content-center truncate">{spec?.url}</Table.Cell>
                <Table.Cell className="content-center">
                  {status ? <ConnectivityStatus item={{ identifier, type, spec, status, lastModifiedAt }} /> : null}
                </Table.Cell>
                <Table.Cell className="content-center">{lastModifiedAt ? timeAgo(lastModifiedAt) : null}</Table.Cell>
                <Table.Cell className="min-w-8 content-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onToggleFavoriteConnector(identifier, !isFavorite)}
                  >
                    {isFavorite ? (
                      <Icon name="star-filled" size={12} className="fill-icons-alert" />
                    ) : (
                      <Icon name="star" size={12} className="text-icons-6" />
                    )}
                  </Button>
                </Table.Cell>
                <Table.Cell className="min-w-8 text-right">
                  <MoreActionsTooltip
                    isInTable
                    actions={[
                      {
                        isDanger: true,
                        title: t('views:connectors.delete', 'Delete Connector'),
                        onClick: () => onDeleteConnector(identifier)
                      }
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      )}
    </Table.Root>
  )
}
