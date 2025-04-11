import { FC, useState } from 'react'

import { Tabs } from '@/components'
import { useTheme } from '@/context'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

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
  searchQuery
}) => {
  const { t } = useTranslationStore()
  const { isInset } = useTheme()
  const [activeTab, setActiveTab] = useState<ConnectorDetailsTabsKeys>(ConnectorDetailsTabsKeys.CONFIGURATION)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ConnectorDetailsTabsKeys)
  }

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content className="h-full" paddingClassName="px-5 pt-7">
        <ConnectorDetailsHeader
          connectorDetails={connectorDetails}
          onTest={onTest}
          onDelete={onDelete}
          useTranslationStore={useTranslationStore}
        />
        <Tabs.Root
          variant="tabnav"
          className="mb-7 px-8"
          defaultValue={ConnectorDetailsTabsKeys.CONFIGURATION}
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <Tabs.List
            className={cn(
              'before:w-[calc(100vw-var(--sidebar-width))] before:min-w-[calc(100%+3rem)] before:left-1/2 before:-translate-x-1/2',
              {
                'before:w-[calc(100vw-var(--sidebar-width)-6px*2)]': isInset
              }
            )}
          >
            <Tabs.Trigger
              className="px-4 data-[state=active]:bg-cn-background-2"
              value={ConnectorDetailsTabsKeys.CONFIGURATION}
            >
              {t('views:connectors.configuration', 'Configuration')}
            </Tabs.Trigger>
            <Tabs.Trigger
              className="px-4 data-[state=active]:bg-cn-background-2"
              value={ConnectorDetailsTabsKeys.REFERENCES}
            >
              {t('views:connectors.references', 'References')}
            </Tabs.Trigger>
            <Tabs.Trigger
              className="px-4 data-[state=active]:bg-cn-background-2"
              value={ConnectorDetailsTabsKeys.ACTIVITY}
            >
              {t('views:connectors.activityHistory', 'Activity history')}
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="pt-7" value={ConnectorDetailsTabsKeys.CONFIGURATION}>
            <ConnectorDetailsConfiguration
              connectorDetails={connectorDetails}
              onSave={onSave}
              inputComponentFactory={inputComponentFactory}
              getConnectorDefinition={getConnectorDefinition}
              useTranslationStore={useTranslationStore}
              apiError={apiError}
            />
          </Tabs.Content>
          <Tabs.Content className="pt-7" value={ConnectorDetailsTabsKeys.REFERENCES}>
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
          <Tabs.Content className="pt-7" value={ConnectorDetailsTabsKeys.ACTIVITY}>
            <div>Activity History</div>
          </Tabs.Content>
        </Tabs.Root>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ConnectorDetailsPage }
