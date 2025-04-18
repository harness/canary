import { getHarnessConnectorDefinition } from '@utils/connectors/utils'
import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import { InputFactory } from '@harnessio/forms'
import { Tabs } from '@harnessio/ui/components'
import {
  ArrayInput,
  BooleanInput,
  ConnectorDetailsConfiguration,
  ConnectorDetailsItem,
  ConnectorDetailsLayout,
  ConnectorDetailsReferencePage,
  ConnectorDetailsTabsKeys,
  GroupInput,
  ListInput,
  NumberInput,
  RadialInput,
  SelectInput,
  SeparatorInput,
  TextAreaInput,
  TextInput
} from '@harnessio/ui/views'

import mockConnectorDetails from './mock-connector-details.json'
import { mockConnectorRefList } from './mock-connector-ref-list'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextInput())
inputComponentFactory.registerComponent(new BooleanInput())
inputComponentFactory.registerComponent(new NumberInput())
inputComponentFactory.registerComponent(new ArrayInput())
inputComponentFactory.registerComponent(new ListInput())
inputComponentFactory.registerComponent(new TextAreaInput())
inputComponentFactory.registerComponent(new GroupInput())
inputComponentFactory.registerComponent(new SelectInput())
inputComponentFactory.registerComponent(new SeparatorInput())
inputComponentFactory.registerComponent(new RadialInput())

const ConnectorsDetailsPageWrapper = (): JSX.Element => {
  const connectorDetails = {
    name: mockConnectorDetails.connector.name,
    identifier: mockConnectorDetails.connector.identifier,
    type: mockConnectorDetails.connector.type,
    status: mockConnectorDetails.status.status,
    lastTestedAt: mockConnectorDetails.status.lastTestedAt,
    lastModifiedAt: mockConnectorDetails.lastModifiedAt,
    spec: {
      url: mockConnectorDetails.connector.spec.url
    },
    gitDetails: {
      repoIdentifier: mockConnectorDetails.gitDetails.repoIdentifier || '',
      branch: mockConnectorDetails.gitDetails.branch || '',
      objectId: mockConnectorDetails.gitDetails.objectId || ''
    },
    lastConnectedAt: mockConnectorDetails.status.lastConnectedAt,
    createdAt: mockConnectorDetails.createdAt,
    icon: 'github',
    description: mockConnectorDetails.connector.description
  } as ConnectorDetailsItem
  return (
    <ConnectorDetailsLayout
      connectorDetails={connectorDetails}
      onTest={noop}
      onDelete={noop}
      useTranslationStore={useTranslationStore}
    >
      <Tabs.Content className="pt-7" value={ConnectorDetailsTabsKeys.CONFIGURATION}>
        <ConnectorDetailsConfiguration
          connectorDetails={connectorDetails}
          onSave={noop}
          inputComponentFactory={inputComponentFactory}
          getConnectorDefinition={getHarnessConnectorDefinition}
          useTranslationStore={useTranslationStore}
          apiError={''}
        />
      </Tabs.Content>
      <Tabs.Content className="pt-7" value={ConnectorDetailsTabsKeys.REFERENCES}>
        <ConnectorDetailsReferencePage
          toEntity={noop}
          toScope={noop}
          entities={mockConnectorRefList}
          searchQuery={''}
          apiConnectorRefError={undefined}
          useTranslationStore={useTranslationStore}
          isLoading={false}
          setSearchQuery={noop}
          currentPage={1}
          totalPages={1}
          goToPage={noop}
        />
      </Tabs.Content>
      <Tabs.Content className="pt-7" value={ConnectorDetailsTabsKeys.ACTIVITY}>
        <div>Activity History</div>
      </Tabs.Content>
    </ConnectorDetailsLayout>
  )
}

export { ConnectorsDetailsPageWrapper }
