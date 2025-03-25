import { useEffect, useState } from 'react'

import { getHarnessConnectorDefinition, harnessConnectors } from '@utils/connectors/utils'
import noop from 'lodash-es/noop'

import { Button, ListActions, Spacer } from '@harnessio/ui/components'
import {
  ConnectorItem,
  ConnectorRightDrawer,
  ConnectorsList,
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

  const mockUseTranslationStore = () =>
    ({
      t: () => 'dummy',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n: {} as any,
      changeLanguage: noop
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any

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
                  setDrawerState(ConnectorRightDrawer.Collection)
                }}
              >
                Create Connector
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setDrawerState(ConnectorRightDrawer.Form)
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
        <ConnectorsList
          connectors={
            mockConnectorsData.map(connector => {
              return {
                ...connector,
                name: connector.connector.name,
                id: connector.connector.identifier
              }
            }) as ConnectorItem[]
          }
          useTranslationStore={mockUseTranslationStore}
          isLoading={false}
        />
      </SandboxLayout.Content>
      <ConnectorsRightDrawer
        initialDrawerState={drawerState}
        useTranslationStore={mockUseTranslationStore}
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
