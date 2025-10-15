import { useRef, useState } from 'react'

import { noop } from '@utils/viewUtils'

import { Button, ButtonLayout, Drawer, FormSeparator, Spacer, Text } from '@harnessio/ui/components'
import {
  DirectionEnum,
  EntityReference,
  SecretEntityFormHandle,
  SecretItem,
  SecretsHeader,
  SecretType
} from '@harnessio/ui/views'

import mockAccountsData from './mock-account-data.json'
import mockOrgData from './mock-org-data.json'
import mockProjectsData from './mock-project-data.json'
import mockSecretsData from './mock-secrets-data.json'
import { Scope, ScopeEnum, scopeHierarchy } from './types'

export const SecretsMultiSelectPage = () => {
  const formRef = useRef<SecretEntityFormHandle>(null)

  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [selectedSecret, setSelectedSecret] = useState<SecretItem[] | null>(null)

  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.NEW)

  const [activeScope, setActiveScope] = useState<Scope>(ScopeEnum.ORGANIZATION)

  const [parentFolder, setParentFolder] = useState<string | null>(mockAccountsData[0].accountName)
  const [childFolder, setChildFolder] = useState<string | null>(mockProjectsData[0].projectResponse.project.identifier)
  const [currentFolder, setCurrentFolder] = useState<string | null>(
    mockOrgData[0].organizationResponse.organization.identifier
  )

  // Handlers for existing secrets
  const handleSelectSecret = (secret: SecretItem[]) => {
    setSelectedSecret(secret)
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

  const handleSubmitEntityForm = () => {
    formRef.current?.submitForm()
  }

  const renderSecretContent = () => {
    return (
      <EntityReference<SecretItem>
        entities={
          mockSecretsData.map(secret => ({
            ...secret,
            id: secret.secret.identifier,
            name: secret.secret.name,
            folderPath: currentFolder
          })) as SecretItem[]
        }
        selectedEntities={selectedSecret || []}
        onSelectEntity={handleSelectSecret}
        onScopeChange={handleScopeChange}
        parentFolder={parentFolder}
        childFolder={childFolder}
        currentFolder={currentFolder}
        showBreadcrumbEllipsis={activeScope === ScopeEnum.PROJECT}
        handleChangeSearchValue={noop}
        enableMultiSelect
      />
    )
  }

  return (
    <>
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Secret</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Text className="mb-cn-md">Choose type</Text>
            <SecretsHeader onChange={setSelectedType} selectedType={selectedType} />
            <Spacer size={6} />
            <FormSeparator className="w-full" />
            <Spacer size={6} />
            {renderSecretContent()}
          </Drawer.Body>
          <Drawer.Footer>
            <ButtonLayout.Root>
              <ButtonLayout.Primary>
                <Button onClick={selectedType === SecretType.NEW ? handleSubmitEntityForm : noop}>Save</Button>
              </ButtonLayout.Primary>
              <ButtonLayout.Secondary>
                <Button variant="outline" onClick={handleCancel}>
                  Back
                </Button>
              </ButtonLayout.Secondary>
            </ButtonLayout.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
