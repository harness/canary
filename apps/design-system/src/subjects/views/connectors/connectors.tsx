import { useEffect, useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import {
  ConnectorItem,
  ConnectorListPage,
  ConnectorRightDrawer,
  ConnectorsProvider,
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
      setSearchQuery={noop}
    />
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
