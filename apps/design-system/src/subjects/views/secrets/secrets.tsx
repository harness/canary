import { useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { Button, Checkbox, Drawer, Spacer, StackedList } from '@harnessio/ui/components'
import { cn, NewSecretFormFields, NewSecretPage } from '@harnessio/ui/views'

export enum SecretType {
  New = 'new',
  Existing = 'existing'
}

export const SecretsPage = () => {
  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.New)

  const onSubmit = (data: NewSecretFormFields) => {
    console.log(data)
  }

  const renderContent = () => {
    switch (selectedType) {
      case SecretType.New:
        return (
          <NewSecretPage
            onFormSubmit={onSubmit}
            onFormCancel={noop}
            useTranslationStore={useTranslationStore}
            isLoading={false}
          />
        )
      case SecretType.Existing:
        return <div>Existing Secret Content</div>
      default:
        return null
    }
  }

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button>Add Secret</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title className="text-3xl">Secrets</Drawer.Title>
        </Drawer.Header>
        <Spacer size={5} />

        <div className="flex flex-col gap-2">
          <StackedList.Root className="overflow-hidden" borderBackground>
            <StackedList.Item
              className={cn('cursor-pointer !rounded px-5 py-3', {
                '!bg-background-4': selectedType === SecretType.New
              })}
              isHeader
              isLast
              onClick={() => setSelectedType(SecretType.New)}
              actions={
                <Checkbox
                  checked={selectedType === SecretType.New}
                  onCheckedChange={() => setSelectedType(SecretType.New)}
                />
              }
            >
              <StackedList.Field title="New Secret" description="Create a new secret." />
            </StackedList.Item>
          </StackedList.Root>
          <StackedList.Root className="overflow-hidden" borderBackground>
            <StackedList.Item
              className={cn('cursor-pointer !rounded px-5 py-3', {
                '!bg-background-4': selectedType === SecretType.Existing
              })}
              isHeader
              isLast
              onClick={() => setSelectedType(SecretType.Existing)}
              actions={
                <Checkbox
                  checked={selectedType === SecretType.Existing}
                  onCheckedChange={() => setSelectedType(SecretType.Existing)}
                />
              }
            >
              <StackedList.Field title="Existing Secret" description="Use an existing secret." />
            </StackedList.Item>
          </StackedList.Root>
        </div>
        <Spacer size={5} />
        {renderContent()}
      </Drawer.Content>
    </Drawer.Root>
  )
}
