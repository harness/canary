import { useEffect, useState } from 'react'

import { getHarnessConnectorDefinition, harnessConnectors } from '@utils/connectors/utils'
import { useTranslationStore } from '@utils/viewUtils'

import { Button, ListActions, Spacer } from '@harnessio/ui/components'
import {
  ConnectorItem,
  ConnectorListPage,
  ConnectorRightDrawer,
  ConnectorsProvider,
  ConnectorsRightDrawer,
  SandboxLayout,
  useConnectorsContext
} from '@harnessio/ui/views'

import mockConnectorsData from './mock-connectors-data.json'

const ConnectorsListPageContent = (): JSX.Element => {
  const { setRightDrawer, setFormEntity } = useConnectorsContext()
  const [drawerState, setDrawerState] = useState(ConnectorRightDrawer.None)

  useEffect(() => {
    setRightDrawer(drawerState)
  }, [drawerState])

  return (
    <SandboxLayout.Main className="max-w-[1040px]">
      <SandboxLayout.Content>
        <h1 className="text-24 text-foreground-1 font-medium leading-snug tracking-tight">Connectors</h1>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Right>
            <Button variant="default" onClick={() => setDrawerState(ConnectorRightDrawer.Collection)}>
              Create Connector
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        <ConnectorListPage
          connectors={
            mockConnectorsData.map(connector => ({
              ...connector,
              name: connector.connector.name,
              id: connector.connector.identifier,
              status: {
                status: connector.status.status,
                lastTestedAt: connector.status.lastTestedAt
              },
              lastModifiedAt: connector.lastModifiedAt
            })) as ConnectorItem[]
          }
          useTranslationStore={useTranslationStore}
          isLoading={false}
          onEditConnector={(_connector: ConnectorItem) => {
            setDrawerState(ConnectorRightDrawer.Form)
            setFormEntity({
              type: 'connector',
              data: { type: 'AwsKms', name: 'AWS KMS' }
            })
          }}
        />
      </SandboxLayout.Content>
      <ConnectorsRightDrawer
        initialDrawerState={drawerState}
        useTranslationStore={useTranslationStore}
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
