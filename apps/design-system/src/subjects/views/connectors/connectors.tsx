import { useState } from 'react'

import { Button, Drawer, Spacer } from '@harnessio/ui/components'
import { ConnectorHeader, ConnectorReference, ConnectorType, DirectionEnum } from '@harnessio/ui/views'

import mockAccountsData from '../secrets/mock-account-data.json'
import mockOrgData from '../secrets/mock-org-data.json'
import mockProjectsData from '../secrets/mock-project-data.json'
import { ScopeEnum, scopeHierarchy, SecretScope } from '../secrets/types'
import mockConnectorsData from './mock-connectors-data.json'

export const ConnectorsPage = () => {
  const [selectedType, setSelectedType] = useState<ConnectorType>(ConnectorType.EXISTING)
  const [, setActiveScope] = useState<SecretScope>(ScopeEnum.ORGANIZATION)

  // State for existing connectors
  const [selectedConnector, setSelectedConnector] = useState<any | null>(null)
  const [parentFolder, setParentFolder] = useState<string | null>(mockAccountsData[0].accountName)
  const [childFolder, setChildFolder] = useState<string | null>(mockProjectsData[0].projectResponse.project.identifier)

  // Handlers for existing connectors
  const handleSelectConnector = (connector: any) => {
    setSelectedConnector(connector)
    console.log('Selected connector:', connector)
  }

  const handleScopeChange = (direction: DirectionEnum) => {
    setActiveScope(prevScope => {
      const newScope =
        direction === DirectionEnum.PARENT ? scopeHierarchy[prevScope].parent! : scopeHierarchy[prevScope].child!
      switch (newScope) {
        case ScopeEnum.ACCOUNT:
          setParentFolder(null)
          setChildFolder(mockOrgData[0].organizationResponse.organization.identifier)
          break
        case ScopeEnum.ORGANIZATION:
          setParentFolder(mockAccountsData[0].accountName)
          setChildFolder(mockProjectsData[0].projectResponse.project.identifier)
          break
        case ScopeEnum.PROJECT:
          setParentFolder(mockOrgData[0].organizationResponse.organization.identifier)
          setChildFolder(null)
          break
      }
      return newScope
    })
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
