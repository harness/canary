import { useState } from 'react'

import { getHarnessConnectorDefinition, harnessConnectors } from '@utils/connectors/utils'
import { useTranslationStore } from '@utils/viewUtils'

import { InputFactory } from '@harnessio/forms'
import { Button, Drawer, ListActions, Spacer } from '@harnessio/ui/components'
import {
  ArrayFormInput,
  BooleanFormInput,
  CardsFormInput,
  ConnectorEntity,
  ConnectorEntityForm,
  ConnectorsPalette,
  ConnectorTestConnectionDialog,
  EntityIntent,
  GroupFormInput,
  ListFormInput,
  NumberFormInput,
  SandboxLayout,
  SelectFormInput,
  SeparatorFormInput,
  TextareaFormInput,
  TextFormInput
} from '@harnessio/ui/views'

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

const ConnectorsListPageContent = (): JSX.Element => {
  const [connectorEntity, setConnectorEntity] = useState<ConnectorEntity | null>(null)
  const [isConnectorDrawerOpen, setIsConnectorDrawerOpen] = useState(false)
  const [isEditConnectorDrawerOpen, setIsEditConnectorDrawerOpen] = useState(false)
  const [isConnectorSelected, setIsConnectorSelected] = useState(false)
  const [intent, setIntent] = useState<EntityIntent>(EntityIntent.CREATE)
  const [testConnectionOpen, setTestConnectionOpen] = useState(false)

  const onCloseConnectorDrawer = () => {
    setIsConnectorDrawerOpen(false)
    setConnectorEntity(null)
  }

  return (
    <SandboxLayout.Main className="max-w-[1040px]">
      <SandboxLayout.Content>
        <>
          <h1 className="text-6 text-cn-foreground-1 font-medium leading-snug tracking-tight">Connectors</h1>
          <Spacer size={6} />
          <ListActions.Root>
            <ListActions.Right>
              <Button
                onClick={() => {
                  setIsConnectorDrawerOpen(true)
                  setIntent(EntityIntent.CREATE)
                }}
              >
                Create Connector
              </Button>
              <Button
                onClick={() => {
                  setConnectorEntity({
                    type: 'AwsKms',
                    name: 'AWS KMS test',
                    spec: {
                      name: 'AWS KMS test',
                      credential: 'AssumeIAMRole',
                      awsArn: 'sk-github',
                      region: 'ap-south-2'
                    }
                  })
                  setIsEditConnectorDrawerOpen(true)
                  setIntent(EntityIntent.EDIT)
                }}
              >
                Edit Connector
              </Button>
              <Button onClick={() => setTestConnectionOpen(true)}>Test Connection</Button>
            </ListActions.Right>
          </ListActions.Root>
          <Spacer size={5} />
        </>
      </SandboxLayout.Content>

      <ConnectorTestConnectionDialog
        title="Test Connection"
        apiUrl="https://docker.harness.io"
        status="error"
        percentageFilled={50}
        errorMessage="Error Encountered (Update the username & password. Check if the provided credentials are correct. Invalid Docker Registry credentials)."
        description="Validating connector authentication and permissions"
        isOpen={testConnectionOpen}
        onClose={() => setTestConnectionOpen(false)}
        viewDocClick={() => {
          console.log('')
        }}
        useTranslationStore={useTranslationStore}
        errorData={{ errors: [{ reason: 'Unexpected Error', message: 'Bad credentials' }] }}
      />

      <Drawer.Root open={isConnectorDrawerOpen} onOpenChange={setIsConnectorDrawerOpen} direction="right">
        <ConnectorsPalette
          useTranslationStore={useTranslationStore}
          connectors={harnessConnectors}
          onSelectConnector={() => setIsConnectorSelected(true)}
          setConnectorEntity={setConnectorEntity}
          requestClose={onCloseConnectorDrawer}
          isDrawer
        />
        <Drawer.Root open={isConnectorSelected} onOpenChange={setIsConnectorSelected} direction="right" nested>
          <Drawer.Content nested>
            {!!connectorEntity && (
              <ConnectorEntityForm
                useTranslationStore={useTranslationStore}
                connector={connectorEntity}
                onBack={() => setIsConnectorSelected(false)}
                // onFormSubmit={handleFormSubmit}
                getConnectorDefinition={getHarnessConnectorDefinition}
                inputComponentFactory={inputComponentFactory}
                intent={intent}
                isDrawer
              />
            )}
          </Drawer.Content>
        </Drawer.Root>
      </Drawer.Root>
      <Drawer.Root open={isEditConnectorDrawerOpen} onOpenChange={setIsEditConnectorDrawerOpen} direction="right">
        <Drawer.Content>
          {!!connectorEntity && (
            <ConnectorEntityForm
              useTranslationStore={useTranslationStore}
              connector={connectorEntity}
              onBack={() => setIsEditConnectorDrawerOpen(false)}
              getConnectorDefinition={getHarnessConnectorDefinition}
              inputComponentFactory={inputComponentFactory}
              intent={intent}
              isDrawer
            />
          )}
        </Drawer.Content>
      </Drawer.Root>
    </SandboxLayout.Main>
  )
}

// temp component for testing in standalone
const ConnectorsPage = (): JSX.Element => {
  return <ConnectorsListPageContent />
}

export { ConnectorsPage }
