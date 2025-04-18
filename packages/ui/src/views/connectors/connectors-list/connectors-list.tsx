import { Button, Icon, Logo, MoreActionsTooltip, NoData, SkeletonList, SkeletonTable, Table, Text } from '@/components'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/utils'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorListItem, ConnectorListProps } from './types'
import { ConnectorTypeToLogoNameMap } from './utils'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="text-cn-foreground-1 max-w-full truncate font-medium" title={title}>
    {title}
  </span>
)

const ConnectivityStatus = ({ item }: { item: ConnectorListItem }): JSX.Element => {
  const isSuccess = item?.status?.toLowerCase() === ExecutionState.SUCCESS.toLowerCase()
  return (
    <div className="inline-flex items-center gap-2">
      <Icon name="dot" size={8} className={cn(isSuccess ? 'text-icons-success' : 'text-icons-danger')} />
      <Text className="text-cn-foreground-2">{isSuccess ? 'Success' : 'Failed'}</Text>
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
      tableClassName="table-fixed"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[282px]">{t('views:connectors.id', 'Connector ID')}</Table.Head>
          <Table.Head className="w-72">Details</Table.Head>
          <Table.Head className="w-50 whitespace-nowrap">Connectivity status</Table.Head>
          <Table.Head className="w-40">Last updated</Table.Head>
          <Table.Head className="w-2" />
          <Table.Head className="w-2" />
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
                className="cursor-pointer py-4"
                onClick={() => toConnectorDetails?.({ identifier, type, spec, status, lastModifiedAt })}
              >
                <Table.Cell className="max-w-[282px] content-center truncate !py-5">
                  <div className="flex items-center gap-2.5">
                    <div className="min-w-[24px]">
                      {connectorLogo ? <Logo name={connectorLogo} size={20} /> : <Icon name="connectors" size={30} />}
                    </div>
                    <Title title={identifier} />
                  </div>
                </Table.Cell>
                <Table.Cell className="max-w-72 content-center truncate !py-5" title={spec?.url}>
                  {spec?.url}
                </Table.Cell>
                <Table.Cell className="w-50 content-center whitespace-nowrap !py-5">
                  {status ? <ConnectivityStatus item={{ identifier, type, spec, status, lastModifiedAt }} /> : null}
                </Table.Cell>
                <Table.Cell className="content-center !py-5">
                  {lastModifiedAt ? timeAgo(lastModifiedAt) : null}
                </Table.Cell>
                <Table.Cell className="min-w-2 content-center !p-0">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => onToggleFavoriteConnector(identifier, !isFavorite)}
                    className="p-0"
                  >
                    {isFavorite ? (
                      <Icon name="star-filled" size={12} className="fill-icons-alert" />
                    ) : (
                      <Icon name="star" size={12} className="text-icons-6" />
                    )}
                  </Button>
                </Table.Cell>
                <Table.Cell className="min-w-2 content-center !p-0 text-right">
                  <MoreActionsTooltip
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
