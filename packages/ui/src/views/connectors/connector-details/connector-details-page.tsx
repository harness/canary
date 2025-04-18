import { FC, useState } from 'react'

import { Tabs } from '@/components'
import { SandboxLayout } from '@/views'

import { ConnectorDetailsConfiguration } from './connector-details-configuration'
import { ConnectorDetailsHeader } from './connector-details-header'
import { ConnectorDetailsReferencePage } from './connector-details-references-page'
import { ConnectorDetailsPageProps, ConnectorDetailsTabsKeys } from './types'

const ConnectorDetailsPage: FC<ConnectorDetailsPageProps> = ({
  connectorDetails,
  useTranslationStore,
  onTest,
  onDelete,
  getConnectorDefinition,
  inputComponentFactory,
  onSave,
  apiError,
  apiConnectorRefError,
  isConnectorReferencesLoading,
  setIsConnectorRefSearchQuery,
  currentPage,
  totalPages,
  goToPage,
  entities,
  toEntity,
  toScope,
  toConnectorsList,
  searchQuery
}) => {
  const { t } = useTranslationStore()
  const [activeTab, setActiveTab] = useState<ConnectorDetailsTabsKeys>(ConnectorDetailsTabsKeys.CONFIGURATION)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ConnectorDetailsTabsKeys)
  }

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content>
        <ConnectorDetailsHeader
          connectorDetails={connectorDetails}
          onTest={onTest}
          onDelete={onDelete}
          useTranslationStore={useTranslationStore}
          toConnectorsList={toConnectorsList}
        />
        <Tabs.Root
          className="mb-7 mt-9 px-8"
          defaultValue={ConnectorDetailsTabsKeys.CONFIGURATION}
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <Tabs.List className="before:left-1/2 before:w-[calc(100vw-var(--sidebar-width)-6px*2)] before:min-w-[calc(100%+3rem)] before:-translate-x-1/2">
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
          <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.CONFIGURATION}>
            <ConnectorDetailsConfiguration
              connectorDetails={connectorDetails}
              onSave={onSave}
              inputComponentFactory={inputComponentFactory}
              getConnectorDefinition={getConnectorDefinition}
              useTranslationStore={useTranslationStore}
              apiError={apiError}
            />
          </Tabs.Content>
          <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.REFERENCES}>
            <ConnectorDetailsReferencePage
              toEntity={toEntity}
              toScope={toScope}
              entities={entities}
              searchQuery={searchQuery}
              apiConnectorRefError={apiConnectorRefError}
              useTranslationStore={useTranslationStore}
              isLoading={isConnectorReferencesLoading}
              setSearchQuery={setIsConnectorRefSearchQuery}
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          </Tabs.Content>
          <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.ACTIVITY}>
            <div>Activity History</div>
          </Tabs.Content>
        </Tabs.Root>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ConnectorDetailsPage }
