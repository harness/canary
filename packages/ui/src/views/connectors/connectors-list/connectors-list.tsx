import { Button, Icon, NoData, SkeletonList, Table } from '@/components'
import { useRouterContext } from '@/context'
import { timeAgo } from '@utils/utils'
import { ExecutionStatus } from '@views/execution/execution-status'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorListItem, ConnectorListProps } from './types'

const Title = ({ title }: { title: string }): JSX.Element => (
  <div className="inline-flex items-center gap-2.5">
    <span className="max-w-full truncate font-medium">{title}</span>
  </div>
)

const ConnectivityStatus = ({
  item,
  onClick
}: {
  item: ConnectorListItem
  onClick: ConnectorListProps['onTestConnection']
}): JSX.Element => {
  return (
    <div className="inline-flex items-center gap-2.5">
      {item?.status ? <ExecutionStatus.Badge status={item.status} /> : null}
      <Button size="icon" variant="outline" onClick={() => onClick(item)}>
        <Icon name="refresh" size={24} />
      </Button>
    </div>
  )
}

export function ConnectorsList({
  connectors,
  useTranslationStore,
  isLoading,
  toConnectorDetails,
  onTestConnection
}: ConnectorListProps): JSX.Element {
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
          t('views:noData.createConnector', 'Create new connector.')
        ]}
      />
    )
  }

  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head>Connector</Table.Head>
          <Table.Head>Details</Table.Head>
          <Table.Head>Connectivity status</Table.Head>
          <Table.Head>Last updated</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {connectors.map(connector => (
          <Table.Row key={connector.identifier}>
            <Table.Cell>
              <Link to={toConnectorDetails?.(connector) || ''}>
                <div className="flex items-center gap-2.5">
                  <Icon name="connectors" size={24} />
                  <Title title={connector.identifier} />
                </div>
              </Link>
            </Table.Cell>
            <Table.Cell className="max-w-80 truncate">{connector.spec?.url}</Table.Cell>
            <Table.Cell>
              {connector?.status ? <ConnectivityStatus item={connector} onClick={onTestConnection} /> : null}
            </Table.Cell>
            <Table.Cell>{connector?.lastModifiedAt ? timeAgo(connector.lastModifiedAt) : null}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
