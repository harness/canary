import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'

import { Button, Drawer, Spacer } from '@harnessio/ui/components'
import {
  CreateSecretFormFields,
  CreateSecretPage,
  DirectoryType,
  SecretCreationType,
  SecretItem,
  SecretReference,
  SecretScope,
  SecretScopeEnum,
  SecretsHeader,
  SecretType
} from '@harnessio/ui/views'

import { getAccountsData, getOrgData, getProjectData, getSecretsData } from './secrets-data'

export const SecretsPage = () => {
  const scopeHierarchy: Record<SecretScope, { parent: SecretScope | null; child: SecretScope | null }> = {
    account: { parent: null, child: SecretScopeEnum.ORGANIZATION },
    organization: { parent: SecretScopeEnum.ACCOUNT, child: SecretScopeEnum.PROJECT },
    project: { parent: SecretScopeEnum.ORGANIZATION, child: null }
  }

  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.NEW)

  // State for existing secrets
  const [, setActiveScope] = useState<SecretScope>(SecretScopeEnum.ORGANIZATION)
  const [selectedSecret, setSelectedSecret] = useState<SecretItem | null>(null)
  const [parentFolder, setParentFolder] = useState<string | null>(getAccountsData()[0].accountName)
  const [childFolder, setChildFolder] = useState<string | null>(getProjectData()[0].projectResponse.project.identifier)

  const onSubmit = (data: CreateSecretFormFields) => {
    console.log('Submitted data:', data)
  }

  // Handlers for existing secrets
  const handleSelectSecret = (secret: SecretItem) => {
    setSelectedSecret(secret)
    console.log('Selected secret:', secret)
  }

  const handleScopeChange = (direction: DirectoryType) => {
    setActiveScope(prevScope => {
      const newScope =
        direction === DirectoryType.UP ? scopeHierarchy[prevScope].parent! : scopeHierarchy[prevScope].child!
      switch (newScope) {
        case SecretScopeEnum.ACCOUNT:
          setParentFolder(null)
          setChildFolder(getOrgData()[0].organizationResponse.organization.identifier)
          break
        case SecretScopeEnum.ORGANIZATION:
          setParentFolder(getAccountsData()[0].accountName)
          setChildFolder(getProjectData()[0].projectResponse.project.identifier)
          break
        case SecretScopeEnum.PROJECT:
          setParentFolder(getOrgData()[0].organizationResponse.organization.identifier)
          setChildFolder(null)
          break
      }
      return newScope
    })
  }

  const handleCancel = () => {
    console.log('Cancelled')
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
            secretsData={getSecretsData().map(secret => ({
              ...secret,
              id: secret.secret.identifier,
              name: secret.secret.name
            }))}
            parentFolder={parentFolder}
            childFolder={childFolder}
            selectedEntity={selectedSecret}
            onSelectEntity={handleSelectSecret}
            onScopeChange={handleScopeChange}
            onCancel={handleCancel}
          />
        )
      default:
        return null
    }
  }

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger>
        <Button>Add Secret</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title className="text-3xl">Secrets</Drawer.Title>
        </Drawer.Header>
        <Spacer size={5} />

        <SecretsHeader onChange={setSelectedType} selectedType={selectedType} />
        <Spacer size={5} />
        {renderSecretContent()}
      </Drawer.Content>
    </Drawer.Root>
  )
}
