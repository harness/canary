import { useRef, useState } from 'react'

import { secretsFormDefinition } from '@utils/secrets/secrets-form-schema'
import { noop, useTranslationStore } from '@utils/viewUtils'

import { InputFactory } from '@harnessio/forms'
import { Button, Drawer, FormSeparator, Spacer, Text } from '@harnessio/ui/components'
import {
  ArrayFormInput,
  BooleanFormInput,
  CalendarInput,
  CardsFormInput,
  DirectionEnum,
  EntityIntent,
  GroupFormInput,
  ListFormInput,
  NumberFormInput,
  onSubmitSecretProps,
  SecretEntityForm,
  SecretEntityFormHandle,
  SecretItem,
  SecretReference,
  SecretsHeader,
  SecretType,
  SelectFormInput,
  SeparatorFormInput,
  TextareaFormInput,
  TextFormInput
} from '@harnessio/ui/views'

import mockAccountsData from './mock-account-data.json'
import mockOrgData from './mock-org-data.json'
import mockProjectsData from './mock-project-data.json'
import mockSecretsData from './mock-secrets-data.json'
import { Scope, ScopeEnum, scopeHierarchy } from './types'

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
inputComponentFactory.registerComponent(new CalendarInput())

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
  const formRef = useRef<SecretEntityFormHandle>(null)

  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.NEW)

  const [activeScope, setActiveScope] = useState<Scope>(ScopeEnum.ORGANIZATION)

  const [parentFolder, setParentFolder] = useState<string | null>(mockAccountsData[0].accountName)
  const [childFolder, setChildFolder] = useState<string | null>(mockProjectsData[0].projectResponse.project.identifier)
  const [currentFolder, setCurrentFolder] = useState<string | null>(
    mockOrgData[0].organizationResponse.organization.identifier
  )

  const [search, setSearch] = useState('')

  const onSubmit = (data: onSubmitSecretProps) => {
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

  const handleSubmitEntityForm = () => {
    formRef.current?.submitForm()
  }

  const renderSecretContent = () => {
    switch (selectedType) {
      case SecretType.NEW:
        return (
          <SecretEntityForm
            ref={formRef}
            useTranslationStore={useTranslationStore}
            inputComponentFactory={inputComponentFactory}
            intent={EntityIntent.CREATE}
            secretsFormDefinition={secretsFormDefinition}
            onFormSubmit={onSubmit}
            onBack={handleCancel}
            isDrawer
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
    <>
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Secret</Drawer.Title>
            <Drawer.Close onClick={() => setIsDrawerOpen(false)} srOnly />
          </Drawer.Header>
          <Drawer.Inner>
            <Text as="div" className="text-cn-foreground-2 mb-4">
              Choose type
            </Text>
            <SecretsHeader onChange={setSelectedType} selectedType={selectedType} />
            <Spacer size={6} />
            <FormSeparator className="w-full" />
            <Spacer size={6} />
            {renderSecretContent()}
          </Drawer.Inner>
          <Drawer.Footer>
            <Button variant="outline" onClick={handleCancel}>
              Back
            </Button>
            <Button onClick={selectedType === SecretType.NEW ? handleSubmitEntityForm : noop}>Save</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
