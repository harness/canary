import { useState } from 'react'

import { Drawer, Spacer } from '@/components'
import { ConnectorHeader, ConnectorItem, ConnectorReference, ConnectorSelectionType, DirectionEnum } from '@/views'

export const CreateOrSelectConnector = ({
  selectedConnector,
  setSelectedConnector,
  handleScopeChange,
  parentFolder,
  childFolder,
  mockConnectorsData,
  isDrawerOpen,
  setIsDrawerOpen
}: {
  selectedConnector: ConnectorItem | null
  setSelectedConnector: (connector: ConnectorItem | null) => void
  handleScopeChange: (direction: DirectionEnum) => void
  parentFolder: string | null
  childFolder: string | null
  mockConnectorsData: ConnectorItem[]
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}) => {
  const [selectedType, setSelectedType] = useState<ConnectorSelectionType>(ConnectorSelectionType.EXISTING)

  // Handlers for existing connectors
  const handleSelectConnector = (connector: ConnectorItem) => {
    setSelectedConnector(connector)
    console.log('Selected connector:', connector)
  }

  const handleCancel = () => {
    console.log('Cancelled')
  }

  const renderConnectorContent = () => {
    switch (selectedType) {
      case ConnectorSelectionType.NEW:
        return (
          <div className="p-4">
            <h2 className="mb-4 text-xl font-semibold">Create New Connector</h2>
            <p>Add form for new connector here</p>
            {/* Render create connector flow from here */}
          </div>
        )
      case ConnectorSelectionType.EXISTING:
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
    <Drawer.Root direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
