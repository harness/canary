import { useState } from 'react'

import { getHarnessConnectorDefinition, harnessConnectors } from '@utils/connectors/utils'
import { useTranslationStore } from '@utils/viewUtils'

import { InputFactory } from '@harnessio/forms'
import { Drawer, Separator, Spacer } from '@harnessio/ui/components'
import {
  ArrayInput,
  BooleanInput,
  ConnectorEntityForm,
  ConnectorFormEntityType,
  ConnectorHeader,
  ConnectorItem,
  ConnectorReference,
  ConnectorSelectionType,
  ConnectorsPalette,
  DirectionEnum,
  GroupInput,
  ListInput,
  NumberInput,
  RadialInput,
  SelectInput,
  SeparatorInput,
  TextAreaInput,
  TextInput
} from '@harnessio/ui/views'

import mockAccountsData from '../secrets/mock-account-data.json'
import mockOrgData from '../secrets/mock-org-data.json'
import mockProjectsData from '../secrets/mock-project-data.json'
import { Scope, ScopeEnum, scopeHierarchy } from '../secrets/types'
import mockConnectorsData from './mock-connectors-data.json'

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
  const [, setActiveScope] = useState<Scope>(ScopeEnum.ORGANIZATION)

  // State for existing connectors
  const [parentFolder, setParentFolder] = useState<string | null>(mockAccountsData[0].accountName)
  const [childFolder, setChildFolder] = useState<string | null>(mockProjectsData[0].projectResponse.project.identifier)
  const [formEntity, setFormEntity] = useState<ConnectorFormEntityType | null>(null)
  const [isConnectorSelected, setIsConnectorSelected] = useState(false)
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
    setIsDrawerOpen(false)
  }

  const renderConnectorContent = () => {
    switch (selectedType) {
      case ConnectorSelectionType.NEW:
        return (
          <div>
            <Separator />
            <Spacer size={2.5} />
            {/* Render create connector flow from here */}
            <ConnectorsPalette
              useTranslationStore={useTranslationStore}
              connectors={harnessConnectors}
              onSelectConnector={() => setIsConnectorSelected(true)}
              setFormEntity={setFormEntity}
              requestClose={() => {
                setFormEntity(null)
                setIsConnectorSelected(false)
                handleCancel()
              }}
            />
            <Drawer.Root open={isConnectorSelected} onOpenChange={setIsConnectorSelected} direction="right" nested>
              <Drawer.Content>
                {formEntity ? (
                  <ConnectorEntityForm
                    useTranslationStore={useTranslationStore}
                    formEntity={formEntity}
                    onBack={() => setIsConnectorSelected(false)}
                    requestClose={() => {
                      setFormEntity(null)
                      setIsConnectorSelected(false)
                    }}
                    // onFormSubmit={handleFormSubmit}
                    getConnectorDefinition={getHarnessConnectorDefinition}
                    inputComponentFactory={inputComponentFactory}
                  />
                ) : null}
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
