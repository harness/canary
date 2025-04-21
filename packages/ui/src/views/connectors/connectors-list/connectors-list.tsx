import {
  Button,
  HoverCard,
  Icon,
  Logo,
  MoreActionsTooltip,
  NoData,
  SkeletonList,
  SkeletonTable,
  StyledLink,
  Table,
  Text
} from '@/components'
import { useRouterContext } from '@/context'
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
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Button className="group h-auto gap-2 px-0 font-normal hover:bg-transparent" variant="ghost">
          <Icon name="dot" size={8} className={cn(isSuccess ? 'text-icons-success' : 'text-icons-danger')} />
          <Text className="group-hover:text-cn-foreground-1 transition-colors duration-200" color="secondary">
            {isSuccess ? 'Success' : 'Failed'}
          </Text>
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content className="w-72 whitespace-normal">
        {/* TODO: need to provide real data */}
        <h3 className="text-cn-foreground-1 font-medium">{isSuccess ? 'Success' : 'Error Encountered'}</h3>
        <p className="text-cn-foreground-3 mt-1.5">
          Update the username & password. Check if the provided credentials are correct. Invalid Docker Registry
          credentials.
        </p>
        <StyledLink to="#" className="mt-2.5 block" variant="accent">
          View details
        </StyledLink>
      </HoverCard.Content>
    </HoverCard.Root>
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
  const { navigate } = useRouterContext()
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
          <Table.Head className="w-70">Details</Table.Head>
          <Table.Head className="w-44 whitespace-nowrap">Connectivity status</Table.Head>
          <Table.Head className="w-44">Last updated</Table.Head>
          <Table.Head className="w-10" />
          <Table.Head className="w-10" />
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {connectors.map(({ identifier, type, spec, status, lastModifiedAt, isFavorite }) => {
            const connectorLogo = type ? ConnectorTypeToLogoNameMap.get(type) : undefined
            return (
              <Table.Row className="[&_td]:py-5" key={identifier}>
                <Table.Cell className="content-center truncate">
                  <div className="flex items-center gap-2.5">
                    <div className="flex w-full max-w-8 items-center justify-center">
                      {connectorLogo ? <Logo name={connectorLogo} size={20} /> : <Icon name="connectors" size={30} />}
                    </div>
                    <Title title={identifier} />
                  </div>
                </Table.Cell>
                <Table.Cell className="content-center truncate" title={spec?.url}>
                  {spec?.url}
                </Table.Cell>
                <Table.Cell className="content-center whitespace-nowrap">
                  {status ? <ConnectivityStatus item={{ identifier, type, spec, status, lastModifiedAt }} /> : null}
                </Table.Cell>
                <Table.Cell className="content-center">{lastModifiedAt ? timeAgo(lastModifiedAt) : null}</Table.Cell>
                <Table.Cell className="content-center">
                  <Button
                    size="sm"
                    iconOnly
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
                <Table.Cell className="content-center !p-0">
                  <MoreActionsTooltip
                    actions={[
                      {
                        title: t('views:connectors.viewDetails', 'View Details'),
                        onClick: () =>
                          navigate(`${toConnectorDetails?.({ identifier, type, spec, status, lastModifiedAt })}`)
                      },
                      {
                        isDanger: true,
                        title: t('views:connectors.delete', 'Delete'),
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
