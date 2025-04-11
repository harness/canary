import { getHarnessConnectorDefinition } from '@utils/connectors/utils'
import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import { InputFactory } from '@harnessio/forms'
import {
  ArrayInput,
  BooleanInput,
  ConnectorDetailsItem,
  ConnectorDetailsPage,
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

const ConnectorsDetailsPageWrapper = (): JSX.Element => (
  <ConnectorDetailsPage
    searchQuery=""
    toEntity={noop}
    toScope={noop}
    entities={mockConnectorRefList}
    isConnectorReferencesLoading={false}
    setIsConnectorRefSearchQuery={noop}
    currentPage={1}
    totalPages={1}
    goToPage={noop}
    connectorDetails={
      {
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
    }
    useTranslationStore={useTranslationStore}
    onTest={noop}
    onDelete={noop}
    onSave={noop}
    getConnectorDefinition={type => getHarnessConnectorDefinition(type, { autoExpandGroups: true })}
    inputComponentFactory={inputComponentFactory}
  />
)

export { ConnectorsDetailsPageWrapper }
