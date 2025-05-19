import { getHarnessConnectorDefinition } from '@utils/connectors/utils'
import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import { InputFactory } from '@harnessio/forms'
import { Tabs } from '@harnessio/ui/components'
import {
  ArrayInput,
  BooleanInput,
  ConnectorDetailsActivities,
  ConnectorDetailsConfiguration,
  ConnectorDetailsItem,
  ConnectorDetailsLayout,
  ConnectorDetailsReference,
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

import { mockConnectorActivityList } from './mock-connector-activity-list'
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
    description: mockConnectorDetails.connector.description,
    tags: mockConnectorDetails.connector.tags
  } as ConnectorDetailsItem
  return (
    <ConnectorDetailsLayout
      connectorDetails={connectorDetails}
      onTest={noop}
      onDelete={noop}
      useTranslationStore={useTranslationStore}
      toConnectorsList={() => '/connectors'}
    >
      <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.CONFIGURATION}>
        <ConnectorDetailsConfiguration
          connectorDetails={connectorDetails}
          onSave={noop}
          inputComponentFactory={inputComponentFactory}
          getConnectorDefinition={type => getHarnessConnectorDefinition(type, { autoExpandGroups: true })}
          useTranslationStore={useTranslationStore}
          apiError={''}
        />
      </Tabs.Content>
      <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.REFERENCES}>
        <ConnectorDetailsReference
          toEntity={noop}
          toScope={noop}
          entities={mockConnectorRefList}
          searchQuery={''}
          apiConnectorRefError={undefined}
          useTranslationStore={useTranslationStore}
          isLoading={false}
          setSearchQuery={noop}
          currentPage={1}
          totalItems={100}
          pageSize={10}
          goToPage={noop}
        />
      </Tabs.Content>
      <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.ACTIVITY}>
        <ConnectorDetailsActivities
          useTranslationStore={useTranslationStore}
          isLoading={false}
          activities={mockConnectorActivityList}
          currentPage={1}
          totalItems={100}
          pageSize={10}
          goToPage={noop}
        />
      </Tabs.Content>
    </ConnectorDetailsLayout>
  )
}

export { ConnectorsDetailsPageWrapper }
