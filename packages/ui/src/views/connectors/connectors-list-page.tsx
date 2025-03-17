import { Button, ListActions, Spacer } from '@/components'
import { SandboxLayout } from '@/views'

import { ConnectorsRightDrawer } from './connectors-right-drawer'
import { ConnectorsProvider, useConnectorsContext } from './context/connectors-context'
import { getHarnessConnectorDefinition, harnessConnectors } from './harness-connectors/utils'
import { ConnectorRightDrawer } from './types'

const ConnectorsListPageContent = (): JSX.Element => {
  const { setRightDrawer, setFormEntity } = useConnectorsContext()
  return (
    <SandboxLayout.Main className="max-w-[1040px]">
      <SandboxLayout.Content>
        <>
          <h1 className="text-24 font-medium leading-snug tracking-tight text-foreground-1">Connectors</h1>
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
                      identifier: 'AWS_KMS',
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
      <ConnectorsRightDrawer connectors={harnessConnectors} getConnectorDefinition={getHarnessConnectorDefinition} />
    </SandboxLayout.Main>
  )
}

// temp component for testing in standalone
const ConnectorsListPageView = (): JSX.Element => {
  return (
    <ConnectorsProvider>
      <ConnectorsListPageContent />
    </ConnectorsProvider>
  )
}

export { ConnectorsListPageView }
