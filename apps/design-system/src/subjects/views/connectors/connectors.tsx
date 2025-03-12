import { useState } from 'react'

import { Button, Drawer, Spacer } from '@harnessio/ui/components'
import { ConnectorHeader, ConnectorReference, ConnectorType, DirectionEnum } from '@harnessio/ui/views'

import mockConnectorsData from './mock-connectors-data.json'

export const ConnectorsPage = () => {
  const [selectedType, setSelectedType] = useState<ConnectorType>(ConnectorType.EXISTING)

  // State for existing connectors
  const [selectedConnector, setSelectedConnector] = useState<any | null>(null)
  const [parentFolder, setParentFolder] = useState<string | null>('default')
  const [childFolder, setChildFolder] = useState<string | null>('project1')

  // Handlers for existing connectors
  const handleSelectConnector = (connector: any) => {
    setSelectedConnector(connector)
    console.log('Selected connector:', connector)
  }

  const handleScopeChange = (direction: DirectionEnum) => {
    if (direction === DirectionEnum.PARENT) {
      // Navigate up to parent folder
      setChildFolder(parentFolder)
      setParentFolder(null)
    } else if (direction === DirectionEnum.CHILD) {
      // Navigate down to child folder
      setParentFolder(childFolder)
      setChildFolder(null)
    }
  }

  const handleCancel = () => {
    console.log('Cancelled')
  }

  const renderConnectorContent = () => {
    switch (selectedType) {
      case ConnectorType.NEW:
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Create New Connector</h2>
            <p>Add form for new connector here</p>
            {/* In a real implementation, you would include a form component here */}
          </div>
        )
      case ConnectorType.EXISTING:
        return (
          <ConnectorReference
            connectorsData={mockConnectorsData}
            parentFolder={parentFolder}
            childFolder={childFolder}
            selectedEntity={selectedConnector}
            onSelectEntity={handleSelectConnector}
            onScopeChange={handleScopeChange}
            onCancel={handleCancel}
            isLoading={false}
            apiError="Could not fetch connectors, unauthorized"
          />
        )
      default:
        return null
    }
  }

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger>
        <Button>Add Connector</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title className="text-3xl">Connectors</Drawer.Title>
        </Drawer.Header>
        <Spacer size={5} />

        <ConnectorHeader onChange={setSelectedType} selectedType={selectedType} />
        <Spacer size={5} />
        {renderConnectorContent()}
      </Drawer.Content>
    </Drawer.Root>
  )
}
