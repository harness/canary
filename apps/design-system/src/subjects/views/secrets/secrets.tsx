import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'

import { Drawer, Spacer } from '@harnessio/ui/components'
import {
  CreateSecretFormFields,
  CreateSecretPage,
  DirectionEnum,
  InputReference,
  SecretCreationType,
  SecretItem,
  SecretReference,
  SecretsHeader,
  SecretType
} from '@harnessio/ui/views'

import mockAccountsData from './mock-account-data.json'
import mockOrgData from './mock-org-data.json'
import mockProjectsData from './mock-project-data.json'
import mockSecretsData from './mock-secrets-data.json'
import { Scope, ScopeEnum, scopeHierarchy } from './types'

export const SecretsPage = () => {
  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.NEW)

  // State for existing secrets
  const [, setActiveScope] = useState<Scope>(ScopeEnum.ORGANIZATION)
  const [selectedSecret, setSelectedSecret] = useState<SecretItem | null>(null)
  const [parentFolder, setParentFolder] = useState<string | null>(mockAccountsData[0].accountName)
  const [childFolder, setChildFolder] = useState<string | null>(mockProjectsData[0].projectResponse.project.identifier)

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
            prefilledFormData={{
              name: 'mock-secret',
              identifier: 'mock-identifier',
              description: 'mock-description',
              tags: 'mock-tags, mock-tags-2',
              type: SecretCreationType.SECRET_FILE
            }}
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
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-5">Secret Management Example</h2>

      <div className="max-w-md mb-8">
        <InputReference<SecretItem | string>
          initialValue="Please select a secret"
          value={selectedSecret?.name}
          label="Select a Secret"
          startIcon="key"
          onClick={() => {
            setIsDrawerOpen(true)
          }}
          onEdit={() => {
            setIsDrawerOpen(true)
          }}
          onClear={() => setSelectedSecret(null)}
        />
      </div>

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
    </div>
  )
}
