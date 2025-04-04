import { Button, Icon, Logo, MoreActionsTooltip, NoData, SkeletonList, SkeletonTable, Table } from '@/components'
import { timeAgo } from '@utils/utils'
import { ExecutionStatus } from '@views/execution/execution-status'

import { ConnectorListItem, ConnectorListProps } from './types'
import { ConnectorTypeToLogoNameMap } from './utils'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="max-w-full truncate font-medium">{title}</span>
)

const ConnectivityStatus = ({
  item,
  onClick
}: {
  item: ConnectorListItem
  onClick: ConnectorListProps['onTestConnection']
}): JSX.Element => (
  <div className="inline-flex items-center gap-3">
    {item?.status ? <ExecutionStatus.Badge status={item.status} /> : null}
    <Button size="icon" variant="outline" onClick={() => onClick(item)}>
      <Icon name="refresh" size={16} />
    </Button>
  </div>
)

export function ConnectorsList({
  connectors,
  useTranslationStore,
  isLoading,
  toConnectorDetails,
  onTestConnection,
  onDeleteConnector
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
          <Table.Head className="w-96">Connector</Table.Head>
          <Table.Head className="w-96">Details</Table.Head>
          <Table.Head className="w-44">Connectivity status</Table.Head>
          <Table.Head className="w-44">Last updated</Table.Head>
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {connectors.map(({ identifier, type, spec, status, lastModifiedAt }) => {
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
                      {connectorLogo ? <Logo name={connectorLogo} size={32} /> : <Icon name="connectors" size={32} />}
                    </div>
                    <Title title={identifier} />
                  </div>
                </Table.Cell>
                <Table.Cell className="max-w-80 content-center truncate">{spec?.url}</Table.Cell>
                <Table.Cell className="content-center">
                  {status && (
                    <ConnectivityStatus
                      item={{ identifier, type, spec, status, lastModifiedAt }}
                      onClick={onTestConnection}
                    />
                  )}
                </Table.Cell>
                <Table.Cell className="content-center">{lastModifiedAt ? timeAgo(lastModifiedAt) : null}</Table.Cell>
                <Table.Cell className="text-right">
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
