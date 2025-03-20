import { getHarnessConnectorDefinition, harnessConnectors } from '@utils/connectors/utils'
import noop from 'lodash-es/noop'

import { Button, ListActions, Spacer } from '@harnessio/ui/components'
import {
  ConnectorRightDrawer,
  ConnectorsProvider,
  ConnectorsRightDrawer,
  SandboxLayout,
  useConnectorsContext
} from '@harnessio/ui/views'

const ConnectorsListPageContent = (): JSX.Element => {
  const { setRightDrawer, setFormEntity } = useConnectorsContext()
  return (
    <SandboxLayout.Main className="max-w-[1040px]">
      <SandboxLayout.Content>
        <>
          <h1 className="text-24 text-foreground-1 font-medium leading-snug tracking-tight">Connectors</h1>
          <Spacer size={6} />
          <ListActions.Root>
            <ListActions.Right>
              <Button
                variant="default"
                onClick={() => {
                  setRightDrawer(ConnectorRightDrawer.Collection)
                }}
              >
                Create Connector
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setRightDrawer(ConnectorRightDrawer.Form)
                  setFormEntity({
                    type: 'connector',
                    data: {
                      type: 'AwsKms',
                      name: 'AWS KMS'
                    }
                  })
                }}
              >
                Edit Connector
              </Button>
            </ListActions.Right>
          </ListActions.Root>
          <Spacer size={5} />
        </>
      </SandboxLayout.Content>
      <ConnectorsRightDrawer
        useTranslationStore={() =>
          ({
            t: () => 'dummy',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            i18n: {} as any,
            changeLanguage: noop
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        }
        connectors={harnessConnectors}
        getConnectorDefinition={getHarnessConnectorDefinition}
      />
    </SandboxLayout.Main>
  )
}

// temp component for testing in standalone
const ConnectorsPage = (): JSX.Element => {
  return (
    <ConnectorsProvider>
      <ConnectorsListPageContent />
    </ConnectorsProvider>
  )
}

export { ConnectorsPage }
