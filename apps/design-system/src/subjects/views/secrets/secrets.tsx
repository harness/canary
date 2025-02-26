import { useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { Button, Checkbox, Drawer, Spacer, StackedList } from '@harnessio/ui/components'
import { NewSecretPage, SandboxLayout } from '@harnessio/ui/views'

export enum SecretType {
  New = 'new',
  Existing = 'existing'
}

export const SecretsPage = () => {
  const [selectedType, setSelectedType] = useState<SecretType>(SecretType.New)

  const renderContent = () => {
    switch (selectedType) {
      case SecretType.New:
        return (
          <NewSecretPage
            onFormSubmit={noop}
            onFormCancel={noop}
            useTranslationStore={useTranslationStore}
            isLoading={false}
          />
        )
      case SecretType.Existing:
        return (
          <SandboxLayout.Main>
            <SandboxLayout.Content className="mx-auto w-[550px]">Existing Secret Content</SandboxLayout.Content>
          </SandboxLayout.Main>
        )
      default:
        return null
    }
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Drawer.Root>
          <Drawer.Trigger>
            <Button>Add Secret</Button>
          </Drawer.Trigger>
          <Drawer.Content className="w-[550px]">
            <Drawer.Header>
              <Drawer.Title className="text-3xl">Secrets</Drawer.Title>
            </Drawer.Header>
            <Spacer size={5} />

            <div className="flex flex-col gap-2">
              <StackedList.Root className="overflow-hidden" borderBackground>
                <StackedList.Item
                  className="!rounded px-5 py-3 cursor-pointer"
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
                  className="!rounded px-5 py-3 cursor-pointer"
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
            {renderContent()}
          </Drawer.Content>
        </Drawer.Root>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
