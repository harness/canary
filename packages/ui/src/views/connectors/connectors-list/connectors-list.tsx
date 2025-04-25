import { useState } from 'react'

import {
  Button,
  HoverCard,
  Icon,
  Logo,
  MoreActionsTooltip,
  NoData,
  SkeletonList,
  SkeletonTable,
  Table,
  Text
} from '@/components'
import { timeAgo } from '@utils/utils'
import { TranslationStore } from '@views/repo'
import { ExecutionState } from '@views/repo/pull-request'

import { ConnectorTestConnectionDialog } from '../components/connector-test-connection-dialog'
import { ConnectorListItem, ConnectorListProps } from './types'
import { ConnectorTypeToLogoNameMap } from './utils'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="max-w-full truncate font-medium text-cn-foreground-1" title={title}>
    {title}
  </span>
)

const ConnectivityStatus = ({
  item,
  useTranslationStore
}: {
  item: ConnectorListItem
  connectorDetailUrl: string
  useTranslationStore: () => TranslationStore
}): JSX.Element => {
  const { t } = useTranslationStore()
  const isSuccess = item?.status?.status?.toLowerCase() === ExecutionState.SUCCESS.toLowerCase()
  const [errorConnectionOpen, setErrorConnectionOpen] = useState(false)

  return isSuccess ? (
    <div className="flex items-center gap-2">
      <Icon name="dot" size={8} className="text-icons-success" />
      <Text className="transition-colors duration-200 group-hover:text-cn-foreground-1" color="secondary">
        {t('views:connectors.status.success', 'Success')}
      </Text>
    </div>
  ) : (
    <>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <Button className="group h-auto gap-2 p-0 font-normal hover:!bg-transparent" variant="ghost">
            <Icon name="dot" size={8} className="text-icons-danger" />
            <Text className="transition-colors duration-200 group-hover:text-cn-foreground-1" color="secondary">
              {t('views:connectors.status.failure', 'Failed')}
            </Text>
          </Button>
        </HoverCard.Trigger>
        <HoverCard.Content className="w-72 whitespace-normal">
          <h3 className="font-medium text-cn-foreground-1">
            {t('views:connectors.errorEncountered', 'Error Encountered')}
          </h3>
          <p className="mt-1.5 text-cn-foreground-3">{item?.status?.errorSummary}</p>
          <Button className="mt-2.5" variant="link" onClick={() => setErrorConnectionOpen(true)}>
            {t('views:connectors.viewDetails', 'View details')}
          </Button>
        </HoverCard.Content>
      </HoverCard.Root>

      <ConnectorTestConnectionDialog
        title={item?.name}
        apiUrl={item?.spec?.url}
        status="error"
        errorMessage={item?.status?.errorSummary}
        isOpen={errorConnectionOpen}
        onClose={() => setErrorConnectionOpen(false)}
        useTranslationStore={useTranslationStore}
        errorData={item.status?.errors ? { errors: item.status?.errors } : undefined}
      />
    </>
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
          <Table.Head className="w-70">{t('views:common.details', 'Details')}</Table.Head>
          <Table.Head className="w-44 whitespace-nowrap">
            {t('views:connectors.connectivityStatus', 'Connectivity status')}
          </Table.Head>
          <Table.Head className="w-44">{t('views:connectors.updated', 'Last updated')}</Table.Head>
          <Table.Head className="w-10" />
          <Table.Head className="w-10" />
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {connectors.map(({ name, identifier, type, spec, status, lastModifiedAt, isFavorite }) => {
            const connectorLogo = type ? ConnectorTypeToLogoNameMap.get(type) : undefined
            const connectorDetailUrl = toConnectorDetails?.({ identifier, type, spec, status, lastModifiedAt }) || ''

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
                  {status ? (
                    <ConnectivityStatus
                      item={{ name, identifier, type, spec, status, lastModifiedAt }}
                      connectorDetailUrl={connectorDetailUrl}
                      useTranslationStore={useTranslationStore}
                    />
                  ) : null}
                </Table.Cell>
                <Table.Cell className="content-center">{lastModifiedAt ? timeAgo(lastModifiedAt) : null}</Table.Cell>
                <Table.Cell className="content-center !p-1.5">
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
      )}
    </Table.Root>
  )
}
