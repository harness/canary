import { useEffect, useState } from 'react'

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
  ConnectorTestConnectionDialog,
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
  const [activeTab, setActiveTab] = useState(ConnectorDetailsTabsKeys.CONFIGURATION)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ConnectorDetailsTabsKeys)
  }
  const [isTestConnectionDialogOpen, setIsTestConnectionDialogOpen] = useState(false)
  const [connectorStatus, setConnectorStatus] = useState<'running' | 'success' | 'error'>('running')

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

  useEffect(() => {
    if (isTestConnectionDialogOpen) {
      setConnectorStatus('running')
      setTimeout(() => {
        const randomNumber = Math.floor(Math.random() * 100) + 1
        setConnectorStatus(randomNumber % 2 === 0 ? 'error' : 'success')
      }, 3000)
    } else {
      setConnectorStatus('running')
    }
  }, [isTestConnectionDialogOpen])

  const mockErrorData = {
    errors: [
      {
        reason: 'Unexpected Error',
        message:
          'There are no eligible delegates available in the account to execute the task.\n\nThere are no delegates with the right ownership to execute task"TaskId : MLJwLhLPSjeRqmdRHSbURg-DEL'
      }
    ]
  }

  return (
    <>
      <ConnectorDetailsLayout
        connectorDetails={connectorDetails}
        onTest={() => setIsTestConnectionDialogOpen(true)}
        onDelete={noop}
        onEdit={noop}
        toConnectorsList={() => '/connectors'}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      >
        <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.CONFIGURATION}>
          <ConnectorDetailsConfiguration
            connectorDetails={connectorDetails}
            inputComponentFactory={inputComponentFactory}
            getConnectorDefinition={type => getHarnessConnectorDefinition(type, { autoExpandGroups: true })}
            apiError={''}
          />
        </Tabs.Content>
        <Tabs.Content className="mt-9" value={ConnectorDetailsTabsKeys.REFERENCES}>
          <ConnectorDetailsReference
            connectorReferences={mockConnectorRefList}
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
      <ConnectorTestConnectionDialog
        isOpen={isTestConnectionDialogOpen}
        status={connectorStatus}
        onClose={() => setIsTestConnectionDialogOpen(false)}
        urlData={{ key: 'Docker Registry Url', url: 'https://connector.test.harness.io' }}
        connectorType="DockerRegistry"
        errorMessage={undefined}
        viewDocClick={noop}
        errorData={mockErrorData}
        percentageFilled={connectorStatus === 'running' ? 50 : connectorStatus === 'success' ? 100 : 0}
        key={`connector-test-${connectorStatus}`} // Add a key to force re-render
      />
    </>
  )
}

export { ConnectorsDetailsPageWrapper }
