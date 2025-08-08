import { useState } from 'react'

import {
  Button,
  Favorite,
  IconV2,
  LogoV2,
  MoreActionsTooltip,
  NoData,
  Skeleton,
  Table,
  Text,
  TimeAgoCard,
  Tooltip
} from '@/components'
import { useTranslation } from '@/context'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorTestConnectionDialog } from '../components/connector-test-connection-dialog'
import { ConnectorListItem, ConnectorListProps } from './types'
import { ConnectorTypeToLogoNameMap } from './utils'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="text-cn-foreground-1 max-w-full truncate font-medium" title={title}>
    {title}
  </span>
)

const ConnectivityStatus = ({ item }: { item: ConnectorListItem; connectorDetailUrl: string }): JSX.Element => {
  const { t } = useTranslation()
  const isSuccess = item?.status?.status?.toLowerCase() === ExecutionState.SUCCESS.toLowerCase()
  const [errorConnectionOpen, setErrorConnectionOpen] = useState(false)

  return isSuccess ? (
    <div className="flex items-center gap-2">
      <IconV2 name="circle" size="2xs" className="text-icons-success" />
      <Text className="group-hover:text-cn-foreground-1 transition-colors duration-200">
        {t('views:connectors.success', 'Success')}
      </Text>
    </div>
  ) : (
    <>
      <Tooltip
        side="bottom"
        title={t('views:connectors.errorEncountered', 'Error Encountered')}
        content={
          <>
            <Text className="whitespace-normal">{item?.status?.errorSummary}</Text>
            <Button variant="link" onClick={() => setErrorConnectionOpen(true)}>
              {t('views:connectors.viewDetails', 'View details')}
            </Button>
          </>
        }
      >
        <Button className="group h-auto gap-2 p-0 font-normal hover:!bg-transparent" variant="ghost">
          <IconV2 name="circle" size="2xs" className="text-icons-danger" />
          <Text className="group-hover:text-cn-foreground-1 transition-colors duration-200">
            {t('views:connectors.failure', 'Failed')}
          </Text>
        </Button>
      </Tooltip>

      <ConnectorTestConnectionDialog
        title={item?.name}
        apiUrl={item?.spec?.url}
        status="error"
        errorMessage={item?.status?.errorSummary}
        isOpen={errorConnectionOpen}
        onClose={() => setErrorConnectionOpen(false)}
        errorData={item.status?.errors ? { errors: item.status?.errors } : undefined}
      />
    </>
  )
}

export function ConnectorsList({
  connectors,
  isLoading,
  toConnectorDetails,
  onDeleteConnector,
  onToggleFavoriteConnector
}: ConnectorListProps): JSX.Element {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.Table countRows={12} countColumns={6} />
  }

  if (!connectors.length) {
    return (
      <NoData
        withBorder
        imageName="no-data-cog"
        title={t('views:noData.noConnectors', 'No connectors yet')}
        description={[
          t('views:noData.noConnectors', 'There are no connectors in this project yet.'),
          t('views:connectors.createNew', 'New connector')
        ]}
      />
    )
  }

  return (
    <Table.Root
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      tableClassName="table-fixed"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[282px]">{t('views:connectors.id', 'Connector ID')}</Table.Head>
          <Table.Head className="w-44">{t('views:common.details', 'Details')}</Table.Head>
          <Table.Head className="w-44 whitespace-nowrap">
            {t('views:connectors.connectivityStatus', 'Connectivity status')}
          </Table.Head>
          <Table.Head className="w-44">{t('views:connectors.updated', 'Last updated')}</Table.Head>
          <Table.Head className="w-10" />
          <Table.Head className="w-10" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {connectors.map(({ name, identifier, type, spec, status, lastModifiedAt, isFavorite }) => {
          const connectorLogo = type ? ConnectorTypeToLogoNameMap.get(type) : undefined
          const connectorDetailUrl = toConnectorDetails?.({ identifier, type, spec, status, lastModifiedAt }) || ''

          return (
            <Table.Row className="[&_td]:py-5" key={identifier} to={connectorDetailUrl}>
              <Table.Cell className="content-center truncate">
                <div className="flex items-center gap-2.5">
                  <div className="flex w-full max-w-8 items-center justify-center">
                    {connectorLogo ? <LogoV2 name={connectorLogo} size="lg" /> : <IconV2 name="connectors" size="lg" />}
                  </div>
                  <Title title={identifier} />
                </div>
              </Table.Cell>
              <Table.Cell className="content-center truncate" title={spec?.url}>
                {spec?.url}
              </Table.Cell>
              <Table.Cell className="content-center whitespace-nowrap">
                {status ? (
                  <ConnectivityStatus
                    item={{ name, identifier, type, spec, status, lastModifiedAt }}
                    connectorDetailUrl={connectorDetailUrl}
                  />
                ) : null}
              </Table.Cell>
              <Table.Cell className="content-center">
                {lastModifiedAt ? <TimeAgoCard timestamp={lastModifiedAt} /> : null}
              </Table.Cell>
              <Table.Cell className="content-center !p-1.5" disableLink>
                <Favorite
                  isFavorite={isFavorite}
                  onFavoriteToggle={(favorite: boolean) => onToggleFavoriteConnector(identifier, !favorite)}
                />
              </Table.Cell>
              <Table.Cell className="content-center !p-0" disableLink>
                <MoreActionsTooltip
                  actions={[
                    {
                      title: t('views:connectors.viewDetails', 'View Details'),
                      to: connectorDetailUrl
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
    </Table.Root>
  )
}
