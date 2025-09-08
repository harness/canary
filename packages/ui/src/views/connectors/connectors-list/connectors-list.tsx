import { useState } from 'react'

import {
  Button,
  Favorite,
  IconV2,
  LogoV2,
  MoreActionsTooltip,
  NoData,
  Popover,
  Skeleton,
  Table,
  Text,
  TimeAgoCard
} from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorStatusType, ConnectorTestConnectionDialog } from '../components/connector-test-connection-dialog'
import { ConnectorListItem, ConnectorListProps } from './types'
import { ConnectorDisplayNameMap, ConnectorTypeToLogoNameMap } from './utils'

const isStatusSuccess = (status?: string) => status?.toLowerCase() === ExecutionState.SUCCESS.toLowerCase()

const CELL_MIN_WIDTH = 'min-w-[136px]'
const CELL_MIN_WIDTH_ICON = 'min-w-16'

const getConnectorTestConnectionStatus = (status?: string): ConnectorStatusType => {
  switch (status) {
    case 'SUCCESS':
      return 'success'
    case 'FAILURE':
    case 'PARTIAL':
      return 'error'
    case 'PENDING':
    case 'UNKNOWN':
    default:
      return 'running'
  }
}

const ConnectivityStatus = ({ item }: { item: ConnectorListItem; connectorDetailUrl: string }): JSX.Element => {
  const { t } = useTranslation()
  const isSuccess = isStatusSuccess(item?.status?.status)
  const [errorConnectionOpen, setErrorConnectionOpen] = useState(false)

  return isSuccess ? (
    <div className="gap-cn-4xs flex items-center">
      <IconV2 name="circle" size="sm" color="success" />
      <Text>{t('views:connectors.success', 'Success')}</Text>
    </div>
  ) : (
    <>
      <Popover
        triggerType="hover"
        title={t('views:connectors.errorEncountered', 'Error Encountered')}
        content={
          <>
            <Text className="whitespace-normal">{item?.status?.errorSummary}</Text>
            <Button className="mr-auto" variant="link" size="xs" onClick={() => setErrorConnectionOpen(true)}>
              {t('views:connectors.viewDetails', 'View error details')}
            </Button>
          </>
        }
      >
        <Button className="gap-cn-4xs h-auto p-0 font-normal" variant="transparent">
          <IconV2 name="circle" size="sm" color="danger" />
          <Text color="inherit">{t('views:connectors.failure', 'Failed')}</Text>
        </Button>
      </Popover>

      <ConnectorTestConnectionDialog
        title={item?.name}
        connectorType={item?.type}
        status={getConnectorTestConnectionStatus(item?.status?.status)}
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
  onEditConnector,
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
          t('views:connectors.createNew', 'Create Connector')
        ]}
      />
    )
  }

  return (
    <Table.Root className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-full max-w-[470px]">{t('views:connectors.id', 'Connector ID')}</Table.Head>
          <Table.Head className={CELL_MIN_WIDTH}>{t('views:connectors.type', 'Type')}</Table.Head>
          <Table.Head className={CELL_MIN_WIDTH}>{t('views:connectors.status', 'Status')}</Table.Head>
          <Table.Head className={CELL_MIN_WIDTH}>{t('views:connectors.createdAt', 'Created')}</Table.Head>
          <Table.Head className={CELL_MIN_WIDTH}>{t('views:connectors.updated', 'Updated')}</Table.Head>
          <Table.Head className={CELL_MIN_WIDTH_ICON} />
          <Table.Head className={CELL_MIN_WIDTH_ICON} />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {connectors.map(connector => {
          const { name, identifier, type, spec, status, lastModifiedAt, createdAt, isFavorite } = connector
          const connectorLogo = type ? ConnectorTypeToLogoNameMap.get(type) : undefined
          const connectorType = type ? ConnectorDisplayNameMap.get(type) : ''
          const connectorDetailUrl = toConnectorDetails?.({ identifier, type, spec, status, lastModifiedAt }) || ''

          return (
            <Table.Row className="[&_td]:py-5" key={identifier} to={connectorDetailUrl}>
              <Table.Cell className="w-full max-w-[470px] content-center truncate">
                <Text truncate>{identifier}</Text>
              </Table.Cell>
              <Table.Cell className={CELL_MIN_WIDTH}>
                <div className="flex w-full items-center gap-2">
                  {connectorLogo ? <LogoV2 name={connectorLogo} size="lg" /> : <IconV2 name="connectors" size="lg" />}
                  <Text truncate>{connectorType || ''}</Text>
                </div>
              </Table.Cell>
              <Table.Cell className={CELL_MIN_WIDTH} disableLink={!isStatusSuccess(status?.status)}>
                {status ? (
                  <ConnectivityStatus
                    item={{ name, identifier, type, spec, status, lastModifiedAt }}
                    connectorDetailUrl={connectorDetailUrl}
                  />
                ) : null}
              </Table.Cell>
              <Table.Cell className={CELL_MIN_WIDTH}>
                {createdAt ? (
                  <TimeAgoCard timestamp={createdAt} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
                ) : null}
              </Table.Cell>
              <Table.Cell className={CELL_MIN_WIDTH}>
                {lastModifiedAt ? (
                  <TimeAgoCard timestamp={lastModifiedAt} dateTimeFormatOptions={{ dateStyle: 'medium' }} />
                ) : null}
              </Table.Cell>
              <Table.Cell className={cn(CELL_MIN_WIDTH_ICON, '!p-0 text-center')} disableLink>
                <Favorite
                  isFavorite={isFavorite}
                  onFavoriteToggle={(favorite: boolean) => onToggleFavoriteConnector(identifier, !favorite)}
                />
              </Table.Cell>
              <Table.Cell className={cn(CELL_MIN_WIDTH_ICON, '!p-0 text-center')} disableLink>
                <MoreActionsTooltip
                  actions={[
                    {
                      title: t('views:connectors.edit', 'Edit'),
                      iconName: 'edit-pencil',
                      onClick: () => onEditConnector(connector)
                    },
                    {
                      isDanger: true,
                      title: t('views:connectors.delete', 'Delete'),
                      iconName: 'trash',
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
