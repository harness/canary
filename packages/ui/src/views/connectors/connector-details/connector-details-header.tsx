import { FC } from 'react'

import { Button, IconV2, Layout, Link, LogoV2, MoreActionsTooltip, StatusBadge, Text, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'

import { ConnectorTypeToLogoNameMap } from '../connectors-list/utils'
import { ConnectorDetailsHeaderProps } from './types'

const DATE_FORMAT_OPTIONS = {
  month: 'short' as const,
  day: 'numeric' as const,
  year: 'numeric' as const
}

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
        <Link size="sm" prefixIcon to={toConnectorsList()}>
          {t('views:connectors.backToConnectors', 'Back to connectors')}
        </Link>
      ) : null}
      <Layout.Horizontal gap="xs" align="center">
        {logoName ? <LogoV2 name={logoName} size="lg" /> : <IconV2 name="connectors" size="lg" />}
        <Text as="h1" variant="heading-section">
          {connectorDetails.name}
        </Text>
      </Layout.Horizontal>
      <Layout.Horizontal className="text-2 mt-4 w-full leading-none" justify="between" gap="lg">
        <Layout.Horizontal justify="between" gap="3xl">
          <Layout.Vertical gap="xs">
            <Text className="text-cn-3">{t('views:connectors.created', 'Created')}</Text>
            {createdAt ? (
              <TimeAgoCard
                timestamp={createdAt}
                textProps={{ color: 'foreground-1' }}
                dateTimeFormatOptions={DATE_FORMAT_OPTIONS}
              />
            ) : (
              <Text variant="body-normal">-</Text>
            )}
          </Layout.Vertical>
          <Layout.Vertical gap="xs">
            <Text className="text-cn-3">{t('views:connectors.updated', 'Updated')}</Text>
            {lastModifiedAt ? (
              <TimeAgoCard
                timestamp={lastModifiedAt}
                textProps={{ color: 'foreground-1' }}
                dateTimeFormatOptions={DATE_FORMAT_OPTIONS}
              />
            ) : (
              <Text variant="body-normal">-</Text>
            )}
          </Layout.Vertical>
          <Layout.Vertical gap="xs">
            <Text className="text-cn-3">{t('views:connectors.connectionStatus', 'Connection status')}</Text>
            {status ? (
              <StatusBadge
                className="leading-none"
                size="sm"
                variant="status"
                theme={status.toLowerCase() === 'success' ? 'success' : 'danger'}
              >
                <Text className="group-hover:text-cn-1 transition-colors duration-200">
                  {status.toLowerCase() === 'success'
                    ? t('views:connectors.success', 'Success')
                    : t('views:connectors.failure', 'Failed')}
                </Text>
              </StatusBadge>
            ) : (
              <Text variant="body-normal">-</Text>
            )}
          </Layout.Vertical>
        </Layout.Horizontal>
        <Layout.Horizontal align="end" gap="sm">
          <Button onClick={() => onTest(connectorDetails.identifier)}>
            <IconV2 name="clipboard-check" />
            {t('views:connectors.testConnection', 'Test Connection')}
          </Button>
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
            buttonVariant="outline"
          />
        </Layout.Horizontal>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export { ConnectorDetailsHeader }
