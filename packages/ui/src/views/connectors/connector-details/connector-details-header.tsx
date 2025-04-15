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
        <h1 className="text-6 text-cn-foreground-1 font-medium leading-snug tracking-tight">{connectorDetails.name}</h1>
      </Layout.Horizontal>
      {connectorDetails.description ? (
        <Text as="div" weight="medium" className="text-2 text-cn-foreground-2 mt-3">
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
      <div className="text-2 mt-6 flex w-full flex-wrap justify-between gap-6 leading-none">
        <div className="flex justify-between gap-11">
          {createdAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-3 leading-tight">Created</span>
              <span className="text-cn-foreground-1">{timeAgo(createdAt)}</span>
            </div>
          ) : null}
          {lastModifiedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-3 leading-tight">Last updated</span>
              <span className="text-cn-foreground-1">{timeAgo(lastModifiedAt)}</span>
            </div>
          ) : null}
          {lastTestedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-3 leading-tight">Last status check</span>
              <span className="text-cn-foreground-1">{timeAgo(lastTestedAt)}</span>
            </div>
          ) : null}
          {lastConnectedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-3 leading-tight">Last successful check</span>
              <span className="text-cn-foreground-1">{timeAgo(lastConnectedAt)}</span>
            </div>
          ) : null}
          {status ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-3 leading-tight">Connection status</span>
              <Badge
                className="leading-none"
                size="sm"
                variant="status"
                theme={status.toLowerCase() === 'success' ? 'success' : 'danger'}
              >
                <span className="text-cn-foreground-1">{status}</span>
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
