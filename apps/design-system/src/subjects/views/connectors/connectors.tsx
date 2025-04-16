import { useState } from 'react'

import { getHarnessConnectorDefinition, harnessConnectors } from '@utils/connectors/utils'
import { useTranslationStore } from '@utils/viewUtils'
import noop from 'lodash-es/noop'

import { InputFactory } from '@harnessio/forms'
import { Button, Drawer, ListActions, Spacer } from '@harnessio/ui/components'
import {
  ArrayInput,
  BooleanInput,
  ConnectorEntity,
  ConnectorEntityForm,
  ConnectorsPalette,
  ConnectorTestConnectionDialog,
  EntityIntent,
  GroupInput,
  ListInput,
  NumberInput,
  RadialInput,
  SandboxLayout,
  SelectInput,
  SeparatorInput,
  TextAreaInput,
  TextInput
} from '@harnessio/ui/views'

const inputComponentFactory = new InputFactory()
inputComponentFactory.registerComponent(new TextInput())
inputComponentFactory.registerComponent(new BooleanInput())
inputComponentFactory.registerComponent(new NumberInput())
inputComponentFactory.registerComponent(new ArrayInput())
inputComponentFactory.registerComponent(new ListInput())
inputComponentFactory.registerComponent(new TextAreaInput())
inputComponentFactory.registerComponent(new GroupInput())
inputComponentFactory.registerComponent(new SelectInput())
inputComponentFactory.registerComponent(new SeparatorInput())
inputComponentFactory.registerComponent(new RadialInput())

const ConnectorsListPageContent = (): JSX.Element => {
  const [connectorEntity, setConnectorEntity] = useState<ConnectorEntity | null>(null)
  const [isConnectorDrawerOpen, setIsConnectorDrawerOpen] = useState(false)
  const [isEditConnectorDrawerOpen, setIsEditConnectorDrawerOpen] = useState(false)
  const [isConnectorSelected, setIsConnectorSelected] = useState(false)
  const [intent, setIntent] = useState<EntityIntent>(EntityIntent.CREATE)
  const [testConnectionOpen, setTestConnectionOpen] = useState(false)
  return (
    <SandboxLayout.Main className="max-w-[1040px]">
      <SandboxLayout.Content>
        <>
          <h1 className="text-6 text-cn-foreground-1 font-medium leading-snug tracking-tight">Connectors</h1>
          <Spacer size={6} />
          <ListActions.Root>
            <ListActions.Right>
              <Button
                variant="default"
                onClick={() => {
                  setIsConnectorDrawerOpen(true)
                  setIntent(EntityIntent.CREATE)
                }}
              >
                Create Connector
              </Button>
              <Button
                variant="default"
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
              <Button variant="default" onClick={() => setTestConnectionOpen(true)}>
                Test Connection
              </Button>
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
        <Drawer.Content>
          <ConnectorsPalette
            useTranslationStore={useTranslationStore}
            connectors={harnessConnectors}
            onSelectConnector={() => setIsConnectorSelected(true)}
            setConnectorEntity={setConnectorEntity}
            requestClose={() => {
              setConnectorEntity(null)
              setIsConnectorDrawerOpen(false)
            }}
          />
          <Drawer.Root open={isConnectorSelected} onOpenChange={setIsConnectorSelected} direction="right" nested>
            <Drawer.Content>
              {connectorEntity ? (
                <ConnectorEntityForm
                  useTranslationStore={() =>
                    ({
                      t: () => 'dummy',
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      i18n: {} as any,
                      changeLanguage: noop
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }) as any
                  }
                  connector={connectorEntity}
                  onBack={() => setIsConnectorSelected(false)}
                  // onFormSubmit={handleFormSubmit}
                  getConnectorDefinition={getHarnessConnectorDefinition}
                  inputComponentFactory={inputComponentFactory}
                  intent={intent}
                />
              ) : null}
            </Drawer.Content>
          </Drawer.Root>
        </Drawer.Content>
      </Drawer.Root>
      <Drawer.Root open={isEditConnectorDrawerOpen} onOpenChange={setIsEditConnectorDrawerOpen} direction="right">
        <Drawer.Content>
          {connectorEntity ? (
            <ConnectorEntityForm
              useTranslationStore={useTranslationStore}
              connector={connectorEntity}
              onBack={() => setIsConnectorSelected(false)}
              getConnectorDefinition={getHarnessConnectorDefinition}
              inputComponentFactory={inputComponentFactory}
              intent={intent}
            />
          ) : null}
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
