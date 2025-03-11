import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'

import { Button, Drawer, Spacer } from '@harnessio/ui/components'
import {
  CreateSecretFormFields,
  CreateSecretPage,
  SecretCreationType,
  SecretItem,
  SecretReference,
  SecretScope,
  SecretsHeader,
  SecretType
} from '@harnessio/ui/views'

import { getAccountsData, getOrgData, getProjectData, getSecretsData } from './secrets-data'

export const SecretsPage = () => {
  const scopeHierarchy: Record<SecretScope, { parent: SecretScope | null; child: SecretScope | null }> = {
    account: { parent: null, child: 'organization' },
    organization: { parent: 'account', child: 'project' },
    project: { parent: 'organization', child: null }
  }

  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.New)

  // State for existing secrets
  const [, setActiveScope] = useState<SecretScope>('organization')
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

  const handleScopeChange = (direction: 'up' | 'down') => {
    setActiveScope(prevScope => {
      const newScope = direction === 'up' ? scopeHierarchy[prevScope].parent! : scopeHierarchy[prevScope].child!

      switch (newScope) {
        case 'account':
          setParentFolder(null)
          setChildFolder(getOrgData()[0].organizationResponse.organization.identifier)
          break
        case 'organization':
          setParentFolder(getAccountsData()[0].accountName)
          setChildFolder(getProjectData()[0].projectResponse.project.identifier)
          break
        case 'project':
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
      case SecretType.New:
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
      case SecretType.Existing:
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
