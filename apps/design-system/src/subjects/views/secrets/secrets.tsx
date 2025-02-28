import { useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { Button, Drawer, Spacer } from '@harnessio/ui/components'
import { CreateSecretPage, NewSecretFormFields, SecretsHeader, SecretType } from '@harnessio/ui/views'

export const SecretsPage = () => {
  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.New)

  const onSubmit = (data: NewSecretFormFields) => {
    console.log(data)
  }

  const renderContent = () => {
    switch (selectedType) {
      case SecretType.New:
        return (
          <CreateSecretPage
            onFormSubmit={onSubmit}
            onFormCancel={noop}
            useTranslationStore={useTranslationStore}
            isLoading={false}
            apiError={null}
          />
        )
      case SecretType.Existing:
        return <div>Existing Secret Content</div>
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

        <SecretsHeader onChange={setSelectedType} />
        <Spacer size={5} />
        {renderContent()}
      </Drawer.Content>
    </Drawer.Root>
  )
}
