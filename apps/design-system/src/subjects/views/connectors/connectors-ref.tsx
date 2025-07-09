import { useState } from 'react'

import { getHarnessConnectorDefinition, harnessConnectors } from '@utils/connectors/utils'
import { noop } from '@utils/viewUtils'

import { InputFactory } from '@harnessio/forms'
import { Button, ButtonLayout, Drawer, FormSeparator, Spacer, Text } from '@harnessio/ui/components'
import {
  ArrayFormInput,
  BooleanFormInput,
  CardsFormInput,
  ConnectorEntity,
  ConnectorEntityForm,
  ConnectorHeader,
  ConnectorItem,
  ConnectorReference,
  ConnectorSelectionType,
  ConnectorsPalette,
  DirectionEnum,
  EntityIntent,
  GroupFormInput,
  ListFormInput,
  NumberFormInput,
  SelectFormInput,
  SeparatorFormInput,
  TextareaFormInput,
  TextFormInput
} from '@harnessio/ui/views'

import mockAccountsData from '../secrets/mock-account-data.json'
import mockOrgData from '../secrets/mock-org-data.json'
import mockProjectsData from '../secrets/mock-project-data.json'
import { Scope, ScopeEnum, scopeHierarchy } from '../secrets/types'
import mockConnectorsData from './mock-connectors-data.json'

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

export const ConnectorsRefPage = ({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedConnector,
  setSelectedConnector
}: {
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  selectedConnector: ConnectorItem | null
  setSelectedConnector: (connector: ConnectorItem | null) => void
}) => {
  const [selectedType, setSelectedType] = useState<ConnectorSelectionType>(ConnectorSelectionType.EXISTING)
  const [activeScope, setActiveScope] = useState<Scope>(ScopeEnum.ORGANIZATION)
  const [connectorEntity, setConnectorEntity] = useState<ConnectorEntity | null>(null)

  // State for existing connectors
  const [parentFolder, setParentFolder] = useState<string | null>(mockAccountsData[0].accountName)
  const [currentFolder, setCurrentFolder] = useState<string | null>(
    mockOrgData[0].organizationResponse.organization.identifier
  )
  const [childFolder, setChildFolder] = useState<string | null>(mockProjectsData[0].projectResponse.project.identifier)
  const [isConnectorSelected, setIsConnectorSelected] = useState(false)

  const [search, setSearch] = useState('')

  // Handlers for existing connectors
  const handleSelectConnector = (connector: ConnectorItem) => {
    setSelectedConnector(connector)
    console.log('Selected connector:', connector)
    setIsDrawerOpen(false)
  }

  const handleScopeChange = (direction: DirectionEnum) => {
    setActiveScope(prevScope => {
      const newScope =
        direction === DirectionEnum.PARENT ? scopeHierarchy[prevScope].parent! : scopeHierarchy[prevScope].child!
      switch (newScope) {
        case ScopeEnum.ACCOUNT:
          setParentFolder(null)
          setCurrentFolder(mockAccountsData[0].accountName)
          setChildFolder(mockOrgData[0].organizationResponse.organization.identifier)
          break
        case ScopeEnum.ORGANIZATION:
          setParentFolder(mockAccountsData[0].accountName)
          setCurrentFolder(mockOrgData[0].organizationResponse.organization.identifier)
          setChildFolder(mockProjectsData[0].projectResponse.project.identifier)
          break
        case ScopeEnum.PROJECT:
          setParentFolder(mockOrgData[0].organizationResponse.organization.identifier)
          setCurrentFolder(mockProjectsData[0].projectResponse.project.identifier)
          setChildFolder(null)
          break
      }
      return newScope
    })
  }

  const handleCancel = () => {
    setIsDrawerOpen(false)
  }

  const renderConnectorContent = () => {
    switch (selectedType) {
      case ConnectorSelectionType.NEW:
        return (
          <div>
            {/* Render create connector flow from here */}
            <ConnectorsPalette
              connectors={harnessConnectors}
              onSelectConnector={() => setIsConnectorSelected(true)}
              setConnectorEntity={setConnectorEntity}
            />
            <Drawer.Root open={isConnectorSelected} onOpenChange={setIsConnectorSelected}>
              <Drawer.Content>
                {!!connectorEntity && (
                  <ConnectorEntityForm
                    intent={EntityIntent.CREATE}
                    connector={connectorEntity}
                    onBack={() => setIsConnectorSelected(false)}
                    // onFormSubmit={handleFormSubmit}
                    getConnectorDefinition={getHarnessConnectorDefinition}
                    inputComponentFactory={inputComponentFactory}
                    isDrawer
                  />
                )}
              </Drawer.Content>
            </Drawer.Root>
          </div>
        )
      case ConnectorSelectionType.EXISTING:
        return (
          <ConnectorReference
            connectorsData={
              mockConnectorsData.map(connector => {
                return {
                  ...connector,
                  name: connector.connector.name,
                  id: connector.connector.identifier
                }
              }) as ConnectorItem[]
            }
            parentFolder={parentFolder}
            childFolder={childFolder}
            selectedEntity={selectedConnector}
            onSelectEntity={handleSelectConnector}
            onScopeChange={handleScopeChange}
            isLoading={false}
            apiError="Could not fetch connectors, unauthorized"
            currentFolder={currentFolder}
            showBreadcrumbEllipsis={activeScope === ScopeEnum.PROJECT}
            onFilterChange={noop}
            searchValue={search}
            handleChangeSearchValue={setSearch}
            isDrawer
          />
        )
      default:
        return null
    }
  }

  return (
    <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Connectors</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Text className="mb-4">Choose type</Text>
          <ConnectorHeader onChange={setSelectedType} selectedType={selectedType} />

          <Spacer size={5} />
          <FormSeparator />
          <Spacer size={5} />

          {renderConnectorContent()}
        </Drawer.Body>
        <Drawer.Footer>
          <ButtonLayout.Root>
            <ButtonLayout.Primary>
              <Button>Save</Button>
            </ButtonLayout.Primary>
            <ButtonLayout.Secondary>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </ButtonLayout.Secondary>
          </ButtonLayout.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  )
}
