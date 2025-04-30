import { FC } from 'react'

import { Badge, Button, Icon, Layout, MoreActionsTooltip, Text } from '@/components'
import { useRouterContext } from '@/context'
import { Logo, LogoName } from '@components/logo'
import { timeAgo } from '@utils/utils'

import { ConnectorDetailsHeaderProps } from './types'

const ConnectorDetailsHeader: FC<ConnectorDetailsHeaderProps> = ({
  connectorDetails,
  onTest,
  onDelete,
  useTranslationStore,
  toConnectorsList
}) => {
  const { createdAt, lastModifiedAt, lastTestedAt, lastConnectedAt, status } = connectorDetails
  const { t } = useTranslationStore()
  const { Link } = useRouterContext()
  return (
    <div className="px-8">
      {toConnectorsList ? (
        <Button variant="link" size="sm" className="mb-3 px-0">
          <Icon name="chevron-up" className="-rotate-90" />
          <Link to={toConnectorsList()}>Back to Connectors</Link>
        </Button>
      ) : null}
      <Layout.Horizontal gap="space-x-2" className="items-center">
        <Logo name={connectorDetails.type.toLowerCase() as LogoName} />
        <h1 className="text-6 font-medium leading-snug tracking-tight text-cn-foreground-1">{connectorDetails.name}</h1>
      </Layout.Horizontal>
      {connectorDetails.description ? (
        <Text as="div" weight="medium" className="mt-3 text-2 text-cn-foreground-2">
          {connectorDetails.description}
        </Text>
      ) : null}
      {connectorDetails.tags ? (
        <Layout.Horizontal gap="space-x-2" className="mt-5">
          <Text className="text-cn-foreground-4">Labels:</Text>
          {Object.entries(connectorDetails.tags || {}).map(([key, value]) => (
            <Badge key={`${key}-${value}`} variant="surface" theme="merged" size="sm">
              {key}
              {value ? `: ${value}` : ''}
            </Badge>
          ))}
        </Layout.Horizontal>
      ) : null}
      <div className="mt-6 flex w-full flex-wrap justify-between gap-6 text-2 leading-none">
        <div className="flex justify-between gap-11">
          {createdAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Created</span>
              <span className="text-cn-foreground-1">{timeAgo(createdAt)}</span>
            </div>
          ) : null}
          {lastModifiedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Last updated</span>
              <span className="text-cn-foreground-1">{timeAgo(lastModifiedAt)}</span>
            </div>
          ) : null}
          {lastTestedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Last status check</span>
              <span className="text-cn-foreground-1">{timeAgo(lastTestedAt)}</span>
            </div>
          ) : null}
          {lastConnectedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Last successful check</span>
              <span className="text-cn-foreground-1">{timeAgo(lastConnectedAt)}</span>
            </div>
          ) : null}
          {status ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-foreground-3">Connection status</span>
              <Badge
                className="leading-none"
                size="sm"
                variant="status"
                theme={status.toLowerCase() === 'success' ? 'success' : 'danger'}
              >
                <Text className="transition-colors duration-200 group-hover:text-cn-foreground-1" color="secondary">
                  {status.toLowerCase() === 'success'
                    ? t('views:connectors.success', 'Success')
                    : t('views:connectors.failure', 'Failed')}
                </Text>
              </Badge>
            </div>
          ) : null}
        </div>
        <div className="flex h-full items-end gap-11">
          <Button onClick={() => onTest(connectorDetails.identifier)}>Test Connection</Button>
          <MoreActionsTooltip
            actions={[
              {
                isDanger: true,
                title: t('views:connectors.delete', 'Delete connector'),
                onClick: () => onDelete(connectorDetails.identifier)
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export { ConnectorDetailsHeader }
