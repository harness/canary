import { useState } from 'react'

import { getHarnessConnectorDefinition, harnessConnectors } from '@utils/connectors/utils'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { InputFactory } from '@harnessio/forms'
import { Drawer, FormSeparator, Separator, Spacer, Text } from '@harnessio/ui/components'
import {
  ArrayInput,
  BooleanInput,
  ConnectorEntity,
  ConnectorEntityForm,
  ConnectorHeader,
  ConnectorItem,
  ConnectorReference,
  ConnectorSelectionType,
  ConnectorsPalette,
  DirectionEnum,
  EntityIntent,
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
            <Separator />
            <Spacer size={2.5} />
            {/* Render create connector flow from here */}
            <ConnectorsPalette
              useTranslationStore={useTranslationStore}
              connectors={harnessConnectors}
              onSelectConnector={() => setIsConnectorSelected(true)}
              setConnectorEntity={setConnectorEntity}
              requestClose={() => {
                setConnectorEntity(null)
                handleCancel()
              }}
            />
            <Drawer.Root open={isConnectorSelected} onOpenChange={setIsConnectorSelected} direction="right" nested>
              <Drawer.Content>
                {connectorEntity ? (
                  <ConnectorEntityForm
                    intent={EntityIntent.CREATE}
                    useTranslationStore={useTranslationStore}
                    connector={connectorEntity}
                    onBack={() => setIsConnectorSelected(false)}
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
            currentFolder={currentFolder}
            showBreadcrumbEllipsis={activeScope === ScopeEnum.PROJECT}
            onFilterChange={noop}
            searchValue={search}
            handleChangeSearchValue={setSearch}
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
          <Drawer.Title className="text-cn-foreground-1 mb-2 text-xl">Connectors</Drawer.Title>
          <FormSeparator className="w-full" />
          <Drawer.Close onClick={() => setIsDrawerOpen(false)} />
        </Drawer.Header>
        <Spacer size={5} />
        <Text as="div" className="text-cn-foreground-2 my-4">
          Choose type
        </Text>
        <Spacer size={5} />

        <ConnectorHeader onChange={setSelectedType} selectedType={selectedType} />

        <Spacer size={5} />
        <FormSeparator />
        <Spacer size={5} />

        {renderConnectorContent()}
      </Drawer.Content>
    </Drawer.Root>
  )
}
