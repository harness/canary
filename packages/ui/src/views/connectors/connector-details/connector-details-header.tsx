import { FC } from 'react'

import { Button, Layout, Link, MoreActionsTooltip, StatusBadge, Text } from '@/components'
import { useTranslation } from '@/context'
import { timeAgo } from '@/utils'
import { Logo, LogoName } from '@components/logo'

import { ConnectorDetailsHeaderProps } from './types'

const ConnectorDetailsHeader: FC<ConnectorDetailsHeaderProps> = ({
  connectorDetails,
  onTest,
  onDelete,
  toConnectorsList
}) => {
  const { createdAt, lastModifiedAt, lastTestedAt, lastConnectedAt, status } = connectorDetails
  const { t } = useTranslation()
  return (
    <div className="px-8">
      {toConnectorsList ? (
        <Link variant="secondary" size="sm" prefixIcon to={toConnectorsList()}>
          Back to Connectors
        </Link>
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
            <StatusBadge key={`${key}-${value}`} variant="outline" theme="merged" size="sm">
              {key}
              {value ? `: ${value}` : ''}
            </StatusBadge>
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
              <StatusBadge
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
              </StatusBadge>
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
