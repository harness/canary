import { FC, useState } from 'react'

import { Button, ListActions, Spacer } from '@/components'
import { SandboxLayout } from '@/views'

import { ConnectorsRightDrawer } from './connectors-right-drawer'
import { ConnectorRightDrawer } from './types'

// temp component for testing in standalone
const ConnectorsListPageView: FC<any> = () => {
  const [rightDrawer, setRightDrawer] = useState<ConnectorRightDrawer>(ConnectorRightDrawer.None)
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
      <ConnectorsRightDrawer rightDrawer={rightDrawer} setRightDrawer={setRightDrawer} />
    </SandboxLayout.Main>
  )
}

export { ConnectorsListPageView }
