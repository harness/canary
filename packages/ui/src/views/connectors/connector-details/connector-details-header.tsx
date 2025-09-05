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
  const { createdAt, lastModifiedAt, status, type } = connectorDetails
  const { t } = useTranslation()
  const logoName = ConnectorTypeToLogoNameMap.get(type)

  return (
    <Layout.Vertical className="px-8" gap="sm">
      {toConnectorsList ? (
        <Link variant="secondary" size="sm" prefixIcon to={toConnectorsList()}>
          Back to Connectors
        </Link>
      ) : null}
      <Layout.Horizontal gap="xs" align="center">
        {logoName ? <LogoV2 name={logoName} size="lg" /> : <IconV2 name="connectors" size="lg" />}
        <Text as="h1" variant="heading-section">
          {connectorDetails.name}
        </Text>
      </Layout.Horizontal>
      <Layout.Horizontal className="mt-6 w-full text-2 leading-none" justify="between" gap="lg">
        <Layout.Horizontal justify="between" gap="xl">
          {createdAt ? (
            <Layout.Vertical gap="xs">
              <span className="leading-tight text-cn-3">Created</span>
              <TimeAgoCard timestamp={createdAt} textProps={{ color: 'foreground-1' }} />
            </Layout.Vertical>
          ) : null}
          {lastModifiedAt ? (
            <Layout.Vertical gap="xs">
              <span className="leading-tight text-cn-3">Updated</span>
              <TimeAgoCard timestamp={lastModifiedAt} textProps={{ color: 'foreground-1' }} />
            </Layout.Vertical>
          ) : null}
          {status ? (
            <Layout.Vertical gap="xs">
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
            </Layout.Vertical>
          ) : null}
        </Layout.Horizontal>
        <Layout.Horizontal align="end" gap="xs">
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
                onClick: () => onDelete()
              }
            ]}
          />
        </Layout.Horizontal>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export { ConnectorDetailsHeader }
