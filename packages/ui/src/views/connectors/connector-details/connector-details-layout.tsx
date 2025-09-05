import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { Tabs } from '@components/index'

import { ConnectorDetailsHeader } from './connector-details-header'
import { ConnectorDetailsLayoutProps, ConnectorDetailsTabsKeys } from './types'

const ConnectorDetailsLayout = ({
  connectorDetails,
  onTest,
  onDelete,
  onEdit,
  children,
  toConnectorsList,
  activeTab,
  handleTabChange
}: ConnectorDetailsLayoutProps) => {
  const { t } = useTranslation()

  return (
    <div>
      <SandboxLayout.Main>
        <SandboxLayout.Content>
          <ConnectorDetailsHeader
            connectorDetails={connectorDetails}
            onTest={onTest}
            onDelete={onDelete}
            onEdit={onEdit}
            toConnectorsList={toConnectorsList}
          />
          <Tabs.Root
            className="mb-7 mt-9 px-8"
            defaultValue={activeTab ?? ConnectorDetailsTabsKeys.CONFIGURATION}
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <Tabs.List variant="overlined" className="-mx-8 px-8">
              <Tabs.Trigger value={ConnectorDetailsTabsKeys.CONFIGURATION}>
                {t('views:connectors.configuration', 'Configuration')}
              </Tabs.Trigger>
              <Tabs.Trigger value={ConnectorDetailsTabsKeys.REFERENCES}>
                {t('views:connectors.references', 'References')}
              </Tabs.Trigger>
              <Tabs.Trigger value={ConnectorDetailsTabsKeys.ACTIVITY}>
                {t('views:connectors.activityHistory', 'Activity history')}
              </Tabs.Trigger>
            </Tabs.List>
            {children}
          </Tabs.Root>
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </div>
  )
}

export { ConnectorDetailsLayout }
