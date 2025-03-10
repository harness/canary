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

import { getSecretsData } from './secrets-data'

export const SecretsPage = () => {
  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.New)

  // State for existing secrets
  const [selectedSecret, setSelectedSecret] = useState<SecretItem | null>(null)
  const [parentScope, setParentScope] = useState<SecretScope | null>('organization')
  const [childFolder, setChildFolder] = useState<SecretScope | null>()

  const onSubmit = (data: CreateSecretFormFields) => {
    console.log('Submitted data:', data)
  }

  // Handlers for existing secrets
  const handleSelectSecret = (secret: SecretItem) => {
    setSelectedSecret(secret)
    console.log('Selected secret:', secret)
  }

  const handleScopeChange = (scope: SecretScope) => {
    switch (scope) {
      case 'account':
        setParentScope(null)
        setChildFolder('organization')
        break
      case 'organization':
        setParentScope('account')
        setChildFolder('project')
        break
      case 'project':
        setParentScope('organization')
        setChildFolder(null)
        break
    }
  }

  const handleFolderChange = (folder: string) => {
    switch (folder) {
      case 'account':
        break
      case 'organization':
        setParentScope('account')
        setChildFolder('project')
        break
      case 'project':
        setParentScope('organization')
        setChildFolder(null)
        break
    }
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
            parentScope={parentScope}
            childFolder={childFolder}
            selectedEntity={selectedSecret}
            onSelectEntity={handleSelectSecret}
            onScopeChange={handleScopeChange}
            onCancel={handleCancel}
            onFolderChange={handleFolderChange}
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
