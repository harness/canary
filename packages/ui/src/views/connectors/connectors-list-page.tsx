import { Button, ListActions, Spacer } from '@/components'
import { SandboxLayout } from '@/views'

import { ConnectorsRightDrawer } from './connectors-right-drawer'
import { ConnectorsProvider } from './context/connectors-context'
import { useConnectorsContext } from './context/connectors-context'
import { ConnectorRightDrawer } from './types'

const ConnectorsListPageContent = (): JSX.Element => {
  const { setRightDrawer } = useConnectorsContext()
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
            </ListActions.Right>
          </ListActions.Root>
          <Spacer size={5} />
        </>
      </SandboxLayout.Content>
      <ConnectorsRightDrawer />
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
