import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'

import { Drawer, FormSeparator, Spacer, Text } from '@harnessio/ui/components'
import {
  CreateSecretFormFields,
  CreateSecretPage,
  DirectionEnum,
  SecretItem,
  SecretReference,
  SecretsHeader,
  SecretType
} from '@harnessio/ui/views'

import { ConnectorInputExample } from '../connectors/connectors-input'
import mockAccountsData from './mock-account-data.json'
import mockOrgData from './mock-org-data.json'
import mockProjectsData from './mock-project-data.json'
import mockSecretsData from './mock-secrets-data.json'
import { Scope, ScopeEnum, scopeHierarchy } from './types'

export const SecretsPage = ({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedSecret,
  setSelectedSecret
}: {
  isDrawerOpen: boolean
  setIsDrawerOpen: (isDrawerOpen: boolean) => void
  selectedSecret: SecretItem | null
  setSelectedSecret: (selectedSecret: SecretItem | null) => void
}) => {
  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.NEW)

  const [activeScope, setActiveScope] = useState<Scope>(ScopeEnum.ORGANIZATION)

  const [parentFolder, setParentFolder] = useState<string | null>(mockAccountsData[0].accountName)
  const [childFolder, setChildFolder] = useState<string | null>(mockProjectsData[0].projectResponse.project.identifier)
  const [currentFolder, setCurrentFolder] = useState<string | null>(
    mockOrgData[0].organizationResponse.organization.identifier
  )

  const onSubmit = (data: CreateSecretFormFields) => {
    console.log('Submitted data:', data)
    setIsDrawerOpen(false)
  }

  // Handlers for existing secrets
  const handleSelectSecret = (secret: SecretItem) => {
    setSelectedSecret(secret)
    console.log('Selected secret:', secret)
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
    console.log('Cancelled')
    setIsDrawerOpen(false)
  }

  const renderSecretContent = () => {
    switch (selectedType) {
      case SecretType.NEW:
        return (
          <CreateSecretPage
            onFormSubmit={onSubmit}
            onFormCancel={handleCancel}
            useTranslationStore={useTranslationStore}
            isLoading={false}
            apiError={null}
            connectorInput={<ConnectorInputExample />}
          />
        )
      case SecretType.EXISTING:
        return (
          <SecretReference
            secretsData={
              mockSecretsData.map(secret => ({
                ...secret,
                id: secret.secret.identifier,
                name: secret.secret.name
              })) as SecretItem[]
            }
            parentFolder={parentFolder}
            currentFolder={currentFolder}
            childFolder={childFolder}
            selectedEntity={selectedSecret}
            onSelectEntity={handleSelectSecret}
            onScopeChange={handleScopeChange}
            onCancel={handleCancel}
            showBreadcrumbEllipsis={activeScope === ScopeEnum.PROJECT}
            isLoading={false}
            apiError="Could not fetch secrets, unauthorized"
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title className="text-cn-foreground-1 mb-2 text-xl">Secret</Drawer.Title>
            <FormSeparator className="w-full" />
            <Drawer.Close onClick={() => setIsDrawerOpen(false)} />
          </Drawer.Header>
          {/* <Spacer size={5} /> */}
          <Text as="div" className="text-cn-foreground-2 my-4">
            Choose type
          </Text>
          <SecretsHeader onChange={setSelectedType} selectedType={selectedType} />
          <Spacer size={5} />
          <FormSeparator />
          <Spacer size={5} />
          {renderSecretContent()}
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
