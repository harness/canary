import { useState } from 'react'

import { SandboxLayout } from '@/views'
import { Tabs } from '@components/index'

import { ConnectorDetailsHeader } from './connector-details-header'
import { ConnectorDetailsLayoutProps, ConnectorDetailsTabsKeys } from './types'

const ConnectorDetailsLayout = ({
  connectorDetails,
  onTest,
  onDelete,
  useTranslationStore,
  children
}: ConnectorDetailsLayoutProps) => {
  const { t } = useTranslationStore()
  const [activeTab, setActiveTab] = useState<ConnectorDetailsTabsKeys>(ConnectorDetailsTabsKeys.CONFIGURATION)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ConnectorDetailsTabsKeys)
  }
  return (
    <div>
      <SandboxLayout.Main fullWidth>
        <SandboxLayout.Content>
          <ConnectorDetailsHeader
            connectorDetails={connectorDetails}
            onTest={onTest}
            onDelete={onDelete}
            useTranslationStore={useTranslationStore}
          />
          <Tabs.Root
            className="mb-7 px-8"
            defaultValue={ConnectorDetailsTabsKeys.CONFIGURATION}
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <Tabs.List className="before:left-1/2 before:w-[calc(100vw-var(--sidebar-width)-6px*2)] before:min-w-[calc(100%+3rem)] before:-translate-x-1/2">
              <Tabs.Trigger
                className="data-[state=active]:bg-cn-background-2 px-4"
                value={ConnectorDetailsTabsKeys.CONFIGURATION}
              >
                {t('views:connectors.configuration', 'Configuration')}
              </Tabs.Trigger>
              <Tabs.Trigger
                className="data-[state=active]:bg-cn-background-2 px-4"
                value={ConnectorDetailsTabsKeys.REFERENCES}
              >
                {t('views:connectors.references', 'References')}
              </Tabs.Trigger>
              <Tabs.Trigger
                className="data-[state=active]:bg-cn-background-2 px-4"
                value={ConnectorDetailsTabsKeys.ACTIVITY}
              >
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
