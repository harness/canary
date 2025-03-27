import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'

import { Drawer, Spacer } from '@harnessio/ui/components'
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

  const [, setActiveScope] = useState<Scope>(ScopeEnum.ORGANIZATION)

  const [parentFolder, setParentFolder] = useState<string | null>(mockAccountsData[0].accountName)
  const [childFolder, setChildFolder] = useState<string | null>(mockProjectsData[0].projectResponse.project.identifier)

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
            childFolder={childFolder}
            selectedEntity={selectedSecret}
            onSelectEntity={handleSelectSecret}
            onScopeChange={handleScopeChange}
            onCancel={handleCancel}
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
            <Drawer.Title className="text-3xl">Secrets</Drawer.Title>
            <Drawer.Close onClick={() => setIsDrawerOpen(false)} />
          </Drawer.Header>
          <Spacer size={5} />

          <SecretsHeader onChange={setSelectedType} selectedType={selectedType} />
          <Spacer size={5} />
          {renderSecretContent()}
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
