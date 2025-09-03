import { FC } from 'react'

import { Button, IconV2, Layout, Link, LogoV2, MoreActionsTooltip, StatusBadge, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'

import { ConnectorTypeToLogoNameMap } from '../connectors-list/utils'
import { ConnectorDetailsHeaderProps } from './types'

const ConnectorDetailsHeader: FC<ConnectorDetailsHeaderProps> = ({
  connectorDetails,
  onTest,
  onDelete,
  onEdit,
  toConnectorsList
}) => {
  const { createdAt, lastModifiedAt, lastTestedAt, lastConnectedAt, status, type } = connectorDetails
  const { t } = useTranslation()
  const logoName = ConnectorTypeToLogoNameMap.get(type)

  return (
    <div className="px-8">
      {toConnectorsList ? (
        <Link variant="secondary" size="sm" prefixIcon to={toConnectorsList()} className="mb-3">
          Back to Connectors
        </Link>
      ) : null}
      <Layout.Horizontal gap="xs" align="center">
        {logoName ? <LogoV2 name={logoName} size="lg" /> : <IconV2 name="connectors" size="lg" />}
        <Text as="h1" variant="heading-section">
          {connectorDetails.name}
        </Text>
      </Layout.Horizontal>
      {!!connectorDetails.description && <Text className="mt-3">{connectorDetails.description}</Text>}
      {connectorDetails.tags ? (
        <Layout.Horizontal gap="xs" className="mt-5">
          <Text>Labels:</Text>
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
              <span className="leading-tight text-cn-3">Created</span>
              <TimeAgoCard timestamp={createdAt} textProps={{ color: 'foreground-1' }} />
            </div>
          ) : null}
          {lastModifiedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-3">Last updated</span>
              <TimeAgoCard timestamp={lastModifiedAt} textProps={{ color: 'foreground-1' }} />
            </div>
          ) : null}
          {lastTestedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-3">Last status check</span>
              <TimeAgoCard timestamp={lastTestedAt} textProps={{ color: 'foreground-1' }} />
            </div>
          ) : null}
          {lastConnectedAt ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-3">Last successful check</span>
              <TimeAgoCard timestamp={lastConnectedAt} textProps={{ color: 'foreground-1' }} />
            </div>
          ) : null}
          {status ? (
            <div className="flex flex-col gap-1.5">
              <span className="leading-tight text-cn-3">Connection status</span>
              <StatusBadge
                className="leading-none"
                size="sm"
                variant="status"
                theme={status.toLowerCase() === 'success' ? 'success' : 'danger'}
              >
                <Text className="transition-colors duration-200 group-hover:text-cn-1">
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
                isDanger: false,
                title: t('views:connectors.editConnector', 'Edit connector'),
                onClick: () => onEdit()
              },
              {
                isDanger: true,
                title: t('views:connectors.deleteConnector', 'Delete connector'),
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
