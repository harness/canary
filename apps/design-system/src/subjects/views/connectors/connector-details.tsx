import { getHarnessConnectorDefinition } from '@utils/connectors/utils'
import { noop } from 'lodash-es'

import { InputFactory } from '@harnessio/forms'
import { Tabs } from '@harnessio/ui/components'
import {
  ArrayFormInput,
  BooleanFormInput,
  CardsFormInput,
  ConnectorDetailsActivities,
  ConnectorDetailsConfiguration,
  ConnectorDetailsItem,
  ConnectorDetailsLayout,
  ConnectorDetailsReference,
  ConnectorDetailsTabsKeys,
  GroupFormInput,
  ListFormInput,
  NumberFormInput,
  SelectFormInput,
  SeparatorFormInput,
  TextareaFormInput,
  TextFormInput
} from '@harnessio/ui/views'

import { mockConnectorActivityList } from './mock-connector-activity-list'
import mockConnectorDetails from './mock-connector-details.json'
import { mockConnectorRefList } from './mock-connector-ref-list'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextFormInput())
inputComponentFactory.registerComponent(new BooleanFormInput())
inputComponentFactory.registerComponent(new NumberFormInput())
inputComponentFactory.registerComponent(new ArrayFormInput())
inputComponentFactory.registerComponent(new ListFormInput())
inputComponentFactory.registerComponent(new TextareaFormInput())
inputComponentFactory.registerComponent(new GroupFormInput())
inputComponentFactory.registerComponent(new SelectFormInput())
inputComponentFactory.registerComponent(new SeparatorFormInput())
inputComponentFactory.registerComponent(new CardsFormInput())

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
      toConnectorsList={() => '/connectors'}
    >
      <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.CONFIGURATION}>
        <ConnectorDetailsConfiguration
          connectorDetails={connectorDetails}
          onSave={noop}
          inputComponentFactory={inputComponentFactory}
          getConnectorDefinition={type => getHarnessConnectorDefinition(type, { autoExpandGroups: true })}
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
