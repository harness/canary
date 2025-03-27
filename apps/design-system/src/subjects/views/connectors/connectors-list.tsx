import { useEffect, useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import {
  ConnectorListItem,
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
          name: connector.connector.name,
          identifier: connector.connector.identifier,
          status: connector.status.status,
          lastTestedAt: connector.status.lastTestedAt,
          lastModifiedAt: connector.lastModifiedAt,
          spec: {
            url: connector.connector.spec.url
          },
          gitDetails: {
            repoIdentifier: connector.gitDetails.repoIdentifier || '',
            branch: connector.gitDetails.branch || '',
            objectId: connector.gitDetails.objectId || ''
          }
        })) as ConnectorListItem[]
      }
      useTranslationStore={useTranslationStore}
      isLoading={false}
      setSearchQuery={noop}
      onEditConnector={(_connector: ConnectorListItem) => {
        setDrawerState(ConnectorRightDrawer.Form)
        setFormEntity({
          type: 'connector',
          data: { type: 'AwsKms', name: 'AWS KMS' }
        })
      }}
      onTestConnection={noop}
    />
  )
}

const ConnectorsListPage = (): JSX.Element => {
  return (
    <ConnectorsProvider>
      <ConnectorsListPageContent />
    </ConnectorsProvider>
  )
}

export { ConnectorsListPage }
